import { Link } from 'react-router-dom'

import Features from '@/components/home/Features'
import KeyboardLogo from '@/components/icons/KeyboardLogo'
import { Button, Typography } from '@/components/shared'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'
import Stack from '@/components/shared/Stack/Stack'

export default function Home() {
  return (
    <Container maxWidth='md'>
      <Box sx={{ paddingTop: 30, paddingBottom: 100 }}>
        <Stack
          direction='column'
          spacing={15}
          sx={{ paddingBottom: 50, alignItems: 'center' }}
        >
          <Stack
            direction='column'
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '35px 10px 50px'
            }}
          >
            <KeyboardLogo size={150} />
            <Typography
              sx={{ fontWeight: 400, marginTop: 0, textAlign: 'center', fontSize: 34 }}
              variant='h1'
            >
              Grow your coding speed by own snippets.
            </Typography>
            <Box sx={{ marginTop: 20 }}>
              <Link to='/get-started'>
                <Button
                  sx={{
                    padding: '15px 40px',
                    fontSize: 20,
                    fontWeight: 600,
                    borderColor: 'palevioletred'
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </Box>
          </Stack>

          <Box sx={{ marginTop: 30 }}>
            <Features />
          </Box>
        </Stack>
      </Box>
    </Container>
  )
}
