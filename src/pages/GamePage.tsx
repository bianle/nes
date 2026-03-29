import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { Browser } from 'jsnes'
import { getRomById } from '../data/roms'

export default function GamePage() {
  const { id } = useParams<{ id: string }>()
  const rom = id ? getRomById(id) : undefined
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="flex min-h-full flex-col px-4 pb-9 pt-5 text-left">
      <h1 className="sr-only">{rom.title}</h1>
      <div className="relative mx-auto w-full max-w-[min(760px,100%)]">
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
          className="aspect-[256/240] w-full overflow-hidden bg-transparent leading-none outline-none [&_canvas]:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent)]"
          tabIndex={0}
          aria-label={`${rom.title} 游戏画面`}
        />
      </div>

      <footer className="mx-auto mt-[22px] max-w-[min(760px,100%)] rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-[18px] py-3.5 text-sm leading-normal text-[var(--text-muted)]">
        <p className="m-0">
          键盘：方向键、Z / X、Enter、右 Shift（可在 jsnes 默认映射下游玩）
        </p>
      </footer>
    </div>
  )
}
