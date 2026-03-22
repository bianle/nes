import { Route, Routes } from 'react-router-dom'
import GamePage from './pages/GamePage'
import RomList from './pages/RomList'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RomList />} />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  )
}
