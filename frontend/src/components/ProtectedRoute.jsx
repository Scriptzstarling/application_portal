import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedRoute() {
  const location = useLocation()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  if (!token) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?required=1&next=${next}`} replace />
  }
  return <Outlet />
}


