import { auth } from '../config/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const signin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  return user
}

export default signin
