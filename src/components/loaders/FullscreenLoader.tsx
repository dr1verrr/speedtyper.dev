import { Box, Container } from '../shared'
import SpinnerWave from './SpinnerWave'

export default function FullscreenLoader() {
  return (
    <Container
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box>
        <SpinnerWave />
      </Box>
    </Container>
  )
}
