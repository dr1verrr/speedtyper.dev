import { Auth, getAuth } from 'firebase/auth'

import { firebaseApp } from '../config/firebase'

export const getAuthData = (): Auth => getAuth(firebaseApp)
