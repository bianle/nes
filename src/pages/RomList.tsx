import { Link } from 'react-router-dom'
import { roms } from '../data/roms'

export default function RomList() {
  return (
    <div className="flex flex-1 flex-col px-5 pb-12 pt-7 text-left">
      <header className="mb-8 border-b border-[var(--border)] pb-6">
        <span className="mb-2.5 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
          NES
        </span>
        <h1 className="m-0 mb-2 text-[clamp(28px,4vw,40px)] font-medium leading-[1.15] tracking-[-0.04em] text-[var(--text-h)]">
          游戏库
        </h1>
        <p className="m-0 max-w-[42ch] text-base text-[var(--text-muted)]">
          选择游戏开始游玩
        </p>
      </header>

      <ul className="m-0 grid list-none gap-5 p-0 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
        {roms.map((rom) => (
          <li key={rom.id}>
            <Link
              className="group relative flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)] p-3 text-inherit no-underline shadow-[var(--shadow-sm)] transition-[box-shadow,transform,border-color] duration-200 ease-out after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-[3px] hover:border-[var(--accent-border)] hover:shadow-[var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent)] dark:after:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              to={`/game/${rom.id}`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-[#0d0e12]">
                <img
                  className="block h-full w-full scale-100 object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.04]"
                  src={rom.cover}
                  alt=""
                  width={320}
                  height={240}
                  loading="lazy"
                />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2.5">
                <span className="min-w-0 flex-1 text-[15px] font-semibold leading-[1.35] text-[var(--text-h)]">
                  {rom.title}
                </span>
                <span className="shrink-0 whitespace-nowrap rounded-full bg-[var(--accent-bg)] px-2.5 py-1.5 text-xs font-semibold leading-none tracking-[0.04em] text-[var(--accent)] transition-[transform,background] duration-200 ease-out group-hover:translate-x-0.5">
                  开始游玩
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
