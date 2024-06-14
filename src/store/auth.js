import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  })

  const storeTokenInLs = (token) => {
    console.log('storing token in ls', token)
    setAuth((prevAuth) => ({ ...prevAuth, token }))
  }

  const clearAuth = () => {
    setAuth({ isAuthenticated: false, user: null, token: null })
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = auth.token
      if (token) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/me`,
            {
              header: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          // console.log('res', res)
          setAuth({ isAuthenticated: true, user: res.data, token })
        } catch (err) {
          console.error(err)
          setAuth({ isAuthenticated: false, user: null, token: null })
        }
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ storeTokenInLs, auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const authContextValue = useContext(AuthContext)
  if (!authContextValue) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return authContextValue
}
