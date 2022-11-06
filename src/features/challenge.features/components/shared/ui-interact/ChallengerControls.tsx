import Pause from '@/components/icons/Pause'
import Play from '@/components/icons/Play'
import Refresh from '@/components/icons/Refresh'
import { Button, Stack, Typography } from '@/components/shared'
import { useChallenger } from '@/features/challenge.features/hooks'

type ChallengerControlsProps = {
  showNextButton?: boolean
  options?: {
    showNextButton?: boolean
  }
}

export default function ChallengerControls({ showNextButton }: ChallengerControlsProps) {
  const {
    actions,
    challenger: { started, paused }
  } = useChallenger()

  const handlePlayPause = () => {
    if (!started) return actions.challenger.start
    return actions.status.togglePause
  }

  const handleCancel = () => {
    if (!started) return undefined
    return actions.status.cancel
  }

  const nextChallenge = () => {
    actions.nextChallenge()
  }

  return (
    <Stack
      spacing={5}
      sx={{ maxHeight: 33 }}
    >
      <Button
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={handlePlayPause()}
      >
        {(!started || paused) && <Play />}
        {started && !paused && <Pause />}
        <Typography
          highlighted
          sx={{ cursor: 'pointer', fontSize: 12, marginLeft: 5 }}
        >
          {!started ? 'Enter' : 'Alt+`'}
        </Typography>
      </Button>
      <Button
        disabled={!started}
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={handleCancel()}
      >
        <Refresh />
        <Typography
          highlighted
          sx={{ cursor: 'pointer', fontSize: 12, marginLeft: 5 }}
        >
          Alt+q
        </Typography>
      </Button>
      {showNextButton && (
        <Button
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={nextChallenge}
        >
          Next
          <Typography
            highlighted
            sx={{ cursor: 'pointer', fontSize: 12, marginLeft: 5 }}
          >
            Alt+n
          </Typography>
        </Button>
      )}
    </Stack>
  )
}
