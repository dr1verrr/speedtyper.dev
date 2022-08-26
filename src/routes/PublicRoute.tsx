import $auth from '@/store/auth/store'
import { useStore } from 'effector-react'
import { Navigate, Outlet } from 'react-router-dom'

function PublicRoute() {
  const isAuthenticated = useStore($auth)
  console.log('Authenticated changed', isAuthenticated)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/profile' />
}

export default PublicRoute
