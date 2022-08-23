import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from 'store'

function AuthenticatedRoute(): JSX.Element {
  const isAuthenticated = useAppSelector(state => state.auth)

  return isAuthenticated ? <Outlet /> : <Navigate to={'/signin'} />
}

export default AuthenticatedRoute
