import Challenger from '@/components/challenge'
import { Typography } from '@/components/shared'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'

export default function ChallengePage() {
  return (
    <Container sx={{ maxWidth: 900 }}>
      <Typography variant='h1'>Challenge</Typography>
      <Box>
        <Challenger />
      </Box>
    </Container>
  )
}
