import deleteUser from '@/app/actions/actions_delete_user'
import { signout } from '@/app/auth'
import { Button, Typography } from '@/components/shared'
import UserAvatar from '@/components/shared/Avatar'
import Container from '@/components/shared/Container'
import IconButton from '@/components/shared/IconButton'
import Stack from '@/components/shared/Stack/Stack'
import fetchWithToastify from '@/handlers/fetchWithToastify'
import useAuthUser from '@/hooks/useAuthUser'
import { reload } from 'firebase/auth'

export default function Profile() {
  const { user } = useAuthUser()
  console.log(user)

  if (user) {
    return (
      <Container maxWidth='md'>
        <Container maxWidth='sm'>
          <Stack
            direction='column'
            spacing={20}
            sx={{ marginTop: 20, marginBottom: 20 }}
          >
            <Stack
              spacing={15}
              sx={{ alignItems: 'center' }}
            >
              {user?.photoURL && (
                <a
                  href={user.photoURL}
                  target='_blank'
                  rel='noreferrer'
                >
                  <IconButton size='large'>
                    <UserAvatar />
                  </IconButton>
                </a>
              )}
              {user?.displayName && (
                <Stack direction='column'>
                  <Typography variant='h2'>{user.displayName}</Typography>
                  <Typography>
                    <Stack direction='column'>
                      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                        Last signed in time:
                      </Typography>
                      <Typography>{user.metadata.lastSignInTime}</Typography>
                    </Stack>
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Stack
              spacing={5}
              sx={{ alignItems: 'center' }}
            >
              <Typography sx={{ fontSize: 18 }}>User ID: </Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{user.uid}</Typography>
            </Stack>
            <Stack
              direction='row'
              spacing={15}
            >
              <Button
                onClick={() =>
                  fetchWithToastify(signout, {
                    pending: 'Signing out...',
                    success: 'Signed out.'
                  })
                }
              >
                Logout
              </Button>
              <Button
                onClick={() =>
                  fetchWithToastify(deleteUser, {
                    pending: 'Deleting account...',
                    success: 'Account was deleted.'
                  })
                }
              >
                Delete account
              </Button>
              <Button
                onClick={() =>
                  fetchWithToastify(() => reload(user), {
                    success: 'Refreshed data.'
                  })
                }
              >
                Refresh
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Container>
    )
  }

  return null
}
