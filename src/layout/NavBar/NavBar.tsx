import { useEvent } from 'effector-react'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'

import SwitchTheme from '@/components/buttons/SwitchTheme'
import About from '@/components/icons/About'
import List from '@/components/icons/List'
import HomePageLogo from '@/components/navigation/HomePageLogo'
import { Button, Container, IconButton, Stack, UserAvatar } from '@/components/shared'
import RequireAuthentication from '@/hoc/RequireAuth'
import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { themeToggled } from '@/store/theme/events'

type RuleNames = 'NavBar'

const useStyles = createUseStyles<RuleNames, unknown, Theme>({
  NavBar: ({ theme }) => ({
    borderBottom: `1px solid ${theme.divider}`,
    position: 'sticky',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 500,
    color: theme.common.text,
    background: theme.common.bg,
    padding: '3px 5px',
    '@media (max-width: 400px)': {
      padding: '3px 0'
    }
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
      <Link
        style={{ borderRadius: '50%' }}
        to='/profile'
      >
        <IconButton sx={{ padding: 5 }}>
          <UserAvatar />
        </IconButton>
      </Link>
    )
  })

  const UserChallengesList = RequireAuthentication(() => {
    return (
      <Link to='/challenges'>
        <IconButton>
          <List />
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
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Link to='/'>
            <HomePageLogo />
          </Link>
          <Stack
            spacing={10}
            sx={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Link to='/play'>
              <Button
                sx={{
                  fontWeight: 600,
                  paddingLeft: 20,
                  paddingRight: 20
                }}
                variant='default'
              >
                Play
              </Button>
            </Link>
            <UserChallengesList />
            <SwitchTheme
              sx={{ maxWidth: 35, maxHeight: 35 }}
              onClick={toggleTheme}
            />
            <ProfileAvatarButton />
            <AuthenticationButton />
            <Link
              style={{ borderRadius: '50%' }}
              to='/about'
            >
              <IconButton
                sx={{ maxWidth: 35, maxHeight: 35 }}
                variant='primary'
              >
                <About />
              </IconButton>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </nav>
  )
}
