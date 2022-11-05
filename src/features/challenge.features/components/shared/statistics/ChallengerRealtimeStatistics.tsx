import { useStore } from 'effector-react'
import { useEffect, useRef, useState } from 'react'

import Metrics from '@/components/metrics/Metrics'
import { Stack } from '@/components/shared'
import { useChallenger } from '@/features/challenge.features/hooks'
import $challenger, { $challengerStatistics } from '@/features/challenge.features/store'
import { convertMsToTime } from '@/utils/timestamp'

export default function ChallengerRealtimeStatistics() {
  const statistics = useStore($challengerStatistics)
  const challengerStatus = useStore($challenger)
  const interval = useRef<NodeJS.Timer>()

  const { actions: challengerActions } = useChallenger()

  const [delayedStats, setDelayedStats] = useState({
    wpm: $challengerStatistics.getState().wpm
  })

  const actions = {
    updateDelayedStats: () => {
      const statistics = $challengerStatistics.getState()
      setDelayedStats({
        wpm: statistics.wpm
      })
    },
    timer: {
      set: () => {
        interval.current = setInterval(actions.updateDelayedStats, 1000)
      },
      clear: () => {
        clearInterval(interval.current)
      }
    },
    control: {
      togglePlayPause: () => {
        if (!challengerStatus.started) {
          return challengerActions.status.started.toggle()
        }
        challengerActions.status.paused.toggle()
      }
    }
  }

  useEffect(() => {
    const { finished, started, paused } = challengerStatus

    if (finished) {
      setDelayedStats({ wpm: 0 })
      interval.current = undefined
      return actions.timer.clear()
    }

    if ((started && !interval.current) || (started && !paused && interval.current)) {
      actions.timer.set()
    }

    if (paused) {
      actions.timer.clear()
    }

    return () => {
      actions.timer.clear()
    }
  }, [challengerStatus])

  return (
    <Stack
      direction='row'
      spacing={20}
      sx={{ overflow: 'auto' }}
    >
      <Metrics
        data={[
          ['Time', `${convertMsToTime(statistics.time)}`],
          ['WPM', `${delayedStats.wpm.toFixed(0)}`],
          ['Combo', `${statistics.combo}`],
          ['Progress', `${Math.floor(statistics.progress).toFixed(0)}%`]
        ]}
        style={{ flex: 1, maxWidth: '33%' }}
      />
    </Stack>
  )
}
