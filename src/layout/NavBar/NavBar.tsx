/* eslint-disable no-useless-concat */
import KeyboardLogo from '@/components/icons/KeyboardLogo'
import { Button, Typography } from '@/components/shared'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'
import RequireAuthentication from '@/hoc/RequireAuth'
import { useTheme } from '@/services/theme/actions'
import { Link } from 'react-router-dom'

export default function NavBar() {
  const SignIn = RequireAuthentication(Button, false)

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
          <Box>
            <Link to='/sign-in'>
              <SignIn>Sign in / Sign up</SignIn>
            </Link>
          </Box>
        </Box>
      </Container>
    </nav>
  )
}
