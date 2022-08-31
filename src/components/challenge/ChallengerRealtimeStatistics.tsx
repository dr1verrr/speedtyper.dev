import { useStore } from 'effector-react'

import { Box, Stack, Typography } from '../shared'

import { $challengerStatistics } from './store'

export default function ChallengerRealtimeStatistics() {
  const statistics = useStore($challengerStatistics)

  return (
    <Stack
      direction='column'
      spacing={15}
    >
      <Box sx={{ padding: '25px', background: '#282a36', borderRadius: 7 }}>
        <Box
          sx={{
            width: '100%',
            padding: 5,
            position: 'relative',
            borderRadius: 30,
            background: '#fff'
          }}
        >
          <Box
            sx={{
              transition: 'width 0.2s ease',
              background: '#b794f4',
              height: '100%',
              width: `${statistics.progress}%`,
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              borderRadius: 'inherit'
            }}
          ></Box>
        </Box>
      </Box>
      <Stack
        direction='row'
        spacing={10}
        sx={{ fontSize: 24, fontWeight: 600 }}
      >
        <Box
          sx={{
            width: '100%',
            background: '#282a36',
            color: '#fff',
            padding: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 10
          }}
        >
          <Typography>Time: </Typography>
          <Typography sx={{ color: '#b794f4' }}>{statistics.time / 1000}s</Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            background: '#282a36',
            color: '#fff',
            padding: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 10
          }}
        >
          <Typography>WPM: </Typography>
          <Typography sx={{ color: '#b794f4' }}> {statistics.wpm.toFixed(0)}</Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            background: '#282a36',
            color: '#fff',
            padding: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 10
          }}
        >
          <Typography>Combo: </Typography>
          <Typography sx={{ color: '#b794f4' }}>{statistics.combo}</Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            background: '#282a36',
            color: '#fff',
            padding: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 10
          }}
        >
          <Typography>Progress: </Typography>
          <Typography sx={{ color: '#b794f4' }}>
            {statistics.progress.toFixed(0)}%
          </Typography>
        </Box>
      </Stack>
    </Stack>
  )
}
