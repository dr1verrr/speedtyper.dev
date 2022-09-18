import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

import { codeSamples } from '@/views/ChallengePage/constants'

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
    } else {
      const challenges = Object.keys(codeSamples).map(lang => {
        const code = codeSamples[lang as keyof typeof codeSamples]
        return { code, language: lang }
      })
      return { ...state, challenges, current: challenges[0], left: challenges }
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
