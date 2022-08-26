import AuthenticatedRoute from './AuthenticatedRoute'
import PublicRoute from './PublicRoute'
import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('@/views/Home'))
const NotFound = lazy(() => import('@/views/404/404'))
const SignIn = lazy(() => import('@/views/Authentication/SignIn'))
const SignUp = lazy(() => import('@/views/Authentication/SignUp'))
const Profile = lazy(() => import('@/views/Profile'))

function AppRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<Home />}
      />
      <Route
        path='*'
        element={<NotFound />}
      />
      <Route element={<PublicRoute />}>
        <Route
          path='/sign-in'
          element={<SignIn />}
        />
        <Route
          path='/sign-up'
          element={<SignUp />}
        />
      </Route>
      <Route element={<AuthenticatedRoute />}>
        <Route
          path='/profile'
          element={<Profile />}
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes
