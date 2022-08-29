import { useEvent } from 'effector-react'
import { onIdTokenChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'

import { loadingChanged } from '@/store/ui/events'
import { auth } from '@/app/config/firebase'

const useAuthUser = () => {
  const [user, setUser] = useState<null | User>(null)
  const setLoading = useEvent(loadingChanged)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = onIdTokenChanged(auth, authUser => {
      setUser(authUser ? { ...authUser } : null)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user }
}

export default useAuthUser
