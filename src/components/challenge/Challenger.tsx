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
  const [results, setResults] = useState<ChallengerStatisticsStore>()
  const interval = useRef<NodeJS.Timer>()

  const setStatistics = useEvent(challengerWorkStatisticsChanged)

  useEffect(() => {
    const { finished, paused, started } = challenger
    if (finished) {
      const statistics = $challengerStatistics.getState()
      setResults(statistics)
      actions.reset()
      return clearInterval(interval.current)
    }

    const onUnmount = () => clearInterval(interval.current)

    const updateTimer = () => {
      const time = $challengerWorkStatistics.getState().time
      setStatistics({ time: time + INCREMENT_TIME })
    }

    if (started && !interval.current) {
      interval.current = setInterval(updateTimer, 1000)
    } else if (started && !paused && interval.current) {
      interval.current = setInterval(updateTimer, 1000)
    }

    if (paused) {
      clearInterval(interval.current)
    }

    return onUnmount
  }, [challenger])

  useEffect(() => {
    const onUnmount = () => {
      actions.reset()
      actions.statistics.reset()
    }

    return () => onUnmount()
  }, [])

  useEffect(() => {
    console.log('results', results)
  }, [results])

  return (
    <Stack
      direction='column'
      spacing={15}
    >
      <ChallengerRealtimeStatistics />
      <ChallengerInput
        code={codeTrimmed}
        language={language}
      />
    </Stack>
  )
}
