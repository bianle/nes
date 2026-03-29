import { Link } from 'react-router-dom'
import { RomCoverThumb } from '../components/RomCoverThumb'
import { roms } from '../data/roms'

export default function RomList() {
  return (
    <div className="flex flex-1 flex-col px-5 pb-12 pt-5 text-left">
      
      <ul className="m-0 mx-auto grid w-full max-w-[min(1200px,100%)] list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {roms.map((rom) => (
          <li key={rom.id} className="min-h-0 min-w-0">
            <Link
              className="group flex h-full min-h-[4.75rem] flex-row items-start gap-2 rounded-[var(--radius)] bg-[var(--surface-2)] p-2.5 text-inherit no-underline transition-colors duration-200 hover:bg-[var(--accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent)] sm:gap-3 sm:p-3"
              to={`/game/${rom.id}`}
            >
              <RomCoverThumb
                cover={rom.cover}
                className="aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[#0d0e12] sm:w-[4.5rem] lg:w-20"
                imgClassName="block h-full w-full object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="flex min-h-0 min-w-0 flex-1 flex-col self-stretch gap-1.5 sm:gap-2">
                <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-[var(--text-h)] sm:text-[15px]">
                  {rom.title}
                </span>
                {rom.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {rom.tags.map((tag, i) => (
                      <span
                        key={`${rom.id}-${tag}-${i}`}
                        className="rounded-md border border-[var(--accent-border)] bg-transparent px-1.5 py-0.5 text-[10px] font-medium leading-none text-[var(--accent)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="line-clamp-2 text-[11px] leading-snug text-[var(--text-muted)] sm:text-xs">
                  {rom.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {roms.length === 0 && (
        <p className="mx-auto mt-6 w-full max-w-[min(1200px,100%)] text-center text-sm text-[var(--text-muted)]">
          暂无游戏。
        </p>
      )}
    </div>
  )
}
