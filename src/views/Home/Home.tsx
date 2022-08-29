import { Link } from 'react-router-dom'

import Features from '@/components/home/Features'
import KeyboardLogo from '@/components/icons/KeyboardLogo'
import { Button, Typography } from '@/components/shared'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'
import Stack from '@/components/shared/Stack/Stack'

export default function Home() {
  return (
    <Box>
      <Container maxWidth='md'>
        <Stack
          direction='column'
          spacing={15}
          sx={{ marginTop: 20, marginBottom: 50, alignItems: 'center' }}
        >
          <Stack
            direction='column'
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <KeyboardLogo size={100} />
            <Typography
              sx={{ fontWeight: 400, marginTop: 0 }}
              variant='h1'
            >
              Grow your coding speed by own code snippets.
            </Typography>
          </Stack>
          <Link to='/challenge'>
            <Button sx={{ padding: '12px 30px', fontSize: 20, fontWeight: 600 }}>
              Get Started
            </Button>
          </Link>
          <Features />
        </Stack>
      </Container>
    </Box>
  )
}
