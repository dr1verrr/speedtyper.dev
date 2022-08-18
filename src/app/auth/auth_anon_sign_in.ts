import { getAuth, signInAnonymously } from 'firebase/auth'

import { firebaseApp } from '../config/firebase'

const signAsGuest = async () => {
  const auth = getAuth(firebaseApp)

  return await signInAnonymously(auth)
}

export default signAsGuest
