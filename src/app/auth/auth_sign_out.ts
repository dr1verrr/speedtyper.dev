import { signOut } from 'firebase/auth'

import { auth } from '../config/firebase'

const signout = async () => {
  return await signOut(auth)
}

export default signout
