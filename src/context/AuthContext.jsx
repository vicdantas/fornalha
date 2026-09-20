import { createContext, useContext, useState, useEffect } from 'react'
import { getSession, loginAdmin, logoutAdmin } from '../lib/appwrite'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then(u => { setUser(u); setLoading(false) })
  }, [])

  const login = async (email, password) => {
    await loginAdmin(email, password)
    const u = await getSession()
    setUser(u)
    return u
  }

  const logout = async () => {
    await logoutAdmin()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
