export type AccentPreset =
  | 'emerald'
  | 'rose'
  | 'sky'
  | 'cyan'
  | 'violet'
  | 'amber'

export const ACCENT_STORAGE_KEY = 'nes-accent-preset'

export const ACCENT_PRESETS: {
  id: AccentPreset
  label: string
  /** 色块展示用（浅色主题主色） */
  swatch: string
}[] = [
  { id: 'emerald', label: '翠绿', swatch: '#047857' },
  { id: 'rose', label: '玫粉', swatch: '#9d174d' },
  { id: 'sky', label: '天蓝', swatch: '#0369a1' },
  { id: 'cyan', label: '青色', swatch: '#0e7498' },
  { id: 'violet', label: '紫罗兰', swatch: '#6d28d9' },
  { id: 'amber', label: '琥珀', swatch: '#b45309' },
]

export function applyAccentPreset(preset: AccentPreset) {
  const root = document.documentElement
  if (preset === 'emerald') {
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
    if (
      v === 'emerald' ||
      v === 'rose' ||
      v === 'sky' ||
      v === 'cyan' ||
      v === 'violet' ||
      v === 'amber'
    ) {
      return v
    }
  } catch {
    /* ignore */
  }
  return 'emerald'
}
