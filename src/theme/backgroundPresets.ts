export type BackgroundPreset = 'neutral' | 'warm' | 'cool' | 'paper' | 'oled'

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
  { id: 'oled', label: '纯黑', lightSwatch: '#fafafa', darkSwatch: '#000000' },
]

export function applyBackgroundPreset(preset: BackgroundPreset) {
  const root = document.documentElement
  if (preset === 'neutral') {
    root.removeAttribute('data-bg')
  } else {
    root.setAttribute('data-bg', preset)
  }
  try {
    localStorage.setItem(BG_STORAGE_KEY, preset)
  } catch {
    /* ignore */
  }
}

export function readStoredBackgroundPreset(): BackgroundPreset {
  try {
    const v = localStorage.getItem(BG_STORAGE_KEY)
    if (v && BACKGROUND_PRESETS.some((p) => p.id === v)) {
      return v as BackgroundPreset
    }
  } catch {
    /* ignore */
  }
  return 'neutral'
}
