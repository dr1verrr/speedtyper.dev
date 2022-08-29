import './App.css'
import { useEvent } from 'effector-react'
import { onAuthStateChanged } from 'firebase/auth'
import { Suspense, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Spinner from './components/loaders/Spinner'
import Box from './components/shared/Box'

import { auth } from '@/app/config/firebase'
import Layout from '@/components/wrappers/Layout'
import AppRoutes from '@/routes/AppRoutes'
import { authChanged } from '@/store/auth/events'

function App() {
  const updateAuthData = useEvent(authChanged)

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      updateAuthData(!!user)
    })
  }, [])

  return (
    <Router>
      <Layout>
        <Suspense
          fallback={
            <Box sx={{ position: 'fixed', bottom: 50, left: 50 }}>
              <Spinner size={35} />
            </Box>
          }
        >
          <AppRoutes />
        </Suspense>
      </Layout>
    </Router>
  )
}

export default App
