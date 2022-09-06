import { useStore } from 'effector-react'
import { useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'

import Metrics from '../metrics/Metrics'
import { Box, Stack } from '../shared'
import { $challenger, $challengerStatistics, ChallengerStatisticsStore } from './store'

type RuleNames = 'progressBar' | 'progressBarWrapper'

const useStyles = createUseStyles<RuleNames, ChallengerStatisticsStore, Theme>({
  progressBar: ({ theme, progress }) => ({
    width: '100%',
    padding: 5,
    position: 'relative',
    borderRadius: 30,
    background: theme.highlighter.progressBar.noFilled.color,
    '&::after': {
      content: '""',
      transition: 'width 0.2s ease',
      background: theme.highlighter.progressBar.filled.color,
      height: '100%',
      width: `${Math.floor(progress)}%`,
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      borderRadius: 'inherit'
    }
  }),
  progressBarWrapper: ({ theme }) => ({
    padding: '25px',
    borderRadius: 7,
    background: theme.highlighter.background
  })
})

export default function ChallengerRealtimeStatistics() {
  const statistics = useStore($challengerStatistics)
  const challengerStatus = useStore($challenger)
  const theme = useTheme()
  const classes = useStyles({ theme, ...statistics })
  const interval = useRef<NodeJS.Timer>()

  const [delayedStats, setDelayedStats] = useState({
    wpm: $challengerStatistics.getState().wpm
  })

  useEffect(() => {
    const updateDelayedStats = () => {
      const statistics = $challengerStatistics.getState()
      setDelayedStats({
        wpm: statistics.wpm
      })
    }

    if (challengerStatus.started && !interval.current) {
      interval.current = setInterval(updateDelayedStats, 1000)
    }

    if (challengerStatus.paused && interval.current) {
      clearInterval(interval.current)
    } else if (!challengerStatus.paused && challengerStatus.started && interval.current) {
      interval.current = setInterval(updateDelayedStats, 1000)
    }

    if (challengerStatus.finished) {
      clearInterval(interval.current)
    }

    return () => {
      clearInterval(interval.current)
    }
  }, [challengerStatus])

  return (
    <Stack
      direction='column'
      spacing={15}
    >
      <Box className={classes.progressBarWrapper}>
        <Box className={classes.progressBar}></Box>
      </Box>
      <Stack
        direction='row'
        spacing={20}
      >
        <Metrics
          data={[
            ['Time', `${statistics.time / 1000}s`],
            ['WPM', `${delayedStats.wpm.toFixed(0)}`],
            ['Combo', `${statistics.combo}`],
            ['Progress', `${Math.floor(statistics.progress).toFixed(0)}%`]
          ]}
        />
      </Stack>
    </Stack>
  )
}
