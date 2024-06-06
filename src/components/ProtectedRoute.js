import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../store/auth'

const ProtectedRoute = ({ role }) => {
  const { auth } = useAuth()
  // console.log('auth', auth)
  if (!auth || !auth.isAuthenticated || !auth.user) {
    // console.log('Not authenticated')
    return <Navigate to='/' />
  }
  if (role && !role.includes(auth.user.role)) {
    // console.log('Not authenticated from role')
    return <Navigate to='/' />
  }

  return <Outlet />
}

export default ProtectedRoute
