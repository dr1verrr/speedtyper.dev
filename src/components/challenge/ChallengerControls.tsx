import Pause from '../icons/Pause'
import Play from '../icons/Play'
import Refresh from '../icons/Refresh'
import { Box, Button, Stack, Typography } from '../shared'
import { useChallenger } from './hooks'

type ChallengerControlsProps = {
  showNextButton?: boolean
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(!started || paused) && <Play />}
          {started && !paused && <Pause />}
        </Box>
        <Typography
          highlighted
          sx={{ cursor: 'pointer', fontSize: 12, marginLeft: 5 }}
        >
          Alt+`
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
