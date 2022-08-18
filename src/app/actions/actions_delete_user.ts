import { deleteUser as firebaseDeleteUser } from 'firebase/auth'

import getUser from './actions_get_user'

const deleteUser = async () => {
  const user = await getUser()

  return await firebaseDeleteUser(user)
}

export default deleteUser
