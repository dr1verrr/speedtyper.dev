import { auth } from '@/app/config/firebase'
import { loadingChanged } from '@/store/ui/events'
import { useEvent } from 'effector-react'
import { onIdTokenChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'

const useAuthUser = () => {
  const [user, setUser] = useState<null | User>(null)
  const setLoading = useEvent(loadingChanged)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = onIdTokenChanged(auth, authUser => {
      setUser(authUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  return { user }
}

export default useAuthUser
