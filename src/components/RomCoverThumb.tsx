import { Gamepad } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  cover?: string | null
  className?: string
  imgClassName?: string
}

export function RomCoverThumb({ cover, className, imgClassName }: Props) {
  const [failed, setFailed] = useState(false)
  const src = cover?.trim()
  const showPlaceholder = !src || failed

  useEffect(() => {
    setFailed(false)
  }, [cover])

  return (
    <div className={className}>
      {showPlaceholder ? (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1b22] to-[#0d0e12]"
          role="img"
          aria-label="暂无封面"
        >
          <Gamepad
            className="h-[40%] w-[40%] min-h-[1.15rem] min-w-[1.15rem] max-h-[3.25rem] max-w-[3.25rem] shrink-0 text-[var(--accent)] opacity-[0.55]"
            strokeWidth={1.35}
            aria-hidden
          />
        </div>
      ) : (
        <img
          className={imgClassName ?? 'block h-full w-full object-cover'}
          src={src}
          alt=""
          width={180}
          height={240}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
