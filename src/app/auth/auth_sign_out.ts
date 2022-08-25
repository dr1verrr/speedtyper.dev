import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'

const signout = async () => {
  return await signOut(auth)
}

export default signout
