import { Route, Routes } from 'react-router-dom'

import AuthenticatedRoute from './AuthenticatedRoute'
import PublicRoute from './PublicRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<div>Home</div>} />
      <Route path='*' element={<div>Not Found</div>} />
      <Route element={<PublicRoute />}></Route>
      <Route element={<AuthenticatedRoute />}>
        <Route path='/profile' element={<div>Profile</div>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
