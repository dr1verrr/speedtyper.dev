import { useEvent } from 'effector-react'
import { useEffect, useRef, useState } from 'react'

import { Stack } from '../shared'
import ChallengerInput from './ChallengerInput'
import ChallengerRealtimeStatistics from './ChallengerRealtimeStatistics'
import { CHALLENGER_STATS_TIME_INCREMENT } from './constants'
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
  const [resultStats, setResultStats] = useState<ChallengerStatisticsStore>()
  const timerInterval = useRef<NodeJS.Timer>()

  const setStatistics = useEvent(challengerWorkStatisticsChanged)

  const getResults = (resStats: ChallengerStatisticsStore) => {
    //const {} = resStats
  }

  useEffect(() => {
    const { finished, paused, started } = challenger
    if (finished) {
      const statistics = $challengerStatistics.getState()
      setResultStats(statistics)
      actions.reset()
      return clearInterval(timerInterval.current)
    }

    const timer = {
      set: () => {
        timerInterval.current = setInterval(updateTimer, 1000)
      },
      clear: () => {
        clearTimeout(timerInterval.current)
      }
    }

    const onUnmount = () => timer.clear()

    const updateTimer = () => {
      const time = $challengerWorkStatistics.getState().time
      setStatistics({ time: time + CHALLENGER_STATS_TIME_INCREMENT })
    }

    if (
      (started && !timerInterval.current) ||
      (started && !paused && timerInterval.current)
    ) {
      timer.set()
    }

    if (paused) {
      clearInterval(timerInterval.current)
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
    if (resultStats) {
      const results = getResults(resultStats)
      console.log('results', results)
    }
    //console.log('result stats', resultStats)
  }, [resultStats])

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
