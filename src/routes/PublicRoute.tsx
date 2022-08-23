import { Navigate, Outlet } from 'react-router-dom'

function PublicRoute(): JSX.Element {
  //const isAuthenticated = useAppSelector(state => state.auth)

  //return !isAuthenticated ? <Outlet /> : <Navigate to={'/profile'} />
  return <Outlet />
}

export default PublicRoute
