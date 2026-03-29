export type AccentPreset =
  | 'rose'
  | 'violet'
  | 'amber'
  | 'coral'
  | 'lime'
  | 'fuchsia'
  | 'mint'
  | 'sakura'
  | 'neon'

export const ACCENT_STORAGE_KEY = 'nes-accent-preset'

export const ACCENT_PRESETS: {
  id: AccentPreset
  label: string
  /** 色块展示用（浅色主题主色） */
  swatch: string
}[] = [
  { id: 'rose', label: '玫粉', swatch: '#9d174d' },
  { id: 'violet', label: '紫罗兰', swatch: '#6d28d9' },
  { id: 'amber', label: '琥珀', swatch: '#b45309' },
  { id: 'coral', label: '珊瑚红', swatch: '#f56565' },
  { id: 'lime', label: '青柠', swatch: '#84cc16' },
  { id: 'fuchsia', label: '品红', swatch: '#c026d3' },
  { id: 'mint', label: '薄荷', swatch: '#14b8a6' },
  { id: 'sakura', label: '樱花', swatch: '#ec4899' },
  { id: 'neon', label: '电光青', swatch: '#06b6d4' },
]

export function applyAccentPreset(preset: AccentPreset) {
  const root = document.documentElement
  if (preset === 'rose') {
    root.removeAttribute('data-accent')
  } else {
    root.setAttribute('data-accent', preset)
  }
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, preset)
  } catch {
    /* ignore */
  }
}

export function readStoredAccentPreset(): AccentPreset {
  try {
    const v = localStorage.getItem(ACCENT_STORAGE_KEY)
    if (v && ACCENT_PRESETS.some((p) => p.id === v)) {
      return v as AccentPreset
    }
  } catch {
    /* ignore */
  }
  return 'rose'
}
