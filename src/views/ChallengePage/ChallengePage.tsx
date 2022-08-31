import { codeSamples } from './constants'

import Challenger from '@/components/challenge/Challenger'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'

export default function ChallengePage() {
  return (
    <Container sx={{ maxWidth: 1024 }}>
      <Box sx={{ paddingTop: 75 }}>
        <Challenger
          code={codeSamples.ruby.trim()}
          language='ruby'
        />
      </Box>
    </Container>
  )
}
