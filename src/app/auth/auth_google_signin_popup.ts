import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { auth } from '../config/firebase'

const signinWithGooglePopup = async () => {
  const googleProvider = new GoogleAuthProvider()

  return await signInWithPopup(auth, googleProvider)
}

export default signinWithGooglePopup
