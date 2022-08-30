import { useEvent, useStore } from 'effector-react'
import { useEffect } from 'react'

import { Box, Stack, Typography } from '../shared'

import { INCREMENT_TIME } from './constants'
import { challengerStatisticsChanged } from './events'
import { $challengerStatistics } from './store'

export default function ChallengerRealtimeStatistics() {
  const statistics = useStore($challengerStatistics)
  const setStatistics = useEvent(challengerStatisticsChanged)

  useEffect(() => {
    const interval = setInterval(() => {
      const time = $challengerStatistics.getState().time
      setStatistics({ time: time + INCREMENT_TIME })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Box>
      <Stack direction='column'>
        <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
          Time: {statistics.time / 1000}s
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
          WPM: {statistics.wpm.toFixed(0)}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
          Progress: {statistics.progress.toFixed(0)}%
        </Typography>
      </Stack>
    </Box>
  )
}
