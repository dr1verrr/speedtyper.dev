import { useStore } from 'effector-react'
import { Navigate, Outlet } from 'react-router-dom'

import $auth from '@/store/auth/store'

function PublicRoute() {
  const uid = useStore($auth)

  return !uid ? <Outlet /> : <Navigate to='/profile' />
}

export default PublicRoute
