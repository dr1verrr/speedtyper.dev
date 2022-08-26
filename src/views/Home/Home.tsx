import SpinnerWave from '@/components/loaders/SpinnerWave'
import { Typography } from '@/components/shared'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'

export default function Home() {
  return (
    <Box>
      <Container maxWidth='md'>
        <Typography variant='h1'>Heading</Typography>
        <SpinnerWave />
      </Container>
    </Box>
  )
}
