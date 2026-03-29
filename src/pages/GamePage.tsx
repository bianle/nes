import { Keyboard, Loader2, Maximize2, Minimize2, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { Browser } from 'jsnes'
import { getRomById } from '../data/roms'

/** 与 jsnes Controller.BUTTON_* 一致：0=A … 7=右 */
const BTN = { A: 0, B: 1, SEL: 2, START: 3, UP: 4, DOWN: 5, LEFT: 6, RIGHT: 7 } as const

/** jsnes 键盘映射：keyCode -> [手柄号, 按键, 显示名] */
const DEFAULT_KEYBOARD_KEYS: Record<number, [number, number, string]> = {
  // 1P：K = A，J = B
  74: [1, BTN.B, 'J'],
  75: [1, BTN.A, 'K'],
  // 1P：WASD（方向键留给 2P，同一 keyCode 无法绑两手柄）
  87: [1, BTN.UP, 'W'],
  83: [1, BTN.DOWN, 'S'],
  65: [1, BTN.LEFT, 'A'],
  68: [1, BTN.RIGHT, 'D'],
  49: [1, BTN.SEL, '1'],
  50: [1, BTN.START, '2'],
  // 2P：方向键
  38: [2, BTN.UP, 'Up'],
  40: [2, BTN.DOWN, 'Down'],
  37: [2, BTN.LEFT, 'Left'],
  39: [2, BTN.RIGHT, 'Right'],
  // 2P：小键盘 5 = A，4 = B；7 = Select，8 = Start
  100: [2, BTN.B, 'Num-4'],
  101: [2, BTN.A, 'Num-5'],
  103: [2, BTN.SEL, 'Num-7'],
  104: [2, BTN.START, 'Num-8'],
}

export default function GamePage() {
  const { id } = useParams<{ id: string }>()
  const rom = id ? getRomById(id) : undefined
  const containerRef = useRef<HTMLDivElement>(null)
  const gameFrameRef = useRef<HTMLDivElement>(null)
  const [gameFullscreen, setGameFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [keysHelpOpen, setKeysHelpOpen] = useState(false)
  const [keysHelpTab, setKeysHelpTab] = useState<'1p' | '2p'>('1p')
  const keysHelpTitleId = useId()

  useEffect(() => {
    if (!keysHelpOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setKeysHelpOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [keysHelpOpen])

  useEffect(() => {
    if (keysHelpOpen) setKeysHelpTab('1p')
  }, [keysHelpOpen])

  useEffect(() => {
    const sync = () => {
      setGameFullscreen(document.fullscreenElement === gameFrameRef.current)
    }
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  useEffect(() => {
    if (!rom) return
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let browser: Browser | null = null
    let req: XMLHttpRequest | undefined

    const fitToContainer = () => {
      if (cancelled) return
      browser?.fitInParent()
    }

    const ro = new ResizeObserver(() => {
      fitToContainer()
    })
    ro.observe(container)

    setError(null)
    setLoading(true)

    void import('jsnes')
      .then(({ Browser: JsnBrowser }) => {
        if (cancelled) return
        browser = new JsnBrowser({
          container,
          onError: (e) => {
            if (cancelled) return
            setError(String(e))
          },
        })
        browser.keyboard.setKeys(DEFAULT_KEYBOARD_KEYS)

        req = JsnBrowser.loadROMFromURL(rom.romUrl, (err, data) => {
          if (cancelled) {
            browser?.destroy()
            return
          }
          if (err || data === undefined) {
            setError(err?.message ?? '无法加载 ROM 文件')
            setLoading(false)
            browser?.destroy()
            browser = null
            return
          }
          try {
            browser?.loadROM(data)
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                fitToContainer()
              })
            })
            setLoading(false)
          } catch (e) {
            setError(String(e))
            setLoading(false)
            browser?.destroy()
            browser = null
          }
        })
      })
      .catch((e) => {
        if (cancelled) return
        setError(String(e))
        setLoading(false)
      })

    return () => {
      cancelled = true
      ro.disconnect()
      req?.abort()
      browser?.destroy()
    }
  }, [rom])

  if (!id || !rom) {
    return <Navigate to="/" replace />
  }

  const toggleGameFullscreen = () => {
    const el = gameFrameRef.current
    if (!el) return
    const done = document.fullscreenElement
      ? document.exitFullscreen()
      : el.requestFullscreen()
    void done.catch(() => {})
  }

  return (
    <div className="flex min-h-full flex-col px-4 pb-9 pt-5 text-left">
      <h1 className="sr-only">{rom.title}</h1>
      <div
        ref={gameFrameRef}
        className="relative mx-auto w-full max-w-[min(760px,100%)] [&:fullscreen]:flex [&:fullscreen]:h-screen [&:fullscreen]:min-h-0 [&:fullscreen]:w-screen [&:fullscreen]:max-w-none [&:fullscreen]:items-center [&:fullscreen]:justify-center [&:fullscreen]:bg-black"
      >
        {loading && !error && (
          <div
            className="pointer-events-none absolute inset-0 z-[1] m-0 flex items-center justify-center bg-[rgba(8,8,12,0.72)] text-gray-200 backdrop-blur-md"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="flex flex-col items-center gap-3.5">
              <Loader2
                className="size-9 animate-spin text-[var(--accent)] motion-reduce:animate-none"
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-sm tracking-[0.02em] text-gray-300">
                正在加载 ROM…
              </span>
            </div>
          </div>
        )}
        {error && (
          <div
            className="mb-4 space-y-2 rounded-[var(--radius-sm)] bg-red-600/12 px-[18px] py-4 text-[var(--text-h)]"
            role="alert"
          >
            <p>{error}</p>
            <p className="text-sm text-[var(--text)]">
              请确认 <code>src/data/roms.ts</code> 里该游戏的 <code>romUrl</code>{' '}
              正确。若使用本地文件，请放到 <code>public/roms</code>
              ；若使用网络地址，需对方服务器允许跨域（CORS），否则浏览器无法读取。
            </p>
            <Link
              className="font-medium text-[var(--accent)]"
              to="/"
            >
              返回游戏库
            </Link>
          </div>
        )}
        <div
          ref={containerRef}
          className={`overflow-hidden bg-transparent leading-none outline-none [&_canvas]:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent)] ${
            gameFullscreen
              ? 'aspect-[256/240] w-[min(100%,min(100vw,calc(100dvh*256/240)))] max-w-full shrink-0'
              : 'aspect-[256/240] w-full'
          }`}
          tabIndex={0}
          aria-label={`${rom.title} 游戏画面`}
        />
      </div>

      <div
        className="mx-auto mt-2 flex w-full max-w-[min(760px,100%)] items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5"
        role="toolbar"
        aria-label="游戏工具"
      >
        <button
          type="button"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-label="键盘说明"
          aria-expanded={keysHelpOpen}
          aria-haspopup="dialog"
          aria-controls={keysHelpOpen ? 'keys-help-dialog' : undefined}
          title="键盘说明"
          onClick={() => setKeysHelpOpen(true)}
        >
          <Keyboard size={20} strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-label={gameFullscreen ? '退出全屏' : '全屏'}
          aria-pressed={gameFullscreen}
          title={gameFullscreen ? '退出全屏' : '全屏'}
          onClick={toggleGameFullscreen}
        >
          {gameFullscreen ? (
            <Minimize2 size={20} strokeWidth={2} aria-hidden />
          ) : (
            <Maximize2 size={20} strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>

      {keysHelpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8 sm:items-center sm:p-6"
          role="presentation"
        >
          <div
            className="absolute inset-0 cursor-default bg-[rgba(8,8,12,0.55)] backdrop-blur-[2px]"
            role="presentation"
            onClick={() => setKeysHelpOpen(false)}
          />
          <div
            id="keys-help-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={keysHelpTitleId}
            className="relative z-[1] w-full max-w-lg rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-5 text-left shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id={keysHelpTitleId}
                className="m-0 text-base font-semibold text-[var(--text-h)]"
              >
                键盘说明
              </h2>
              <button
                type="button"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-h)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                aria-label="关闭"
                onClick={() => setKeysHelpOpen(false)}
              >
                <X size={20} strokeWidth={2} aria-hidden />
              </button>
            </div>
            <div
              className="mt-4 flex w-full justify-center"
              role="tablist"
              aria-label="玩家"
            >
              <div className="inline-flex rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-1 ring-1 ring-[var(--border)]">
                <button
                  type="button"
                  id="keys-help-tab-1p"
                  role="tab"
                  aria-selected={keysHelpTab === '1p'}
                  aria-controls="keys-help-panel-1p"
                  tabIndex={keysHelpTab === '1p' ? 0 : -1}
                  className={`min-w-[5.5rem] rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    keysHelpTab === '1p'
                      ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-h)]'
                  }`}
                  onClick={() => setKeysHelpTab('1p')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      e.preventDefault()
                      setKeysHelpTab('2p')
                      queueMicrotask(() =>
                        document.getElementById('keys-help-tab-2p')?.focus(),
                      )
                    }
                  }}
                >
                  1P
                </button>
                <button
                  type="button"
                  id="keys-help-tab-2p"
                  role="tab"
                  aria-selected={keysHelpTab === '2p'}
                  aria-controls="keys-help-panel-2p"
                  tabIndex={keysHelpTab === '2p' ? 0 : -1}
                  className={`min-w-[5.5rem] rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    keysHelpTab === '2p'
                      ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-h)]'
                  }`}
                  onClick={() => setKeysHelpTab('2p')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault()
                      setKeysHelpTab('1p')
                      queueMicrotask(() =>
                        document.getElementById('keys-help-tab-1p')?.focus(),
                      )
                    }
                  }}
                >
                  2P
                </button>
              </div>
            </div>

            <div
              id="keys-help-panel-1p"
              role="tabpanel"
              aria-labelledby="keys-help-tab-1p"
              hidden={keysHelpTab !== '1p'}
              className="mt-4"
            >
              <p className="sr-only">
                1P：W A S D 移动；K 为 A、J 为 B；1、2 为 Select、Start。
              </p>
              <div className="flex flex-wrap items-end justify-center gap-5 sm:gap-8 py-4">
                <div
                  className="size-[7.25rem] shrink-0"
                  aria-hidden
                >
                  <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 [grid-template-columns:repeat(3,2.25rem)] [grid-template-rows:repeat(3,2.25rem)]">
                  <span className="col-start-2 row-start-1 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text-h)]">
                    W
                  </span>
                  <span className="col-start-1 row-start-2 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text-h)]">
                    A
                  </span>
                  <span className="col-start-2 row-start-2 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text-muted)]">
                    ·
                  </span>
                  <span className="col-start-3 row-start-2 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text-h)]">
                    D
                  </span>
                  <span className="col-start-2 row-start-3 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text-h)]">
                    S
                  </span>
                  </div>
                </div>
                <div
                  className="flex shrink-0 items-end gap-2 sm:gap-3"
                  aria-hidden
                >
                  <div className="flex h-11 w-[4.25rem] flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1">
                    <span className="text-sm font-bold tabular-nums text-[var(--text-h)]">
                      1
                    </span>
                    <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                      Select
                    </span>
                  </div>
                  <div className="flex h-11 w-[4.25rem] flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1">
                    <span className="text-sm font-bold tabular-nums text-[var(--text-h)]">
                      2
                    </span>
                    <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                      Start
                    </span>
                  </div>
                </div>
                <div
                  className="flex shrink-0 items-center gap-3 sm:gap-4"
                  aria-hidden
                >
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-[var(--accent-border)] bg-[var(--accent-soft)] shadow-[inset_0_-3px_0_rgba(0,0,0,0.06)]">
                    <span className="text-base font-bold leading-none text-[var(--text-h)]">
                      K
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                      A
                    </span>
                  </div>
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-[var(--accent-border)] bg-[var(--accent-soft)] shadow-[inset_0_-3px_0_rgba(0,0,0,0.06)]">
                    <span className="text-base font-bold leading-none text-[var(--text-h)]">
                      J
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                      B
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="keys-help-panel-2p"
              role="tabpanel"
              aria-labelledby="keys-help-tab-2p"
              hidden={keysHelpTab !== '2p'}
              className="mt-4"
            >
              <p className="sr-only">
                2P：方向键移动；小键盘 5 为 A、4 为 B；7、8 为 Select、Start。
              </p>
              <div className="flex flex-wrap items-end justify-center gap-5 sm:gap-8">
                <div
                  className="size-[7.25rem] shrink-0"
                  aria-hidden
                >
                  <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 [grid-template-columns:repeat(3,2.25rem)] [grid-template-rows:repeat(3,2.25rem)]">
                  <span className="col-start-2 row-start-1 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-lg leading-none text-[var(--text-h)]">
                    ↑
                  </span>
                  <span className="col-start-1 row-start-2 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-lg leading-none text-[var(--text-h)]">
                    ←
                  </span>
                  <span className="col-start-2 row-start-2 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text-muted)]">
                    ·
                  </span>
                  <span className="col-start-3 row-start-2 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-lg leading-none text-[var(--text-h)]">
                    →
                  </span>
                  <span className="col-start-2 row-start-3 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-lg leading-none text-[var(--text-h)]">
                    ↓
                  </span>
                  </div>
                </div>
                <div
                  className="flex shrink-0 items-end gap-2 sm:gap-3"
                  aria-hidden
                >
                  <div className="flex h-11 w-[4.25rem] flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1">
                    <span className="text-sm font-bold tabular-nums text-[var(--text-h)]">
                      7
                    </span>
                    <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                      Select
                    </span>
                  </div>
                  <div className="flex h-11 w-[4.25rem] flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1">
                    <span className="text-sm font-bold tabular-nums text-[var(--text-h)]">
                      8
                    </span>
                    <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                      Start
                    </span>
                  </div>
                </div>
                <div
                  className="flex shrink-0 items-center gap-3 sm:gap-4"
                  aria-hidden
                >
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-[var(--accent-border)] bg-[var(--accent-soft)] shadow-[inset_0_-3px_0_rgba(0,0,0,0.06)]">
                    <span className="text-base font-bold leading-none text-[var(--text-h)]">
                      4
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                      A
                    </span>
                  </div>
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-[var(--accent-border)] bg-[var(--accent-soft)] shadow-[inset_0_-3px_0_rgba(0,0,0,0.06)]">
                    <span className="text-base font-bold leading-none text-[var(--text-h)]">
                      5
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                      B
                    </span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
