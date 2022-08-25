import { firebaseApp } from '@/app/config/firebase'
import { User, getAuth, updateCurrentUser } from 'firebase/auth'

const updateUser = async (user: User) => {
  const auth = getAuth(firebaseApp)

  return await updateCurrentUser(auth, user)
}

export default updateUser
