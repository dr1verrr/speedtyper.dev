import { useStore } from 'effector-react'
import { Navigate, Outlet } from 'react-router-dom'

import $auth from '@/store/auth/store'

function PublicRoute() {
  const isAuthenticated = useStore($auth)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/profile' />
}

export default PublicRoute
