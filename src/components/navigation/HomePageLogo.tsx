import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { rgba } from '@/utils/styles'

import KeyboardLogo from '../icons/KeyboardLogo'
import { Box, Typography } from '../shared'

const useStyles = createUseStyles<'wrapper' | 'title' | 'logoWrapper', unknown, Theme>({
  wrapper: ({ theme }) => ({
    color: rgba(theme.common.text, 0.9),
    border: '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 10px',

    '& svg': {
      fill: rgba(theme.common.text, 0.9)
    },
    '&:hover': {
      transitionProperty: 'background, border-color',
      transitionDuration: '0.1s',
      background: rgba(theme.common.textColors.secondary, 0.1),
      borderRadius: 6,
      borderColor: rgba(theme.common.textColors.secondary, 0.2)
    },
    '&:hover $title': {
      //color: rgba(theme.common.text, 0.3)
    }
  }),
  title: ({ theme }) => ({
    '@media (max-width: 570px)': {
      display: 'none'
    }
  }),
  logoWrapper: ({ theme }) => ({
    marginRight: 8,
    '@media (max-width: 570px)': {
      marginRight: 0
    }
  })
})

export default function HomePageLogo() {
  const theme = useTheme()
  const classes = useStyles({ theme })

  return (
    <Box
      className={classes.wrapper}
      //sx={{
      //  display: 'flex',
      //  alignItems: 'center',
      //  justifyContent: 'center',
      //  padding: '2px 10px'
      //}}
    >
      <Box className={classes.logoWrapper}>
        <KeyboardLogo size={40} />
      </Box>
      <Typography
        className={classes.title}
        sx={{ margin: 0 }}
        variant='h3'
      >
        speedtyper.dev
      </Typography>
    </Box>
  )
}
