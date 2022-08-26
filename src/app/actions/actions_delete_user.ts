import getUser from './actions_get_user'
import { deleteUser as firebaseDeleteUser } from 'firebase/auth'

const deleteUser = async () => {
  const user = await getUser()

  if (user) {
    return await firebaseDeleteUser(user)
  }
}

export default deleteUser
