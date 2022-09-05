import { useState } from 'react'

import useAuthUser from '@/hooks/useAuthUser'

import Typography from '../Typography'

export default function UserAvatar() {
  const { user } = useAuthUser()
  const [error, setError] = useState(false)

  if (user?.displayName && (!user.photoURL || error)) {
    return (
      <Typography
        sx={{
          fontSize: 20,
          display: 'inline-block',
          verticalAlign: 'middle',
          textAlign: 'center',
          lineHeight: '50%'
        }}
      >
        {user.displayName.charAt(0)}
      </Typography>
    )
  }

  if (user?.photoURL) {
    return (
      <img
        alt=''
        loading='lazy'
        src={user.photoURL}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '100%' }}
        onError={() => {
          setError(true)
        }}
      />
    )
  }

  return null
}
