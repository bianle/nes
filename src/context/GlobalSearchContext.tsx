import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { GlobalSearchModal } from '../components/GlobalSearchModal'

type GlobalSearchContextValue = {
  open: () => void
  close: () => void
  isOpen: boolean
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  activeTag: string | null
  setActiveTag: Dispatch<SetStateAction<string | null>>
}

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null)

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen,
      query,
      setQuery,
      activeTag,
      setActiveTag,
    }),
    [open, close, isOpen, query, activeTag],
  )

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      <GlobalSearchModal />
    </GlobalSearchContext.Provider>
  )
}

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext)
  if (!ctx) {
    throw new Error('useGlobalSearch 需在 GlobalSearchProvider 内使用')
  }
  return ctx
}
