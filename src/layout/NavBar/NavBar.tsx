import SwitchTheme from '@/components/buttons/SwitchTheme'
import About from '@/components/icons/About'
import KeyboardLogo from '@/components/icons/KeyboardLogo'
import { Button, Typography } from '@/components/shared'
import UserAvatar from '@/components/shared/Avatar'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'
import IconButton from '@/components/shared/IconButton'
import RequireAuthentication from '@/hoc/RequireAuth'
import { useTheme } from '@/services/theme/actions'
import { themeToggled } from '@/store/theme/events'
import { useEvent } from 'effector-react'
import { Link } from 'react-router-dom'

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

  return (
    <nav
      style={{
        borderBottom: `1px solid ${theme.common.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 500,
        background: 'inherit'
      }}
    >
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
                padding: '0 10px',
                maxWidth: 'fit-content'
              }}
            >
              <Box sx={{ marginRight: 10 }}>
                <KeyboardLogo style={{ maxWidth: 40, maxHeight: 40 }} />
              </Box>
              <Box>
                <Typography variant='h3'>keyboard-trainer.dev</Typography>
              </Box>
            </Box>
          </Link>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 15
            }}
          >
            <SwitchTheme
              onClick={toggleTheme}
              sx={{ maxWidth: 35, maxHeight: 35 }}
            />
            <ProfileAvatarButton />
            <AuthenticationButton />
            <Link to='/about'>
              <IconButton sx={{ maxWidth: 35, maxHeight: 35 }}>
                <About />
              </IconButton>
            </Link>
          </Box>
        </Box>
      </Container>
    </nav>
  )
}
