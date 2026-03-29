import { useEffect, useId, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useGlobalSearch } from '../context/GlobalSearchContext'
import { roms } from '../data/roms'

const chipBase =
  'rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
const chipIdle =
  'border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]'
const chipActive =
  'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]'

export function GlobalSearchModal() {
  const titleId = useId()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const {
    isOpen,
    close,
    query,
    setQuery,
    activeTag,
    setActiveTag,
  } = useGlobalSearch()

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const r of roms) {
      for (const t of r.tags) set.add(t)
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
  }, [])

  const filteredRoms = useMemo(() => {
    let list = roms
    if (activeTag) {
      list = list.filter((r) => r.tags.includes(activeTag))
    }
    const q = query.trim()
    if (q) {
      const needle = q.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(needle))
    }
    return list
  }, [activeTag, query])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, close])

  if (!isOpen) return null

  const goToGame = (id: string) => {
    navigate(`/game/${id}`)
    close()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[rgba(8,8,12,0.5)] p-4 pb-10 pt-[min(12vh,5rem)] backdrop-blur-[2px]"
      role="presentation"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] flex w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] text-left shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-2 sm:px-4">
          <h2
            id={titleId}
            className="m-0 text-sm font-semibold text-[var(--text-h)]"
          >
            搜索游戏
          </h2>
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-h)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            aria-label="关闭"
            onClick={close}
          >
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="border-b border-[var(--border)] p-3 sm:p-4">
          <label htmlFor={inputId} className="sr-only">
            游戏名关键字
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入游戏名…"
            autoComplete="off"
            className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2.5 text-sm text-[var(--text-h)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] outline-none placeholder:text-[var(--text-muted)] focus-visible:border-[var(--accent-border)] focus-visible:ring-2 focus-visible:ring-[var(--accent-soft)] [color-scheme:inherit]"
          />
          <p className="mt-2 text-[11px] text-[var(--text-muted)]">
            快捷键 Ctrl+K / ⌘K 打开或关闭
          </p>
        </div>

        <div className="border-b border-[var(--border)] px-3 py-3 sm:px-4">
          <p className="m-0 mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
            标签
          </p>
          <div className="flex flex-wrap gap-2" role="toolbar" aria-label="按标签筛选">
            <button
              type="button"
              className={`${chipBase} ${activeTag === null ? chipActive : chipIdle}`}
              aria-pressed={activeTag === null}
              onClick={() => setActiveTag(null)}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`${chipBase} ${activeTag === tag ? chipActive : chipIdle}`}
                aria-pressed={activeTag === tag}
                onClick={() =>
                  setActiveTag((v) => (v === tag ? null : tag))
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[min(50vh,360px)] overflow-y-auto px-2 py-2 sm:px-3">
          <p className="m-0 mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
            搜索结果
          </p>
          {filteredRoms.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-[var(--text-muted)]">
              没有匹配的游戏
            </p>
          ) : (
            <ul className="m-0 list-none p-0">
              {filteredRoms.map((rom) => (
                <li key={rom.id} className="border-b border-[var(--border)] last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2.5 text-left transition-colors hover:bg-[var(--accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    onClick={() => goToGame(rom.id)}
                  >
                    <div className="aspect-[3/4] w-11 shrink-0 overflow-hidden rounded-[6px] bg-[#0d0e12]">
                      <img
                        className="block h-full w-full object-cover"
                        src={rom.cover}
                        alt=""
                        width={180}
                        height={240}
                        loading="lazy"
                      />
                    </div>
                    <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-[var(--text-h)]">
                      {rom.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
