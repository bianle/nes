import { Palette } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ACCENT_PRESETS,
  type AccentPreset,
  applyAccentPreset,
  readStoredAccentPreset,
} from '../theme/accentPresets'

export default function AccentPicker() {
  const [preset, setPreset] = useState<AccentPreset>(() =>
    readStoredAccentPreset(),
  )
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    applyAccentPreset(preset)
  }, [preset])

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
    setOpen(false)
  }, [])

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-h)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        aria-label="主题色"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="主题色"
      >
        <Palette size={20} strokeWidth={2} aria-hidden />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-1 min-w-[200px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-2"
          role="dialog"
          aria-label="选择主题色"
        >
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
                  className="flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors hover:bg-[var(--accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  title={label}
                  aria-label={label}
                  aria-pressed={active}
                >
                  <span
                    className="size-8 rounded-full outline outline-1 outline-black/10 dark:outline-white/15"
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
