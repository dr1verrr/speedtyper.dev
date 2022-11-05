import { lazy } from 'react'

import { Box, Container, Stack } from '@/components/shared'

import { useChallenger } from '../../hooks'
import { ChallengerProps } from '../../types'
import ChallengerInput from '../shared/ui-interact/ChallengerInput'
import ChallengerProvider from './providers/Challenger.provider'

const ChallengerRealtimeStatistics = lazy(
  () => import('../shared/statistics/ChallengerRealtimeStatistics')
)
const ChallengerProgressBar = lazy(
  () => import('../shared/progress/ChallengerProgressBar')
)
const ChallengerControls = lazy(() => import('../shared/ui-interact/ChallengerControls'))

export default function Challenger({
  language,
  code,
  id,
  options,
  multiple,
  showNextButton = false
}: ChallengerProps) {
  const codeTrimmed = code.trim()
  const { actions: challengerActions } = useChallenger()

  return (
    <ChallengerProvider
      challengeId={id}
      multiple={multiple}
      next={multiple ? challengerActions.nextChallenge : undefined}
      options={{
        collectStats: options?.collectStats,
        showControls: options?.showControls,
        showProgressBar: options?.showProgressBar,
        showStats: options?.showStats,
        useLargeView: options?.useLargeView
      }}
    >
      <Container
        sx={{
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          minWidth: 150,
          width: '100%',
          maxWidth: options?.useLargeView ? 1440 : 1010
        }}
      >
        <Stack
          direction='column'
          spacing={15}
          sx={{ width: '100%' }}
        >
          <Stack
            spacing={15}
            sx={{ flexWrap: 'wrap', alignItems: 'center' }}
          >
            {options?.showControls && (
              <ChallengerControls showNextButton={showNextButton} />
            )}
            {options?.showProgressBar && (
              <Box
                sx={{
                  minWidth: 250,
                  flex: 1,
                  height: '100%'
                }}
              >
                <ChallengerProgressBar />
              </Box>
            )}
          </Stack>
          {options?.showStats && options.collectStats && <ChallengerRealtimeStatistics />}
          <ChallengerInput
            code={codeTrimmed}
            language={language}
          />
        </Stack>
      </Container>
    </ChallengerProvider>
  )
}
