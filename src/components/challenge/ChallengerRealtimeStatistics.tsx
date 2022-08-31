import { useStore } from 'effector-react'

import { Box, Stack, Typography } from '../shared'

import { $challengerStatistics } from './store'

export default function ChallengerRealtimeStatistics() {
  const statistics = useStore($challengerStatistics)

  return (
    <Box>
      <Stack
        direction='row'
        spacing={10}
        sx={{ justifyContent: 'space-around', alignItems: 'center' }}
      >
        <Stack
          direction='column'
          spacing={10}
          sx={{ width: '100%' }}
        >
          <Typography sx={{ fontSize: 24 }}>Time: {statistics.time / 1000}s</Typography>
          <Typography sx={{ fontSize: 24 }}>WPM: {statistics.wpm.toFixed(0)}</Typography>
        </Stack>
        <Stack
          direction='column'
          spacing={10}
          sx={{ width: '100%' }}
        >
          <Typography sx={{ fontSize: 24 }}>
            Progress: {statistics.progress.toFixed(0)}%
          </Typography>

          <Typography sx={{ fontSize: 24 }}>Combo: {statistics.combo}</Typography>
        </Stack>
        <Stack
          direction='column'
          spacing={10}
          sx={{ width: '100%' }}
        >
          <Typography sx={{ fontSize: 24 }}>Max Combo: {statistics.maxCombo}</Typography>
          <Typography sx={{ fontSize: 24 }}>
            Max WPM: {statistics.maxWpm.toFixed(0)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}
