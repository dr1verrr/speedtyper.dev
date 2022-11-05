import { createContext, useContext } from 'react'

import { TChallengerContext } from './Challenger.provider.types'

const ChallengerContext = createContext<TChallengerContext>({
  results: null
} as TChallengerContext)

const useChallengerContext = () => useContext(ChallengerContext)

export { useChallengerContext, ChallengerContext }
