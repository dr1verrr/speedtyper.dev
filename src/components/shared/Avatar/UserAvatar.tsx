import useAuthUser from '@/hooks/useAuthUser'

export default function UserAvatar() {
  const { user } = useAuthUser()

  if (user && user.displayName && user.photoURL) {
    return (
      <img
        placeholder={user.displayName}
        src={user.photoURL}
        alt=''
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '100%' }}
        loading='lazy'
      />
    )
  }

  return null
}
