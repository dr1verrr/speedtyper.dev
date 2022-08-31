import { User } from 'firebase/auth'

import { Typography, Button } from '../shared'
import UserAvatar from '../shared/Avatar'
import IconButton from '../shared/IconButton'
import Stack from '../shared/Stack/Stack'

import deleteUser from '@/app/actions/actions_delete_user'
import { signout } from '@/app/auth'
import fetchWithToastify from '@/handlers/fetchWithToastify'

type UserDashboardProps = {
  user: User
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const { photoURL, displayName, metadata, uid } = user

  return (
    <Stack
      direction='column'
      spacing={20}
      sx={{ paddingTop: 20, paddingBottom: 20 }}
    >
      <Stack
        spacing={15}
        sx={{ alignItems: 'center' }}
      >
        <a
          href={photoURL || undefined}
          rel='noreferrer'
          target='_blank'
        >
          <IconButton size='large'>
            <UserAvatar />
          </IconButton>
        </a>
        {displayName && (
          <Stack direction='column'>
            <Typography variant='h2'>{displayName}</Typography>
            {metadata.lastSignInTime && (
              <Typography>
                <Stack direction='column'>
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    Last signed in time:
                  </Typography>
                  <Typography>{metadata.lastSignInTime}</Typography>
                </Stack>
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
      <Stack
        spacing={5}
        sx={{ alignItems: 'center' }}
      >
        <Typography sx={{ fontSize: 18 }}>User ID: </Typography>
        <Typography sx={{ fontWeight: 'bold' }}>{uid}</Typography>
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
      </Stack>
    </Stack>
  )
}
