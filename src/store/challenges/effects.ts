import { createEffect } from 'effector'

import { getChallenges } from '@/api/firestore/challenge'

const fetchChallengesFx = createEffect(async () => {
  return await getChallenges()
})

export { fetchChallengesFx }
