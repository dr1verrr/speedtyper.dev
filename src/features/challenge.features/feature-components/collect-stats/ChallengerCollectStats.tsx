import { useEvent } from 'effector-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { createSession } from '@/api/firestore/challenge'

import { useChallengerContext } from '../../components/play/providers/Challenger.context'
import { useChallenger } from '../../hooks'
import { $challengerStatistics, $challengerWorkStatistics } from '../../store'
import { ChallengerStatisticsStore } from '../../store/store'
import { CHALLENGER_STATS_TIME_INCREMENT } from '../../store/store.constants'
import { challengerWorkStatisticsChanged } from '../../store/store.events'
import { COLLECT_STATS_HELPERS } from './helpers'

type ChallengerCollectStatsProps = {
  challengeId: string | undefined
}

const ChallengerCollectStats = ({ challengeId }: ChallengerCollectStatsProps) => {
  const [resultStats, setResultStats] = useState<ChallengerStatisticsStore>()

  const { actions: challengerActions, challenger } = useChallenger()
  const { actions: contextActions, results } = useChallengerContext()

  const timerInterval = useRef<NodeJS.Timer>()
  const timeStartedOrResumed = useRef<Date>()
  const pressed = useRef(0)

  const setStatistics = useEvent(challengerWorkStatisticsChanged)

  const isTimedOut = () => {
    const time = $challengerWorkStatistics.getState().time
    if (time >= 1000 && time / 1000 < 350) {
      return false
    } else if (time <= 1000) {
      return false
    }

    return true
  }

  const onTimedOut = () => {
    actions.timer.clear()
    challengerActions.reset()
    toast('Timed out.', { icon: '⌚' })
  }

  const actions = {
    updateTimeAndWpm: () => {
      const { time, keyboard } = $challengerWorkStatistics.getState()
      if (!isTimedOut()) {
        const wpm = actions.getUpdatedWpm(keyboard.pressed)
        setStatistics({
          time: time + CHALLENGER_STATS_TIME_INCREMENT,
          wpm
        })
      } else {
        onTimedOut()
      }
    },
    timer: {
      set: () => {
        timerInterval.current = setInterval(actions.updateTimeAndWpm, 1000)
      },
      clear: () => {
        clearInterval(timerInterval.current)
      }
    },
    getResults: (resStats: ChallengerStatisticsStore) => {
      const { code, combo, progress, ...rest } = resStats
      const stats = rest
      const accuracy = ((code!.total - stats.errors.length) / code!.total) * 100

      return {
        ...stats,
        timeEnded: new Date(),
        accuracy,
        wpm: stats.timeline.reduce((p, n) => p + n.wpm, 0) / stats.timeline.length
      }
    },
    getUpdatedWpm: (rightPressed: number) => {
      const wpm = COLLECT_STATS_HELPERS.getWpm(rightPressed - pressed.current)
      pressed.current = rightPressed

      return wpm
    }
  }

  useEffect(() => {
    const { finished, paused, started } = challenger

    if (started && isTimedOut()) {
      return onTimedOut()
    }

    if (finished) {
      pressed.current = 0
      const statistics = $challengerStatistics.getState()
      if (statistics.progress === 100) {
        setResultStats(statistics)
      }

      actions.timer.clear()
      challengerActions.statistics.reset()
      timerInterval.current = undefined
      timeStartedOrResumed.current = undefined
      return
    }

    if (started) {
      if (!timerInterval.current || (!paused && timerInterval.current)) {
        if (!timeStartedOrResumed.current) {
          const timeStarted = $challengerWorkStatistics.getState().timeStarted
          timeStartedOrResumed.current = timeStarted!
        } else {
          timeStartedOrResumed.current = new Date()
        }
        actions.timer.set()
      }
    }

    if (paused) {
      const { keyboard, time } = $challengerWorkStatistics.getState()
      const elapsedTime =
        new Date().getMilliseconds() - timeStartedOrResumed.current!.getMilliseconds()
      const wpm = actions.getUpdatedWpm(keyboard.pressed)

      setStatistics({
        time: time + COLLECT_STATS_HELPERS.getElapsedTime(elapsedTime),
        wpm
      })

      actions.timer.clear()
    }

    return () => {
      actions.timer.clear()
    }
  }, [challenger])

  useEffect(() => {
    if (resultStats) {
      challengerActions.reset()
      contextActions.setResults(actions.getResults(resultStats))
    }
  }, [resultStats])

  useEffect(() => {
    if (results && challengeId) {
      createSession(challengeId, results)
    }
  }, [results, challengeId])

  return null
}

export default ChallengerCollectStats
