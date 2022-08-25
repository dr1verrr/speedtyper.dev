import { auth } from '@/app/config/firebase'
import { User, onAuthStateChanged } from 'firebase/auth'

const getUser = () => {
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
