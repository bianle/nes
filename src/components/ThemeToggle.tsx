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
      onClick={toggle}
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-h)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {isDark ? (
        <Sun size={14} strokeWidth={2} aria-hidden />
      ) : (
        <Moon size={14} strokeWidth={2} aria-hidden />
      )}
    </button>
  )
}
