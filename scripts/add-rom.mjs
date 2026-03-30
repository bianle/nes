import { confirm, input } from '@inquirer/prompts'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROMS_PATH = path.resolve(__dirname, '../src/data/roms.json')

function isServerPathOrHttpUrl(value) {
  if (!value) return false
  const trimmed = value.trim()
  if (trimmed.startsWith('/')) return true
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      // eslint-disable-next-line no-new
      new URL(trimmed)
      return true
    } catch {
      return false
    }
  }
  return false
}

const romSchema = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, '标题不能为空')
    .max(40, '标题最多 40 个字符'),
  // 只要求 title 和 romUrl，其它留空时写入空字符串/空数组
  description: z
    .string()
    .trim()
    .max(120, '简介最多 120 个字符'),
  tags: z
    .array(z.string().trim().min(1))
    .max(8, '标签最多 8 个'),
  cover: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => value === '' || value === undefined || isServerPathOrHttpUrl(value),
      '封面地址必须是合法 URL 或站内路径',
    ),
  romUrl: z
    .string()
    .trim()
    .min(1, 'ROM 地址不能为空')
    .refine((value) => isServerPathOrHttpUrl(value), 'ROM 地址必须是合法 URL 或站内路径'),
})

function normalizeTags(raw) {
  if (!raw || !raw.trim()) return []
  const unique = new Set(
    raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  )
  return [...unique]
}

function getNextId(roms) {
  const maxId = roms.reduce((acc, item) => {
    const n = Number(item.id)
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 0)
  return String(maxId + 1)
}

function printZodError(error) {
  for (const issue of error.issues) {
    const field = issue.path[0] || '字段'
    console.error(`- ${field}: ${issue.message}`)
  }
}

async function main() {
  const fileText = await readFile(ROMS_PATH, 'utf8')
  const roms = JSON.parse(fileText)
  if (!Array.isArray(roms)) {
    throw new Error('roms.json 格式异常：根节点必须是数组')
  }

  const nextId = getNextId(roms)
  console.log(`\n准备新增 ROM，自动分配 id: ${nextId}\n`)

  const title = await input({
    message: '游戏标题（必填）',
    validate: (value) => (value.trim() ? true : '标题不能为空'),
  })

  const description = await input({
    message: '一句话简介（可留空）',
    default: '',
  })

  const tagsRaw = await input({
    message: '标签（逗号分隔，例如：动作,双人，可留空）',
    default: '',
  })

  const coverRaw = await input({
    message: '封面 URL（可留空）',
    default: '',
  })

  const romUrl = await input({
    message: 'ROM 地址（必填，支持 /roms/xxx.nes 或 https://...）',
    validate: (value) => (value.trim() ? true : 'ROM URL 不能为空'),
  })

  const draft = {
    id: nextId,
    title: title.trim(),
    description: description.trim(),
    tags: normalizeTags(tagsRaw),
    cover: coverRaw.trim(),
    romUrl: romUrl.trim(),
  }

  const parsed = romSchema.safeParse(draft)
  if (!parsed.success) {
    console.error('\n输入校验失败：')
    printZodError(parsed.error)
    process.exit(1)
  }

  const duplicatedRomUrl = roms.some((item) => item.romUrl === parsed.data.romUrl)
  if (duplicatedRomUrl) {
    console.error('\n输入校验失败：')
    console.error('- romUrl: 与现有 ROM 地址重复')
    process.exit(1)
  }

  const duplicatedTitle = roms.some((item) => item.title === parsed.data.title)
  if (duplicatedTitle) {
    console.error('\n输入校验失败：')
    console.error('- title: 与现有游戏标题重复')
    process.exit(1)
  }

  const output = parsed.data

  console.log('\n将写入以下内容：')
  console.log(JSON.stringify(output, null, 2))

  const ok = await confirm({
    message: '确认写入 roms.json ?',
    default: true,
  })
  if (!ok) {
    console.log('\n已取消写入。')
    return
  }

  const nextRoms = [...roms, output]
  await writeFile(ROMS_PATH, `${JSON.stringify(nextRoms, null, 2)}\n`, 'utf8')
  console.log(`\n新增成功：${output.title}（id=${output.id}）`)
}

main().catch((error) => {
  console.error('\n执行失败：', error instanceof Error ? error.message : error)
  process.exit(1)
})
