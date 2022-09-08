import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { rgba } from '@/utils/styles'

import KeyboardLogo from '../icons/KeyboardLogo'
import { Box, Typography } from '../shared'

const useStyles = createUseStyles<'logo', unknown, Theme>({
  logo: ({ theme }) => ({
    color: rgba(theme.common.text, 0.9),
    '& svg': {
      fill: rgba(theme.common.text, 0.9)
    }
  })
})

export default function HomePageLogo() {
  const theme = useTheme()
  const classes = useStyles({ theme })

  return (
    <Box
      className={classes.logo}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px'
      }}
    >
      <Box sx={{ marginRight: 8 }}>
        <KeyboardLogo size={40} />
      </Box>
      <Box>
        <Typography variant='h3'>keyboard-trainer.dev</Typography>
      </Box>
    </Box>
  )
}
