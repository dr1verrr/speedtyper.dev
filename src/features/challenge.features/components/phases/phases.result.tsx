import { Suspense } from 'react'

import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Box, Button, Stack } from '@/components/shared'

import { ChallengerOptions, TChallengerResults } from '../../types'
import { ChallengerResults } from '../../views'

type ChallengerResultPhaseProps = {
  results: TChallengerResults
  repeat: () => void
  options?: ChallengerOptions
  next?: () => void
}

export type { ChallengerResultPhaseProps as ChallengerResultProps }

const ChallengerResultPhase = ({ next, results, repeat }: ChallengerResultPhaseProps) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        marginBottom: 25
      }}
    >
      <Suspense fallback={<FullscreenLoader />}>
        <Stack
          direction='column'
          sx={{
            alignItems: 'center',
            paddingTop: 20
          }}
        >
          <Stack spacing={10}>
            <Button
              sx={{ padding: '12px 20px' }}
              variant='primary'
              onClick={repeat}
            >
              Play again
            </Button>
            {next && <Button onClick={next}>Next</Button>}
          </Stack>

          <ChallengerResults stats={results} />
        </Stack>
      </Suspense>
    </Box>
  )
}

export default ChallengerResultPhase
