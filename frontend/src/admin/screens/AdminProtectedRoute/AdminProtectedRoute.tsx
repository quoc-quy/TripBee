import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function AdminProtectedRoute() {
  const { isAuthenticated, profile } = useContext(AppContext)

  return isAuthenticated && profile?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/admin/login" />
}
