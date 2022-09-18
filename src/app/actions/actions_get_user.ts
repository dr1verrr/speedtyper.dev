import { onAuthStateChanged, User } from 'firebase/auth'

import { auth } from '@/app/config/firebase'

const getUser = (): Promise<User | null> => {
  return new Promise<User>((resolve, reject) => {
    onAuthStateChanged(
      auth,
      user => {
        if (user) {
          resolve(user)
        } else {
          reject(new Error('User not authenticated.'))
        }
      },
      error => {
        reject(error)
      }
    )
  })
}

export default getUser
