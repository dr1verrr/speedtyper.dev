import { Outlet } from 'react-router-dom'

function AuthenticatedRoute(): JSX.Element {
  //const isAuthenticated = useAppSelector(state => state.auth)

  //return isAuthenticated ? <Outlet /> : <Navigate to={'/signin'} />
  return <Outlet />
}

export default AuthenticatedRoute
