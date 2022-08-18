import { sendPasswordResetEmail } from 'firebase/auth'

import { auth } from 'app/config/firebase'

const sendPasswordReset = async (email: string) => {
  return await sendPasswordResetEmail(auth, email)
}

export default sendPasswordReset
