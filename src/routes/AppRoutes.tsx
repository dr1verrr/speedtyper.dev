import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import AuthenticatedRoute from './AuthenticatedRoute'
import PublicRoute from './PublicRoute'

const Home = lazy(() => import('@/views/Home'))
const NotFound = lazy(() => import('@/views/404/404'))
const SignIn = lazy(() => import('@/views/Authentication/SignIn'))
const SignUp = lazy(() => import('@/views/Authentication/SignUp'))
const Profile = lazy(() => import('@/views/Profile'))
const ChallengePage = lazy(() => import('@/views/ChallengePage'))

function AppRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<Home />}
      />
      <Route
        element={<NotFound />}
        path='*'
      />
      <Route element={<PublicRoute />}>
        <Route
          element={<SignIn />}
          path='/sign-in'
        />
        <Route
          element={<SignUp />}
          path='/sign-up'
        />
      </Route>
      <Route element={<AuthenticatedRoute />}>
        <Route
          element={<Profile />}
          path='/profile'
        />
      </Route>
      <Route
        element={<ChallengePage />}
        path='/challenge'
      />
    </Routes>
  )
}

export default AppRoutes
