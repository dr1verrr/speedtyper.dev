import { Box, Container } from '../shared'
import SpinnerWave, { SpinnerProps } from './SpinnerWave'

type FullscreenLoaderProps = {
  SpinnerProps?: SpinnerProps
}

export default function FullscreenLoader({ SpinnerProps }: FullscreenLoaderProps) {
  return (
    <Container
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box>
        <SpinnerWave {...SpinnerProps} />
      </Box>
    </Container>
  )
}
