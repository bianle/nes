import { Gamepad2, Search } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import AccentPicker from '../components/AccentPicker'
import ThemeToggle from '../components/ThemeToggle'
import { useGlobalSearch } from '../context/GlobalSearchContext'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `text-sm font-medium no-underline transition-colors focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
    isActive
      ? 'text-[var(--accent)]'
      : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
  }`
}

export default function AppLayout() {
  const { isOpen, open, close } = useGlobalSearch()

  return (
    <div className="flex min-h-svh w-full flex-col bg-[var(--bg)] text-left">
      <header className="sticky top-0 z-20 bg-[var(--bg)]">
        <div className="mx-auto flex h-14 max-w-[min(1200px,100%)] items-center gap-4 px-4 sm:px-5">
          <Link
            to="/"
            className="inline-flex min-w-0 shrink items-center gap-2 text-base font-semibold tracking-tight text-[var(--text-h)] no-underline transition-opacity hover:opacity-80 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <Gamepad2
              className="size-5 shrink-0 text-[var(--accent)]"
              strokeWidth={2}
              aria-hidden
            />
            <span className="truncate">小霸王其乐无穷</span>
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-5 sm:gap-7">
            <nav
              className="flex shrink-0 items-center gap-5 sm:gap-7"
              aria-label="主导航"
            >
              <NavLink to="/" end className={navLinkClassName}>
                游戏库
              </NavLink>
              <NavLink to="/about" className={navLinkClassName}>
                关于
              </NavLink>
            </nav>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                className={`inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-transparent text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  isOpen ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : ''
                }`}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                aria-label="搜索游戏"
                title="搜索（Ctrl+K）"
                onClick={() => (isOpen ? close() : open())}
              >
                <Search size={20} strokeWidth={2} aria-hidden />
              </button>
              <AccentPicker />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-[var(--bg)]">
        <Outlet />
      </main>

      <footer className="bg-[var(--bg)] py-5 text-center text-xs text-[var(--text-muted)]">
        <div className="mx-auto max-w-[min(1200px,100%)] px-4 sm:px-5">
          <p className="m-0 leading-relaxed">
            小霸王其乐无穷 · 浏览器内模拟 · 仅供学习交流
          </p>
        </div>
      </footer>
    </div>
  )
}
