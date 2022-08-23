import { auth } from '@/app/config/firebase'
import Layout from '@/components/wrappers/Layout'
import { authChanged } from '@/store/auth/events'
import { useEvent } from 'effector-react'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'

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
        <AppRoutes />
      </Layout>
    </Router>
  )
}

export default App
