import { useEvent } from 'effector-react'
import { useEffect, useMemo, useState } from 'react'

import { Stack } from '../shared'

import ChallengerRealtimeStatistics from './ChallengerRealtimeStatistics'
import ChallengerInput from './ChallengerInput'
import { INCREMENT_TIME } from './constants'
import { challengerWorkStatisticsChanged } from './events'
import {
  $challengerStatistics,
  $challengerWorkStatistics,
  ChallengerStatisticsStore
} from './store'
import useChallenger from './useChallenger'

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

  const setStatistics = useEvent(challengerWorkStatisticsChanged)

  useEffect(() => {
    const onUnmount = () => {
      actions.reset()
    }
    return () => {
      onUnmount()
    }
  }, [])

  useEffect(() => {
    if (challenger.started && !isStarted) {
      setStarted(true)
    }
    if (challenger.finished && !isFinished) {
      setFinished(true)
    }
  }, [challenger])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined
    if (isFinished) {
      const statistics = $challengerStatistics.getState()
      setResults(statistics)
      actions.reset()
      return clearInterval(interval)
    }

    if (isStarted) {
      interval = setInterval(() => {
        const time = $challengerWorkStatistics.getState().time
        setStatistics({ time: time + INCREMENT_TIME })
      }, 1000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [isStarted, isFinished])

  useEffect(() => {
    console.log('results', results)
  }, [results])

  return useMemo(
    () => (
      <Stack
        direction='column'
        spacing={10}
      >
        <ChallengerRealtimeStatistics />
        <ChallengerInput
          code={codeTrimmed}
          language={language}
        />
      </Stack>
    ),
    [codeTrimmed, language]
  )
}
