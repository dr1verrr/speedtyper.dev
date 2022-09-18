import { useStore } from 'effector-react'
import { Navigate, Outlet } from 'react-router-dom'

import $auth from '@/store/auth/store'

function AuthenticatedRoute() {
  const uid = useStore($auth)

  return uid ? <Outlet /> : <Navigate to='/sign-in' />
}

export default AuthenticatedRoute
