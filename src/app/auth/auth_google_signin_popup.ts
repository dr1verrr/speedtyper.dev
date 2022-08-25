import { auth } from '../config/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const signinWithGooglePopup = async () => {
  const googleProvider = new GoogleAuthProvider()

  return await signInWithPopup(auth, googleProvider)
}

export default signinWithGooglePopup
