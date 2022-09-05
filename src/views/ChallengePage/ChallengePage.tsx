import Challenger from '@/components/challenge/Challenger'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'

import { codeSamples } from './constants'

export default function ChallengePage() {
  return (
    <Container sx={{ maxWidth: 1024 }}>
      <Box sx={{ paddingTop: 75 }}>
        <Challenger
          code={codeSamples.ruby}
          language='javascript'
        />
      </Box>
    </Container>
  )
}
