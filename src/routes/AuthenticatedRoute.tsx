import $auth from '@/store/auth/store'
import { useStore } from 'effector-react'
import { Navigate, Outlet } from 'react-router-dom'

function AuthenticatedRoute() {
  const isAuthenticated = useStore($auth)

  return isAuthenticated ? <Outlet /> : <Navigate to='/sign-in' />
}

export default AuthenticatedRoute
