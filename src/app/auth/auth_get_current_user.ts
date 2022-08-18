import { auth } from 'app/config/firebase'

const getCurrentUser = () => {
  const user = auth.currentUser

  return user
}

export default getCurrentUser
