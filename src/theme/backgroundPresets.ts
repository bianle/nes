export type BackgroundPreset = 'neutral' | 'warm' | 'cool' | 'paper' | 'oled'

export const BG_STORAGE_KEY_LIGHT = 'nes-bg-preset-light'
export const BG_STORAGE_KEY_DARK = 'nes-bg-preset-dark'

/** 旧版单一键，读取时会迁移到 light/dark 并删除 */
export const BG_STORAGE_KEY = 'nes-bg-preset'

export const BACKGROUND_PRESETS: {
  id: BackgroundPreset
  label: string
  /** 浅色主题下的主背景预览 */
  lightSwatch: string
  /** 深色主题下的主背景预览 */
  darkSwatch: string
}[] = [
  { id: 'neutral', label: '默认', lightSwatch: '#ffffff', darkSwatch: '#16171d' },
  { id: 'warm', label: '暖色', lightSwatch: '#faf8f5', darkSwatch: '#1a1816' },
  { id: 'cool', label: '冷色', lightSwatch: '#f5f7fa', darkSwatch: '#12161c' },
  { id: 'paper', label: '纸质', lightSwatch: '#f4f0e6', darkSwatch: '#1c1914' },
  { id: 'oled', label: '高对比', lightSwatch: '#fafafa', darkSwatch: '#000000' },
]

function isValidPreset(v: string | null): v is BackgroundPreset {
  return !!v && BACKGROUND_PRESETS.some((p) => p.id === v)
}

let legacyMigrated = false

function migrateLegacyBgStorage(): void {
  if (legacyMigrated) return
  legacyMigrated = true
  try {
    const legacy = localStorage.getItem(BG_STORAGE_KEY)
    if (!legacy || !isValidPreset(legacy)) return
    if (!localStorage.getItem(BG_STORAGE_KEY_LIGHT)) {
      localStorage.setItem(BG_STORAGE_KEY_LIGHT, legacy)
    }
    if (!localStorage.getItem(BG_STORAGE_KEY_DARK)) {
      localStorage.setItem(BG_STORAGE_KEY_DARK, legacy)
    }
    localStorage.removeItem(BG_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function syncDataBgAttribute(preset: BackgroundPreset): void {
  const root = document.documentElement
  if (preset === 'neutral') {
    root.removeAttribute('data-bg')
  } else {
    root.setAttribute('data-bg', preset)
  }
}

/** 从 localStorage 读取某明暗下的背景预设（会先迁移旧键） */
export function readBackgroundPresetForTheme(mode: 'light' | 'dark'): BackgroundPreset {
  migrateLegacyBgStorage()
  try {
    const key = mode === 'light' ? BG_STORAGE_KEY_LIGHT : BG_STORAGE_KEY_DARK
    const v = localStorage.getItem(key)
    if (isValidPreset(v)) return v
  } catch {
    /* ignore */
  }
  return 'neutral'
}

/** 仅写入 localStorage，不改动 DOM */
export function writeBackgroundPresetForTheme(
  mode: 'light' | 'dark',
  preset: BackgroundPreset,
): void {
  migrateLegacyBgStorage()
  try {
    localStorage.setItem(
      mode === 'light' ? BG_STORAGE_KEY_LIGHT : BG_STORAGE_KEY_DARK,
      preset,
    )
  } catch {
    /* ignore */
  }
}

/** 按当前明暗从存储恢复并设置 `data-bg`（切换主题后调用） */
export function applyStoredBackgroundForTheme(mode: 'light' | 'dark'): void {
  const preset = readBackgroundPresetForTheme(mode)
  syncDataBgAttribute(preset)
}

export function syncDataBgFromPresets(
  theme: 'light' | 'dark',
  bgLight: BackgroundPreset,
  bgDark: BackgroundPreset,
): void {
  syncDataBgAttribute(theme === 'light' ? bgLight : bgDark)
}
