import {
  Check,
  Keyboard,
  Loader2,
  Maximize,
  Minimize,
  RotateCcw,
  X,
} from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { Browser } from 'jsnes'
import { getRomById } from '../data/roms'
import {
  assignBinding,
  DEFAULT_STRUCTURED,
  keyCodeToLabel,
  loadStructuredBindings,
  PAD_ACTION_LABELS,
  saveStructuredBindings,
  structuredToFlat,
  type PadAction,
  type StructuredBindings,
} from '../lib/nesKeyboardBindings'

function PlayerPadDiagram({
  player,
  bindings,
  keyListen,
  setKeyListen,
}: {
  player: 1 | 2
  bindings: StructuredBindings
  keyListen: { player: 1 | 2; action: PadAction } | null
  setKeyListen: Dispatch<
    SetStateAction<{ player: 1 | 2; action: PadAction } | null>
  >
}) {
  const b = player === 1 ? bindings.p1 : bindings.p2
  const listen = (a: PadAction) =>
    keyListen?.player === player && keyListen.action === a

  const listeningClass = 'key-bind-listening'

  const padKeyButton = (action: PadAction, className: string) => {
    const is = listen(action)
    return (
      <button
        type="button"
        className={`${className} cursor-pointer transition-shadow hover:bg-[var(--bg)] focus-visible:outline-none ${is ? listeningClass : ''}`}
        aria-pressed={is}
        aria-label={
          is
            ? `${player}P ${PAD_ACTION_LABELS[action]}，等待新键`
            : `${player}P ${PAD_ACTION_LABELS[action]}，当前 ${keyCodeToLabel(b[action])}，点击更改`
        }
        onClick={() => setKeyListen({ player, action })}
      >
        {is ? (
          <span className="block min-h-[1em] min-w-[0.5em]" aria-hidden />
        ) : (
          keyCodeToLabel(b[action])
        )}
      </button>
    )
  }

  return (
    <div
      className="flex flex-wrap items-end justify-center gap-5 sm:gap-8 py-4"
      role="group"
      aria-label={`${player}P 键位示意图，点击格子修改键位`}
    >
      <div className="size-[7.25rem] shrink-0">
        <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 [grid-template-columns:repeat(3,2.25rem)] [grid-template-rows:repeat(3,2.25rem)]">
          {padKeyButton(
            'up',
            'col-start-2 row-start-1 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-0 text-center text-[7px] font-semibold leading-none tracking-tighter text-[var(--text-h)] sm:text-[8px]',
          )}
          {padKeyButton(
            'left',
            'col-start-1 row-start-2 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-0 text-center text-[7px] font-semibold leading-none tracking-tighter text-[var(--text-h)] sm:text-[8px]',
          )}
          {padKeyButton(
            'right',
            'col-start-3 row-start-2 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-0 text-center text-[7px] font-semibold leading-none tracking-tighter text-[var(--text-h)] sm:text-[8px]',
          )}
          {padKeyButton(
            'down',
            'col-start-2 row-start-3 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-0 text-center text-[7px] font-semibold leading-none tracking-tighter text-[var(--text-h)] sm:text-[8px]',
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-end gap-2 sm:gap-3">
        <button
          type="button"
          className={`flex h-11 min-w-[4.25rem] max-w-[5rem] cursor-pointer flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1 transition-shadow hover:bg-[var(--bg)] focus-visible:outline-none ${listen('select') ? listeningClass : ''}`}
          aria-pressed={listen('select')}
          aria-label={
            listen('select')
              ? `${player}P Select，等待新键`
              : `${player}P Select，当前 ${keyCodeToLabel(b.select)}，点击更改`
          }
          onClick={() => setKeyListen({ player, action: 'select' })}
        >
          {listen('select') ? (
            <span
              className="max-w-full min-h-[1em] text-center text-[9px] font-bold leading-tight tracking-tight sm:text-[10px]"
              aria-hidden
            />
          ) : (
            <span className="max-w-full text-center text-[9px] font-bold leading-tight tracking-tight text-[var(--text-h)] sm:text-[10px]">
              {keyCodeToLabel(b.select)}
            </span>
          )}
          <span className="text-[10px] leading-tight text-[var(--text-muted)]">
            Select
          </span>
        </button>
        <button
          type="button"
          className={`flex h-11 min-w-[4.25rem] max-w-[5rem] cursor-pointer flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1 transition-shadow hover:bg-[var(--bg)] focus-visible:outline-none ${listen('start') ? listeningClass : ''}`}
          aria-pressed={listen('start')}
          aria-label={
            listen('start')
              ? `${player}P Start，等待新键`
              : `${player}P Start，当前 ${keyCodeToLabel(b.start)}，点击更改`
          }
          onClick={() => setKeyListen({ player, action: 'start' })}
        >
          {listen('start') ? (
            <span
              className="max-w-full min-h-[1em] text-center text-[9px] font-bold leading-tight tracking-tight sm:text-[10px]"
              aria-hidden
            />
          ) : (
            <span className="max-w-full text-center text-[9px] font-bold leading-tight tracking-tight text-[var(--text-h)] sm:text-[10px]">
              {keyCodeToLabel(b.start)}
            </span>
          )}
          <span className="text-[10px] leading-tight text-[var(--text-muted)]">
            Start
          </span>
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        {player === 1 ? (
          <>
            <button
              type="button"
              className={`flex h-14 w-14 shrink-0 cursor-pointer flex-col items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1 transition-shadow hover:bg-[var(--bg)] focus-visible:outline-none ${listen('a') ? listeningClass : ''}`}
              aria-pressed={listen('a')}
              aria-label={
                listen('a')
                  ? '1P A 键，等待新键'
                  : `1P A 键，当前 ${keyCodeToLabel(b.a)}，点击更改`
              }
              onClick={() => setKeyListen({ player, action: 'a' })}
            >
              {listen('a') ? (
                <span
                  className="max-w-full min-h-[1em] text-center text-[9px] font-bold leading-tight tracking-tight sm:text-[10px]"
                  aria-hidden
                />
              ) : (
                <span className="max-w-full text-center text-[9px] font-bold leading-tight tracking-tight text-[var(--text-h)] sm:text-[10px]">
                  {keyCodeToLabel(b.a)}
                </span>
              )}
              <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                A
              </span>
            </button>
            <button
              type="button"
              className={`flex h-14 w-14 shrink-0 cursor-pointer flex-col items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1 transition-shadow hover:bg-[var(--bg)] focus-visible:outline-none ${listen('b') ? listeningClass : ''}`}
              aria-pressed={listen('b')}
              aria-label={
                listen('b')
                  ? '1P B 键，等待新键'
                  : `1P B 键，当前 ${keyCodeToLabel(b.b)}，点击更改`
              }
              onClick={() => setKeyListen({ player, action: 'b' })}
            >
              {listen('b') ? (
                <span
                  className="max-w-full min-h-[1em] text-center text-[9px] font-bold leading-tight tracking-tight sm:text-[10px]"
                  aria-hidden
                />
              ) : (
                <span className="max-w-full text-center text-[9px] font-bold leading-tight tracking-tight text-[var(--text-h)] sm:text-[10px]">
                  {keyCodeToLabel(b.b)}
                </span>
              )}
              <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                B
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`flex h-14 w-14 shrink-0 cursor-pointer flex-col items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1 transition-shadow hover:bg-[var(--bg)] focus-visible:outline-none ${listen('b') ? listeningClass : ''}`}
              aria-pressed={listen('b')}
              aria-label={
                listen('b')
                  ? '2P B 键，等待新键'
                  : `2P B 键，当前 ${keyCodeToLabel(b.b)}，点击更改`
              }
              onClick={() => setKeyListen({ player, action: 'b' })}
            >
              {listen('b') ? (
                <span
                  className="max-w-full min-h-[1em] text-center text-[9px] font-bold leading-tight tracking-tight sm:text-[10px]"
                  aria-hidden
                />
              ) : (
                <span className="max-w-full text-center text-[9px] font-bold leading-tight tracking-tight text-[var(--text-h)] sm:text-[10px]">
                  {keyCodeToLabel(b.b)}
                </span>
              )}
              <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                B
              </span>
            </button>
            <button
              type="button"
              className={`flex h-14 w-14 shrink-0 cursor-pointer flex-col items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-1 py-1 transition-shadow hover:bg-[var(--bg)] focus-visible:outline-none ${listen('a') ? listeningClass : ''}`}
              aria-pressed={listen('a')}
              aria-label={
                listen('a')
                  ? '2P A 键，等待新键'
                  : `2P A 键，当前 ${keyCodeToLabel(b.a)}，点击更改`
              }
              onClick={() => setKeyListen({ player, action: 'a' })}
            >
              {listen('a') ? (
                <span
                  className="max-w-full min-h-[1em] text-center text-[9px] font-bold leading-tight tracking-tight sm:text-[10px]"
                  aria-hidden
                />
              ) : (
                <span className="max-w-full text-center text-[9px] font-bold leading-tight tracking-tight text-[var(--text-h)] sm:text-[10px]">
                  {keyCodeToLabel(b.a)}
                </span>
              )}
              <span className="text-[10px] leading-tight text-[var(--text-muted)]">
                A
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function GamePage() {
  const { id } = useParams<{ id: string }>()
  const rom = id ? getRomById(id) : undefined
  const containerRef = useRef<HTMLDivElement>(null)
  const gameFrameRef = useRef<HTMLDivElement>(null)
  const browserRef = useRef<Browser | null>(null)
  const bindingsRef = useRef(loadStructuredBindings())
  const [bindings, setBindings] = useState(() => loadStructuredBindings())
  const [keyListen, setKeyListen] = useState<{
    player: 1 | 2
    action: PadAction
  } | null>(null)
  const [gameFullscreen, setGameFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [keysHelpOpen, setKeysHelpOpen] = useState(false)
  const [keysHelpTab, setKeysHelpTab] = useState<'1p' | '2p'>('1p')
  const [resetBindingsAck, setResetBindingsAck] = useState(false)
  const resetBindingsAckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const keysHelpTitleId = useId()

  bindingsRef.current = bindings

  useEffect(() => {
    if (!keysHelpOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (keyListen) {
        e.preventDefault()
        setKeyListen(null)
        return
      }
      setKeysHelpOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [keysHelpOpen, keyListen])

  useEffect(() => {
    if (keysHelpOpen) setKeysHelpTab('1p')
  }, [keysHelpOpen])

  useEffect(() => {
    if (!keysHelpOpen) setKeyListen(null)
  }, [keysHelpOpen])

  useEffect(() => {
    if (!keysHelpOpen) {
      setResetBindingsAck(false)
      if (resetBindingsAckTimerRef.current) {
        clearTimeout(resetBindingsAckTimerRef.current)
        resetBindingsAckTimerRef.current = null
      }
    }
  }, [keysHelpOpen])

  useEffect(() => {
    return () => {
      if (resetBindingsAckTimerRef.current) {
        clearTimeout(resetBindingsAckTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!keyListen) return
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.keyCode === 27) {
        setKeyListen(null)
        return
      }
      if ([9, 16, 17, 18, 91, 92].includes(e.keyCode)) return
      const L = keyListen
      const next = assignBinding(bindingsRef.current, L.player, L.action, e.keyCode)
      setBindings(next)
      saveStructuredBindings(next)
      browserRef.current?.keyboard.setKeys(structuredToFlat(next))
      setKeyListen(null)
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [keyListen])

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
        browser.keyboard.setKeys(structuredToFlat(bindingsRef.current))
        browserRef.current = browser

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
      browserRef.current = null
      ro.disconnect()
      req?.abort()
      browser?.destroy()
    }
  }, [rom])

  useEffect(() => {
    browserRef.current?.keyboard.setKeys(structuredToFlat(bindings))
  }, [bindings])

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

  const resetKeyBindings = () => {
    setBindings(DEFAULT_STRUCTURED)
    saveStructuredBindings(DEFAULT_STRUCTURED)
    bindingsRef.current = DEFAULT_STRUCTURED
    browserRef.current?.keyboard.setKeys(structuredToFlat(DEFAULT_STRUCTURED))
    setResetBindingsAck(true)
    if (resetBindingsAckTimerRef.current) {
      clearTimeout(resetBindingsAckTimerRef.current)
    }
    resetBindingsAckTimerRef.current = setTimeout(() => {
      setResetBindingsAck(false)
      resetBindingsAckTimerRef.current = null
    }, 2000)
  }

  return (
    <div className="flex min-h-full flex-col px-4 pb-6 pt-5 text-left">
      <h1 className="sr-only">{rom.title}</h1>
      <div
        ref={gameFrameRef}
        className="relative mx-auto flex w-full max-w-[min(760px,100%)] flex-col [&:fullscreen]:h-screen [&:fullscreen]:min-h-0 [&:fullscreen]:w-screen [&:fullscreen]:max-w-none [&:fullscreen]:bg-black"
      >
        {loading && !error && (
          <div
            className="pointer-events-none absolute inset-0 z-[3] m-0 flex items-center justify-center bg-[rgba(8,8,12,0.72)] text-gray-200 backdrop-blur-md"
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
          className={
            gameFullscreen
              ? 'flex min-h-0 flex-1 items-center justify-center'
              : undefined
          }
        >
          <div
            ref={containerRef}
            className={`overflow-hidden bg-transparent leading-none outline-none [&_canvas]:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent)] ${
              gameFullscreen
                ? 'aspect-[256/240] w-[min(100%,min(100vw,calc((100dvh-4rem)*256/240)))] max-w-full shrink-0'
                : 'aspect-[256/240] w-full'
            }`}
            tabIndex={0}
            aria-label={`${rom.title} 游戏画面`}
          />
        </div>

        <div
          className="z-[2] flex w-full shrink-0 items-center justify-center gap-2 bg-black px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          role="toolbar"
          aria-label="游戏工具"
        >
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            aria-label="自定义按键"
            aria-expanded={keysHelpOpen}
            aria-haspopup="dialog"
            aria-controls={keysHelpOpen ? 'keys-help-dialog' : undefined}
            title="自定义按键"
            onClick={() => setKeysHelpOpen(true)}
          >
            <Keyboard size={20} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            aria-label={gameFullscreen ? '退出全屏' : '全屏'}
            aria-pressed={gameFullscreen}
            title={gameFullscreen ? '退出全屏' : '全屏'}
            onClick={toggleGameFullscreen}
          >
            {gameFullscreen ? (
              <Minimize size={20} strokeWidth={2} aria-hidden />
            ) : (
              <Maximize size={20} strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {keysHelpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8 sm:items-center sm:p-6"
          role="presentation"
        >
          <div
            className="absolute inset-0 cursor-default bg-[rgba(8,8,12,0.55)] backdrop-blur-[2px]"
            role="presentation"
            onClick={() => {
              if (!keyListen) setKeysHelpOpen(false)
            }}
          />
          <div
            id="keys-help-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={keysHelpTitleId}
            className="relative z-[1] max-h-[min(90dvh,720px)] w-full max-w-xl overflow-y-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-5 text-left shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id={keysHelpTitleId}
                className="m-0 text-base font-semibold text-[var(--text-h)]"
              >
                自定义按键
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
                {`1P：${keyCodeToLabel(bindings.p1.up)}、${keyCodeToLabel(bindings.p1.left)}、${keyCodeToLabel(bindings.p1.down)}、${keyCodeToLabel(bindings.p1.right)} 移动；${keyCodeToLabel(bindings.p1.a)} 为 A、${keyCodeToLabel(bindings.p1.b)} 为 B；${keyCodeToLabel(bindings.p1.select)}、${keyCodeToLabel(bindings.p1.start)} 为 Select、Start。`}
              </p>
              <p className="mt-1 text-center text-xs text-[var(--text-muted)]">
                点击示意图上对应区域修改键位；编辑时键名会清空并闪烁，按下新键保存，Esc
                取消。若与另一项冲突，冲突项会恢复为默认键。
              </p>
              <PlayerPadDiagram
                player={1}
                bindings={bindings}
                keyListen={keyListen}
                setKeyListen={setKeyListen}
              />
            </div>

            <div
              id="keys-help-panel-2p"
              role="tabpanel"
              aria-labelledby="keys-help-tab-2p"
              hidden={keysHelpTab !== '2p'}
              className="mt-4"
            >
              <p className="sr-only">
                {`2P：${keyCodeToLabel(bindings.p2.up)}、${keyCodeToLabel(bindings.p2.left)}、${keyCodeToLabel(bindings.p2.down)}、${keyCodeToLabel(bindings.p2.right)} 移动；${keyCodeToLabel(bindings.p2.a)} 为 A、${keyCodeToLabel(bindings.p2.b)} 为 B；${keyCodeToLabel(bindings.p2.select)}、${keyCodeToLabel(bindings.p2.start)} 为 Select、Start。`}
              </p>
              <p className="mt-1 text-center text-xs text-[var(--text-muted)]">
                点击示意图上对应区域修改键位；编辑时键名会清空并闪烁，按下新键保存，Esc
                取消。若与另一项冲突，冲突项会恢复为默认键。
              </p>
              <PlayerPadDiagram
                player={2}
                bindings={bindings}
                keyListen={keyListen}
                setKeyListen={setKeyListen}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-4">
              <span className="sr-only" aria-live="polite" aria-atomic="true">
                {resetBindingsAck ? '已恢复为默认键位' : ''}
              </span>
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  resetBindingsAck
                    ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-h)] hover:bg-[var(--bg)]'
                }`}
                onClick={resetKeyBindings}
              >
                {resetBindingsAck ? (
                  <Check size={16} strokeWidth={2.5} aria-hidden />
                ) : (
                  <RotateCcw size={16} strokeWidth={2} aria-hidden />
                )}
                {resetBindingsAck ? '已恢复' : '恢复默认键位'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
