import { lazy, ReactNode, useEffect, useState } from 'react'

import { useChallenger } from '@/features/challenge.features/hooks'
import {
  ChallengerOptions,
  TChallengerResults
} from '@/features/challenge.features/types'

import { ChallengerContext } from './Challenger.context'
import { TChallengerContextActions } from './Challenger.provider.types'

const ChallengerResultPhase = lazy(() => import('../../phases/phases.result'))
const ChallengerCollectStats = lazy(
  () => import('@/features/challenge.features/feature-components/collect-stats')
)

type ChallengerProviderProps = {
  children?: ReactNode
  next?: () => void
  options: ChallengerOptions
  multiple?: boolean
  challengeId: string | undefined
}

const ChallengerProvider = ({
  children,
  next,
  options,
  multiple,
  challengeId
}: ChallengerProviderProps) => {
  const { actions: challengerActions } = useChallenger()
  const [results, setResults] = useState<TChallengerResults | null>(null)

  useEffect(() => {
    if (multiple) {
      const handler = (e: KeyboardEvent) => {
        if (e.altKey && e.key === 'n') {
          challengerActions.nextChallenge()
        }
      }

      document.addEventListener('keydown', handler)

      return () => {
        document.removeEventListener('keydown', handler)
      }
    }
  }, [multiple])

  useEffect(() => {
    return () => {
      challengerActions.onUnmount()
    }
  }, [])

  const actions: TChallengerContextActions = {
    setResults: results => {
      setResults(results)
    },
    resetResults: () => {
      setResults(null)
    }
  }

  const providerActions = {
    repeat: () => {
      actions.resetResults()
    }
  }

  return (
    <ChallengerContext.Provider value={{ results, actions, options }}>
      {options.collectStats && <ChallengerCollectStats challengeId={challengeId} />}
      {results ? (
        <ChallengerResultPhase
          next={next}
          options={options}
          repeat={providerActions.repeat}
          results={results}
        />
      ) : (
        children
      )}
    </ChallengerContext.Provider>
  )
}

export default ChallengerProvider
