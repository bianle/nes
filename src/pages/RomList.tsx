import { Link } from 'react-router-dom'
import { roms } from '../data/roms'
import './RomList.css'

export default function RomList() {
  return (
    <div className="rom-list-page">
      <header className="rom-list-header">
        <span className="rom-list-kicker">NES</span>
        <h1 className="rom-list-title">游戏库</h1>
        <p className="rom-list-subtitle">选择游戏开始游玩</p>
      </header>

      <ul className="rom-grid">
        {roms.map((rom) => (
          <li key={rom.id}>
            <Link className="rom-card" to={`/game/${rom.id}`}>
              <div className="rom-card-cover-wrap">
                <img
                  className="rom-card-cover"
                  src={rom.cover}
                  alt=""
                  width={320}
                  height={240}
                  loading="lazy"
                />
              </div>
              <div className="rom-card-meta">
                <span className="rom-card-title">{rom.title}</span>
                <span className="rom-card-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
