import { useEvent } from 'effector-react'
import { useEffect, useRef, useState } from 'react'

import { Stack } from '../shared'
import ChallengerInput from './ChallengerInput'
import ChallengerRealtimeStatistics from './ChallengerRealtimeStatistics'
import { INCREMENT_TIME } from './constants'
import { challengerWorkStatisticsChanged } from './events'
import useChallenger from './hooks/useChallenger'
import {
  $challengerStatistics,
  $challengerWorkStatistics,
  ChallengerStatisticsStore
} from './store'

type ChallengerProps = {
  language: string
  code: string
}

export default function Challenger({ language, code }: ChallengerProps) {
  const codeTrimmed = code.trim()
  const { actions, challenger } = useChallenger()
  const [isStarted, setStarted] = useState(false)
  const [isFinished, setFinished] = useState(false)
  const [results, setResults] = useState<ChallengerStatisticsStore>()
  const interval = useRef<NodeJS.Timer>()

  const setStatistics = useEvent(challengerWorkStatisticsChanged)

  useEffect(() => {
    const onUnmount = () => {
      actions.reset()
    }
    return onUnmount
  }, [])

  useEffect(() => {
    setStarted(challenger.started)
    setFinished(challenger.finished)
  }, [challenger])

  useEffect(() => {
    if (isFinished) {
      const statistics = $challengerStatistics.getState()
      setResults(statistics)
      actions.reset()
      return clearInterval(interval.current)
    }

    const onUnmount = () => clearInterval(interval.current)

    if (isStarted) {
      interval.current = setInterval(() => {
        const time = $challengerWorkStatistics.getState().time
        setStatistics({ time: time + INCREMENT_TIME })
      }, 1000)
    }

    return onUnmount
  }, [isStarted, isFinished])

  useEffect(() => {
    console.log('results', results)
  }, [results])

  return (
    <Stack
      direction='column'
      spacing={15}
    >
      <ChallengerRealtimeStatistics finished={isFinished} />
      <ChallengerInput
        code={codeTrimmed}
        language={language}
      />
    </Stack>
  )
}
