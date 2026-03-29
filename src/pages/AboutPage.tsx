export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col px-5 pb-12 pt-5 text-left">
      <article className="mx-auto w-full max-w-[min(40rem,100%)]">
        <h1 className="mb-6 mt-0 text-2xl font-medium tracking-tight text-[var(--text-h)] max-lg:text-xl">
          关于本站
        </h1>
        <div className="space-y-4 text-[var(--text)] leading-relaxed">
          <p className="m-0">
            童年里那台小机器、那几盘卡带、那段 8-bit 的旋律，常常会在某个瞬间冒出来——不是非要回到过去，而是想再摸一摸那时的手感。本站是在浏览器里搭的一小块角落：像旧书架一样摆着那些名字，选一盘「卡带」，便是在当下的屏幕里，与当年的自己轻轻接上线。
          </p>
          <p className="m-0">
            若这些像素和音乐曾是你某段日子的背景音，这里便是一扇随时能推开的门；若你是第一次来，也不妨随便试一盘，看看会不会勾起一点熟悉的心跳。
          </p>
          <p className="m-0 text-sm text-[var(--text-muted)]">
            本站仅供学习与交流；ROM 与商标权利归原作者及发行方所有。
          </p>
        </div>
      </article>
    </div>
  )
}
