import UserDashboard from '@/components/User/UserDashboard'
import Container from '@/components/shared/Container'
import useAuthUser from '@/hooks/useAuthUser'

export default function Profile() {
  const { user } = useAuthUser()

  return (
    <Container maxWidth='md'>
      <Container maxWidth='sm'>{user && <UserDashboard user={user} />}</Container>
    </Container>
  )
}
