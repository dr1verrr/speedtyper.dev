import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

import { codeSamples } from '@/views/ChallengePage/constants'

const getDefaultChallenges = () => {
  return Object.keys(codeSamples).map(lang => {
    return { code: codeSamples[lang as keyof typeof codeSamples], language: lang }
  })
}

const defaultChallenges = getDefaultChallenges()

import { LocalStorageKeys } from './constants'
import { fetchChallengesFx } from './effects'
import { nextChallenge } from './events'

type Challenge = {
  language: string
  code: string
  id?: string
}

type ChallengesStore = {
  left: Challenge[]
  current: Challenge | null
  challenges: Challenge[]
}

const defaultStore = {
  current: null,
  left: [],
  challenges: []
}

export type { ChallengesStore, Challenge }

const $challenges = createStore<ChallengesStore>(defaultStore)

persist({ store: $challenges, key: LocalStorageKeys.challenges })

$challenges
  .on(fetchChallengesFx.doneData, (state, payload) => {
    if (payload && payload.length) {
      const challenges = payload.map(({ created, ...ch }) => ch)
      return { ...state, challenges, current: challenges[0], left: challenges }
    }
  })
  .on(fetchChallengesFx.fail, (state, payload) => {
    return {
      challenges: defaultChallenges,
      current: defaultChallenges[0],
      left: defaultChallenges
    }
  })
  .on(nextChallenge, ({ challenges, left }) => {
    if (left.length === 1 || left.length <= 0) {
      return { challenges, current: challenges[0], left: challenges }
    } else {
      const updatedChallenges = left.slice(1)
      return { challenges, current: updatedChallenges[0], left: updatedChallenges }
    }
  })

export default $challenges
