import { User } from 'firebase/auth'

import deleteUser from '@/app/actions/actions_delete_user'
import { signout } from '@/app/auth'
import requestWithToastify from '@/handlers/requestWithToastify'

import { Button, Typography } from '../shared'
import UserAvatar from '../shared/Avatar'
import IconButton from '../shared/IconButton'
import Stack from '../shared/Stack/Stack'

type UserDashboardProps = {
  user: User
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const { photoURL, displayName, metadata, uid } = user

  return (
    <Stack
      direction='column'
      spacing={20}
    >
      <Stack
        spacing={15}
        sx={{ alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all' }}
      >
        <a
          href={photoURL || undefined}
          rel='noreferrer'
          target='_blank'
        >
          <IconButton size='large'>
            <UserAvatar size={35} />
          </IconButton>
        </a>
        {displayName && (
          <Stack direction='column'>
            <Typography
              sx={{ marginTop: 0, wordBreak: 'break-all' }}
              variant='h2'
            >
              {displayName}
            </Typography>
            {metadata.lastSignInTime && (
              <Typography>
                <Stack direction='column'>
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    Last signed in time:
                  </Typography>
                  <Typography sx={{ wordBreak: 'break-all' }}>
                    {metadata.lastSignInTime}
                  </Typography>
                </Stack>
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
      <Stack
        spacing={5}
        sx={{ alignItems: 'center', wordBreak: 'break-all' }}
      >
        <Typography sx={{ fontSize: 18 }}>User ID: </Typography>
        <Typography sx={{ fontWeight: 'bold' }}>{uid}</Typography>
      </Stack>
      <Stack
        direction='row'
        spacing={15}
      >
        <Button
          variant='default'
          onClick={() =>
            requestWithToastify(signout, {
              showProgress: true,
              messages: {
                pending: 'Signing out...',
                success: 'Signed out.'
              }
            })
          }
        >
          Logout
        </Button>
        <Button
          sx={{ borderColor: 'red' }}
          onClick={() =>
            requestWithToastify(deleteUser, {
              showProgress: true,
              messages: {
                pending: 'Deleting account...',
                success: 'Account was deleted.'
              }
            })
          }
        >
          ✖️ Delete account
        </Button>
      </Stack>
    </Stack>
  )
}
