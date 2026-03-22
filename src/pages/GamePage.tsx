import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { Browser } from 'jsnes'
import { getRomById } from '../data/roms'
import './GamePage.css'

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

    const onResize = () => {
      browser?.fitInParent()
    }

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
              browser?.fitInParent()
            })
            window.addEventListener('resize', onResize)
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
      window.removeEventListener('resize', onResize)
      req?.abort()
      browser?.destroy()
    }
  }, [rom])

  if (!id || !rom) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="game-page">
      <header className="game-toolbar">
        <Link className="game-back" to="/">
          ← 返回列表
        </Link>
        <h1 className="game-title">{rom.title}</h1>
      </header>

      <div className="game-stage">
        {loading && !error && (
          <p className="game-overlay-msg" role="status">
            正在加载 ROM…
          </p>
        )}
        {error && (
          <div className="game-error" role="alert">
            <p>{error}</p>
            <p className="game-error-hint">
              请确认 <code>src/data/roms.ts</code> 里该游戏的 <code>romUrl</code>{' '}
              正确。若使用本地文件，请放到 <code>public/roms</code>；若使用网络地址，需对方服务器允许跨域（CORS），否则浏览器无法读取。
            </p>
            <Link to="/">返回游戏库</Link>
          </div>
        )}
        <div
          ref={containerRef}
          className="nes-viewport"
          tabIndex={0}
          aria-label={`${rom.title} 游戏画面`}
        />
      </div>

      <footer className="game-hints">
        <p>
          键盘：方向键、Z / X、Enter、右 Shift（可在 jsnes 默认映射下游玩）
        </p>
      </footer>
    </div>
  )
}
