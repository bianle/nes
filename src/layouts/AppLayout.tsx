import { Gamepad, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import AccentPicker from '../components/AccentPicker'
import { useGlobalSearch } from '../context/GlobalSearchContext'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `inline-flex h-6 items-center text-sm font-medium leading-none no-underline transition-colors focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
    isActive
      ? 'text-[var(--accent)]'
      : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
  }`
}

export default function AppLayout() {
  const { isOpen, open, close } = useGlobalSearch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-[var(--bg)] text-left">
      <SimpleBar className="h-full min-h-0 w-full flex-1">
        <div className="flex min-h-full flex-col">
          <header className="sticky top-0 z-20 shrink-0 border-b border-[var(--border)] bg-[var(--bg)]">
            <div className="mx-auto flex h-12 max-w-[min(1200px,100%)] items-center gap-4 px-4 sm:px-5">
              <Link
                to="/"
                className="inline-flex min-w-0 shrink items-center gap-2 text-lg font-semibold tracking-tight text-[var(--text-h)] no-underline transition-opacity hover:opacity-80 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <Gamepad
                  className="size-8 shrink-0 text-[var(--accent)]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="truncate">小霸王其乐无穷</span>
              </Link>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:gap-5">
                <div className="flex min-w-0 items-center gap-5 sm:gap-7">
                  <button
                    type="button"
                    className={`inline-flex h-6 min-h-6 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs leading-none text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:gap-2 sm:px-2.5 ${
                      isOpen
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'bg-[var(--surface-2)] hover:bg-[var(--accent-soft)]'
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                    aria-label="搜索游戏"
                    title="搜索（Ctrl+K）"
                    onClick={() => (isOpen ? close() : open())}
                  >
                    <Search className="size-3 shrink-0" strokeWidth={2} aria-hidden />
                    <span className="hidden select-none text-xs leading-none sm:inline">
                      Ctrl K
                    </span>
                  </button>
                  <nav
                    className="hidden shrink-0 items-center gap-5 sm:flex sm:gap-7"
                    aria-label="主导航"
                  >
                    <NavLink to="/" end className={navLinkClassName}>
                      游戏库
                    </NavLink>
                    <NavLink to="/about" className={navLinkClassName}>
                      关于
                    </NavLink>
                  </nav>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <div className="hidden sm:flex sm:items-center">
                    <AccentPicker />
                  </div>
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:hidden"
                    aria-label={mobileMenuOpen ? '收起菜单' : '展开菜单'}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-main-menu"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                  >
                    {mobileMenuOpen ? (
                      <X className="size-4" strokeWidth={2} aria-hidden />
                    ) : (
                      <Menu className="size-4" strokeWidth={2} aria-hidden />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {mobileMenuOpen && (
              <div
                id="mobile-main-menu"
                className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 sm:hidden"
              >
                <nav className="flex flex-col gap-3" aria-label="主导航">
                  <NavLink
                    to="/"
                    end
                    className={navLinkClassName}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    游戏库
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={navLinkClassName}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    关于
                  </NavLink>
                </nav>
                <div className="mt-3 border-t border-[var(--border)] pt-3">
                  <AccentPicker />
                </div>
              </div>
            )}
          </header>

          <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-[var(--bg)]">
            <Outlet />
          </main>
          <footer className="hidden shrink-0 bg-[var(--bg)] py-5 text-center text-xs text-[var(--text-muted)] sm:block">
            <div className="mx-auto max-w-[min(1200px,100%)] px-4 sm:px-5">
              <p className="m-0 leading-relaxed">
                小霸王其乐无穷 · 浏览器内模拟 · 仅供学习交流
              </p>
            </div>
          </footer>
        </div>
      </SimpleBar>
    </div>
  )
}
