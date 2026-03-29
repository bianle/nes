import { Moon, Sun } from 'lucide-react'
import { useCallback, useLayoutEffect, useState } from 'react'

const STORAGE_KEY = 'nes-theme'

type ThemeMode = 'light' | 'dark'

function readStoredTheme(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'dark'
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute('data-theme', mode)
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme())

  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  const isDark = theme === 'dark'
  const label = isDark ? '切换为浅色' : '切换为深色'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      aria-label={label}
      title={label}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-[var(--surface-2)] px-[3px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
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
  )
}
