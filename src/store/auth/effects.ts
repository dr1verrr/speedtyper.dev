import { createEffect } from 'effector'

import { getUser } from '@/app/actions'

const fetchUserFx = createEffect(async () => {
  const user = await getUser()
  return user
})

export { fetchUserFx }
