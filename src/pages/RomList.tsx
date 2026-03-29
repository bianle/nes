import { Link } from 'react-router-dom'
import { roms } from '../data/roms'

export default function RomList() {
  return (
    <div className="flex flex-1 flex-col px-5 pb-12 pt-5 text-left">
      <ul className="m-0 mx-auto grid w-full max-w-[min(1200px,100%)] list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {roms.map((rom) => (
          <li key={rom.id} className="min-h-0 min-w-0">
            <Link
              className="group flex h-full min-h-[4.75rem] flex-row items-center gap-2 rounded-[var(--radius)] bg-[var(--surface-2)] p-2.5 text-inherit no-underline transition-colors duration-200 hover:bg-[var(--accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent)] sm:gap-3 sm:p-3"
              to={`/game/${rom.id}`}
            >
              <div className="aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[#0d0e12] sm:w-20 lg:w-24">
                <img
                  className="block h-full w-full object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.04]"
                  src={rom.cover}
                  alt=""
                  width={320}
                  height={240}
                  loading="lazy"
                />
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 sm:gap-2">
                <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-[var(--text-h)] sm:text-[15px]">
                  {rom.title}
                </span>
                <span className="w-fit shrink-0 rounded-full bg-[var(--bg)] px-2 py-1 text-[10px] font-semibold leading-none tracking-[0.04em] text-[var(--accent)] transition-[transform,background] duration-200 ease-out group-hover:translate-x-0.5 sm:px-2.5 sm:py-1.5 sm:text-xs">
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
