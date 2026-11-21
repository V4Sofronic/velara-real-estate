import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [favs, setFavs] = useState([])

  const loadFavs = useCallback(async () => { try { setFavs(await api.listFavorites()) } catch { setFavs([]) } }, [])

  useEffect(() => {
    let alive = true
    api.me().then(async (u) => { if (!alive) return; setUser(u); if (u) await loadFavs(); setReady(true) })
    return () => { alive = false }
  }, [loadFavs])

  const value = useMemo(() => ({
    user, ready, favs,
    async signIn(d) { const u = await api.signIn(d); setUser(u); await loadFavs(); return u },
    async signUp(d) { const u = await api.signUp(d); setUser(u); setFavs([]); return u },
    async signOut() { await api.signOut(); setUser(null); setFavs([]) },
    /** returns false if the visitor must sign in first */
    async toggleFavorite(id) {
      if (!user) return false
      setFavs(await api.setFavorite(id, !favs.includes(id)))
      return true
    },
  }), [user, ready, favs, loadFavs])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
