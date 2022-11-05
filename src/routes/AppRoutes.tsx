import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import About from '@/views/About'

import AuthenticatedRoute from './AuthenticatedRoute'
import PublicRoute from './PublicRoute'

const Home = lazy(() => import('@/views/Home'))
const NotFound = lazy(() => import('@/views/404/404'))
const SignIn = lazy(() => import('@/views/Authentication/SignIn'))
const SignUp = lazy(() => import('@/views/Authentication/SignUp'))
const Profile = lazy(() => import('@/views/Profile'))
const ChallengePage = lazy(() => import('@/views/ChallengePage'))
const GetStartedPage = lazy(() => import('@/views/GetStarted'))
const SessionPage = lazy(() => import('@/views/SessionPage'))
const PlayPage = lazy(() => import('@/views/PlayPage'))
const ChallengesPage = lazy(() => import('@/views/ChallengesPage'))
const ChallengeInfo = lazy(() => import('@/views/ChallengeInfo'))

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
      <Route
        element={<PlayPage />}
        path='/play'
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
        <Route
          element={<ChallengePage />}
          path='/challenge/:id'
        />
        <Route
          element={<SessionPage />}
          path='/session/:id'
        />
      </Route>
      <Route
        element={<ChallengesPage />}
        path='/challenges'
      />
      <Route
        element={<ChallengeInfo />}
        path='/challenge-info/:id'
      />
      <Route
        element={<GetStartedPage />}
        path='/get-started'
      />
      <Route
        element={<About />}
        path='/about'
      />
    </Routes>
  )
}

export default AppRoutes
