import { firebaseApp } from '../config/firebase'
import { getAuth, signInAnonymously } from 'firebase/auth'

const signAsGuest = async () => {
  const auth = getAuth(firebaseApp)

  return await signInAnonymously(auth)
}

export default signAsGuest
