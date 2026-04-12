import { Moon, Palette, Sun } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ACCENT_PRESETS,
  type AccentPreset,
  applyAccentPreset,
  readStoredAccentPreset,
} from '../theme/accentPresets'
import {
  BACKGROUND_PRESETS,
  type BackgroundPreset,
  readBackgroundPresetForTheme,
  syncDataBgFromPresets,
  writeBackgroundPresetForTheme,
} from '../theme/backgroundPresets'

export default function AccentPicker() {
  const STORAGE_KEY = 'nes-theme'
  type ThemeMode = 'light' | 'dark'
  const readStoredTheme = (): ThemeMode => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      if (v === 'light' || v === 'dark') return v
    } catch {
      /* ignore */
    }
    return 'dark'
  }
  const applyTheme = (mode: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
  }

  const [preset, setPreset] = useState<AccentPreset>(() =>
    readStoredAccentPreset(),
  )
  const [bgLight, setBgLight] = useState<BackgroundPreset>(() =>
    readBackgroundPresetForTheme('light'),
  )
  const [bgDark, setBgDark] = useState<BackgroundPreset>(() =>
    readBackgroundPresetForTheme('dark'),
  )
  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme())
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    applyAccentPreset(preset)
  }, [preset])

  useLayoutEffect(() => {
    syncDataBgFromPresets(theme, bgLight, bgDark)
  }, [theme, bgLight, bgDark])

  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const select = useCallback((id: AccentPreset) => {
    setPreset(id)
  }, [])
  const selectBg = useCallback(
    (id: BackgroundPreset) => {
      writeBackgroundPresetForTheme(theme, id)
      if (theme === 'light') setBgLight(id)
      else setBgDark(id)
    },
    [theme],
  )
  const isDark = theme === 'dark'
  const themeLabel = isDark ? '切换为浅色' : '切换为深色'

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[var(--accent)] transition-colors hover:bg-[var(--surface-2)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        aria-label="主题设置"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="主题设置"
      >
        <Palette size={14} strokeWidth={2} aria-hidden />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-1 min-w-[200px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-2"
          role="dialog"
          aria-label="主题设置"
        >
          <div className="mb-2 flex items-center justify-between gap-2 border-b border-[var(--border)] px-1 pb-2">
            <p className="text-xs font-medium text-[var(--text-muted)]">明暗</p>
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              aria-label={themeLabel}
              title={themeLabel}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-[var(--input-border-color)] bg-[var(--switch-bg-color)] px-[3px] transition-colors hover:border-[var(--accent-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute left-[3px] top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full shadow-sm transition-transform duration-200 ease-out ${
                  isDark
                    ? 'translate-x-[18px] bg-[#0a0a0c] text-white'
                    : 'translate-x-0 bg-[var(--bg)] text-amber-500'
                }`}
              >
                {isDark ? (
                  <Moon className="size-2.5" strokeWidth={2} aria-hidden />
                ) : (
                  <Sun className="size-2.5" strokeWidth={2} aria-hidden />
                )}
              </span>
            </button>
          </div>

          <p className="mb-2 px-1 text-xs font-medium text-[var(--text-muted)]">
            背景
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {BACKGROUND_PRESETS.map(({ id, label, lightSwatch, darkSwatch }) => {
              const active =
                (theme === 'light' ? bgLight : bgDark) === id
              const swatch = isDark ? darkSwatch : lightSwatch
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectBg(id)}
                  className={`flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors hover:bg-[var(--accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    active ? 'bg-[var(--accent-soft)]' : ''
                  }`}
                  title={label}
                  aria-label={label}
                  aria-pressed={active}
                >
                  <span
                    className={`size-8 rounded-full outline outline-1 outline-black/10 dark:outline-white/15 ${
                      active
                        ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface-2)]'
                        : ''
                    }`}
                    style={{ backgroundColor: swatch }}
                  />
                  <span className="max-w-[4.5rem] truncate text-center text-[11px] text-[var(--text-muted)]">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mb-2 px-1 text-xs font-medium text-[var(--text-muted)]">
            主题色
          </p>
          <div className="flex flex-wrap gap-2">
            {ACCENT_PRESETS.map(({ id, label, swatch }) => {
              const active = preset === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => select(id)}
                  className={`flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors hover:bg-[var(--accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    active ? 'bg-[var(--accent-soft)]' : ''
                  }`}
                  title={label}
                  aria-label={label}
                  aria-pressed={active}
                >
                  <span
                    className={`size-8 rounded-full outline outline-1 outline-black/10 dark:outline-white/15 ${
                      active
                        ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface-2)]'
                        : ''
                    }`}
                    style={{ backgroundColor: swatch }}
                  />
                  <span className="max-w-[4.5rem] truncate text-center text-[11px] text-[var(--text-muted)]">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
