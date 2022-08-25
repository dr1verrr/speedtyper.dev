import { auth } from '@/app/config/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

const sendPasswordReset = async (email: string) => {
  return await sendPasswordResetEmail(auth, email)
}

export default sendPasswordReset
