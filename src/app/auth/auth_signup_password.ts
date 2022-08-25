import { firebaseApp } from '@/app/config/firebase'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'

const signup = async (email: string, password: string) => {
  const auth = getAuth(firebaseApp)
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  return user
}

export default signup
