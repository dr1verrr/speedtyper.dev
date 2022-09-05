import { useEvent } from 'effector-react'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'

import SwitchTheme from '@/components/buttons/SwitchTheme'
import About from '@/components/icons/About'
import KeyboardLogo from '@/components/icons/KeyboardLogo'
import { Button, Stack, Typography } from '@/components/shared'
import UserAvatar from '@/components/shared/Avatar'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'
import IconButton from '@/components/shared/IconButton'
import RequireAuthentication from '@/hoc/RequireAuth'
import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { themeToggled } from '@/store/theme/events'

type RuleNames = 'NavBar'

const useStyles = createUseStyles<RuleNames, unknown, Theme>({
  NavBar: ({ theme }) => ({
    borderBottom: `1px solid ${theme.common.border}`,
    position: 'sticky',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 500,
    color: theme.common.text,
    background: theme.common.bg
  })
})

export default function NavBar() {
  const AuthenticationButton = RequireAuthentication(
    () => (
      <Link to='/sign-in'>
        <Button>Sign in / Sign up</Button>
      </Link>
    ),
    false
  )

  const ProfileAvatarButton = RequireAuthentication(() => {
    return (
      <Link to='/profile'>
        <IconButton sx={{ padding: 5 }}>
          <UserAvatar />
        </IconButton>
      </Link>
    )
  })

  const toggleTheme = useEvent(themeToggled)

  const theme = useTheme()
  const classes = useStyles({ theme })

  return (
    <nav className={classes.NavBar}>
      <Container maxWidth='md'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 10px'
          }}
        >
          <Link to='/'>
            <Box
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
          </Link>
          <Stack
            spacing={15}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SwitchTheme
              sx={{ maxWidth: 35, maxHeight: 35 }}
              onClick={toggleTheme}
            />
            <ProfileAvatarButton />
            <AuthenticationButton />
            <Link to='/about'>
              <IconButton sx={{ maxWidth: 35, maxHeight: 35 }}>
                <About />
              </IconButton>
            </Link>
          </Stack>
        </Box>
      </Container>
    </nav>
  )
}
