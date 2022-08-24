import { NotFound } from '@/views'
import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import AuthenticatedRoute from './AuthenticatedRoute'
import PublicRoute from './PublicRoute'

const Home = lazy(() => import('@/views/Home'))
const SignIn = lazy(() => import('@/views/Authentication/SignIn'))
const SignUp = lazy(() => import('@/views/Authentication/SignUp'))

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
          element={<div>Profile</div>}
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes
