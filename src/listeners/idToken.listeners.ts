import { onIdTokenChanged } from 'firebase/auth'
import { FirebaseListener } from 'index.d'

import { getAuthData } from 'app/auth'

const idTokenListener: FirebaseListener = (nextOrObserver, error, completed) => {
  const auth = getAuthData()
  return onIdTokenChanged(auth, nextOrObserver, error, completed)
}

export default idTokenListener
