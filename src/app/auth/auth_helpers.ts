import { firebaseApp } from '../config/firebase'
import { Auth, getAuth } from 'firebase/auth'

export const getAuthData = (): Auth => getAuth(firebaseApp)
