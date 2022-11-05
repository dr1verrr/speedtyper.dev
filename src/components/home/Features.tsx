import { useTheme } from '@/services/theme/actions'
import { videos } from '@/views/Home/constants'

import { Container, Stack, Typography } from '../shared'

export default function Features() {
  const theme = useTheme()
  return (
    <Container sx={{ overflow: 'auto' }}>
      <Stack
        direction='row'
        spacing={75}
        sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}
      >
        <Stack
          direction='column'
          spacing={10}
          sx={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            highlighted
            sx={{ fontSize: 24, padding: '12px 25px' }}
          >
            ⌨️ Train by your own text / code
          </Typography>
          <video
            autoPlay
            loop
            muted
            playsInline
            src={videos.features.typing}
            style={{
              maxWidth: '100%',
              height: 'auto',
              border: `1px solid ${theme.divider}`,
              borderRadius: 15,
              maxHeight: '60vh'
            }}
          ></video>
        </Stack>

        <Stack
          direction='column'
          spacing={10}
          sx={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            highlighted
            sx={{ fontSize: 24, padding: '12px 25px' }}
          >
            ⚙️ Choice of Preferences
          </Typography>
          <video
            autoPlay
            loop
            muted
            playsInline
            src={videos.features.preferences}
            style={{
              maxWidth: '100%',
              height: 'auto',
              border: `1px solid ${theme.divider}`,
              borderRadius: 15,
              maxHeight: '60vh'
            }}
          ></video>
        </Stack>

        <Stack
          direction='column'
          spacing={10}
          sx={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            highlighted
            sx={{ fontSize: 24, padding: '12px 25px' }}
          >
            📝 Manage typing snippets
          </Typography>
          <video
            autoPlay
            loop
            muted
            playsInline
            src={videos.features.manageData}
            style={{
              maxWidth: '100%',
              height: 'auto',
              border: `1px solid ${theme.divider}`,
              borderRadius: 15,
              maxHeight: '60vh'
            }}
          ></video>
        </Stack>
      </Stack>
    </Container>
  )
}
