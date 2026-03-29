import { Link, Outlet } from 'react-router-dom'
import AccentPicker from '../components/AccentPicker'
import ThemeToggle from '../components/ThemeToggle'

export default function AppLayout() {
  return (
    <div className="flex min-h-svh w-full flex-col bg-[var(--bg)] text-left">
      <header className="sticky top-0 z-20 bg-[var(--bg)]">
        <div className="mx-auto flex h-14 max-w-[min(1200px,100%)] items-center justify-between gap-4 px-4 sm:px-5">
          <Link
            to="/"
            className="text-base font-semibold tracking-tight text-[var(--text-h)] no-underline transition-opacity hover:opacity-80 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            小霸王其乐无穷
          </Link>
          <div className="flex items-center gap-1">
            <AccentPicker />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-[var(--bg)]">
        <Outlet />
      </main>

      <footer className="bg-[var(--bg)] py-5 text-center text-sm text-[var(--text-muted)]">
        <div className="mx-auto max-w-[min(1200px,100%)] px-4 sm:px-5">
          <p className="m-0 leading-relaxed">
            小霸王其乐无穷 · 浏览器内模拟 · 仅供学习交流
          </p>
        </div>
      </footer>
    </div>
  )
}
