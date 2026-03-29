import { Route, Routes } from 'react-router-dom'
import { GlobalSearchProvider } from './context/GlobalSearchContext'
import AppLayout from './layouts/AppLayout'
import AboutPage from './pages/AboutPage'
import GamePage from './pages/GamePage'
import RomList from './pages/RomList'

export default function App() {
  return (
    <GlobalSearchProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RomList />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/game/:id" element={<GamePage />} />
        </Route>
      </Routes>
    </GlobalSearchProvider>
  )
}
