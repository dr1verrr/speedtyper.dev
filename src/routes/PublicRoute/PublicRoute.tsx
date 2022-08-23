import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from 'store'

function PublicRoute(): JSX.Element {
  const isAuthenticated = useAppSelector(state => state.auth)

  return !isAuthenticated ? <Outlet /> : <Navigate to={'/profile'} />
}

export default PublicRoute
