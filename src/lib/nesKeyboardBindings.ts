/** 与 jsnes Controller.BUTTON_* 一致 */
export const BTN = {
  A: 0,
  B: 1,
  SEL: 2,
  START: 3,
  UP: 4,
  DOWN: 5,
  LEFT: 6,
  RIGHT: 7,
} as const

export type PadAction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'a'
  | 'b'
  | 'select'
  | 'start'

export type PlayerBindings = Record<PadAction, number>

export type StructuredBindings = { p1: PlayerBindings; p2: PlayerBindings }

const STORAGE_KEY = 'nes-keyboard-structured-v1'

/** 默认与原先 GamePage 中 DEFAULT_KEYBOARD_KEYS 一致 */
export const DEFAULT_STRUCTURED: StructuredBindings = {
  p1: {
    up: 87,
    down: 83,
    left: 65,
    right: 68,
    a: 75,
    b: 74,
    select: 49,
    start: 50,
  },
  p2: {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    a: 101,
    b: 100,
    select: 103,
    start: 104,
  },
}

const ACTION_TO_BTN: Record<PadAction, number> = {
  up: BTN.UP,
  down: BTN.DOWN,
  left: BTN.LEFT,
  right: BTN.RIGHT,
  a: BTN.A,
  b: BTN.B,
  select: BTN.SEL,
  start: BTN.START,
}

const BTN_TO_ACTION = Object.fromEntries(
  Object.entries(ACTION_TO_BTN).map(([a, b]) => [b, a as PadAction]),
) as Record<number, PadAction>

export const PAD_ACTION_LABELS: Record<PadAction, string> = {
  up: '上',
  down: '下',
  left: '左',
  right: '右',
  a: 'A',
  b: 'B',
  select: 'Select',
  start: 'Start',
}

/** 自定义列表展示顺序 */
export const PAD_ACTION_EDIT_ORDER: PadAction[] = [
  'up',
  'down',
  'left',
  'right',
  'a',
  'b',
  'select',
  'start',
]

export type NesKeyMap = Record<number, [number, number, string]>

export function keyCodeToLabel(code: number): string {
  const m: Record<number, string> = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Ctrl',
    18: 'Alt',
    27: 'Esc',
    32: 'Space',
    33: 'PgUp',
    34: 'PgDn',
    37: '←',
    38: '↑',
    39: '→',
    40: '↓',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    96: 'Num0',
    97: 'Num1',
    98: 'Num2',
    99: 'Num3',
    100: 'Num4',
    101: 'Num5',
    102: 'Num6',
    103: 'Num7',
    104: 'Num8',
    105: 'Num9',
    106: 'Num*',
    107: 'Num+',
    109: 'Num-',
    110: 'Num.',
    111: 'Num/',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'",
  }
  return m[code] ?? `#${code}`
}

export function structuredToFlat(s: StructuredBindings): NesKeyMap {
  const out: NesKeyMap = {}
  for (const act of Object.keys(s.p1) as PadAction[]) {
    const kc = s.p1[act]
    out[kc] = [1, ACTION_TO_BTN[act], keyCodeToLabel(kc)]
  }
  for (const act of Object.keys(s.p2) as PadAction[]) {
    const kc = s.p2[act]
    out[kc] = [2, ACTION_TO_BTN[act], keyCodeToLabel(kc)]
  }
  return out
}

export function assignBinding(
  s: StructuredBindings,
  player: 1 | 2,
  action: PadAction,
  newKeyCode: number,
): StructuredBindings {
  const next: StructuredBindings = {
    p1: { ...s.p1 },
    p2: { ...s.p2 },
  }
  const pl = player === 1 ? 'p1' : 'p2'
  const def = DEFAULT_STRUCTURED

  for (const p of ['p1', 'p2'] as const) {
    for (const act of Object.keys(next[p]) as PadAction[]) {
      if (next[p][act] === newKeyCode) {
        if (p === pl && act === action) continue
        next[p][act] = def[p][act]
      }
    }
  }

  next[pl][action] = newKeyCode
  return next
}

export function loadStructuredBindings(): StructuredBindings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STRUCTURED
    const p = JSON.parse(raw) as unknown
    if (!p || typeof p !== 'object') return DEFAULT_STRUCTURED
    const o = p as Record<string, unknown>
    const p1 = o.p1 as Record<string, number> | undefined
    const p2 = o.p2 as Record<string, number> | undefined
    if (!p1 || !p2) return DEFAULT_STRUCTURED
    const merged: StructuredBindings = {
      p1: { ...DEFAULT_STRUCTURED.p1 },
      p2: { ...DEFAULT_STRUCTURED.p2 },
    }
    for (const act of Object.keys(merged.p1) as PadAction[]) {
      const v = p1[act]
      if (typeof v === 'number' && v >= 0 && v < 256) merged.p1[act] = v
    }
    for (const act of Object.keys(merged.p2) as PadAction[]) {
      const v = p2[act]
      if (typeof v === 'number' && v >= 0 && v < 256) merged.p2[act] = v
    }
    return merged
  } catch {
    return DEFAULT_STRUCTURED
  }
}

export function saveStructuredBindings(s: StructuredBindings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* ignore quota */
  }
}

/** 从平面映射反推结构化（用于校验或迁移） */
export function flatToStructured(f: NesKeyMap): StructuredBindings {
  const next: StructuredBindings = {
    p1: { ...DEFAULT_STRUCTURED.p1 },
    p2: { ...DEFAULT_STRUCTURED.p2 },
  }
  for (const [kcStr, tuple] of Object.entries(f)) {
    const kc = Number(kcStr)
    if (Number.isNaN(kc)) continue
    const pl = tuple[0]
    const btn = tuple[1]
    const act = BTN_TO_ACTION[btn]
    if (!act) continue
    if (pl === 1) next.p1[act] = kc
    else if (pl === 2) next.p2[act] = kc
  }
  return next
}
