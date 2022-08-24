import SwitchTheme from '@/components/buttons/SwitchTheme'
import Spinner from '@/components/loaders/Spinner'
import { Typography } from '@/components/shared'
import Box from '@/components/shared/Box'
import Container from '@/components/shared/Container'
import { themeToggled } from '@/store/theme/events'
import { useEvent } from 'effector-react'

export default function Home() {
  const toggleTheme = useEvent(themeToggled)

  return (
    <div>
      <Container maxWidth='md'>
        <div>Home</div>
        <Box sx={{ position: 'fixed', bottom: 50, left: 50 }}>
          <Spinner size={50} />
        </Box>
        <Typography variant='h1'>Heading</Typography>
        <SwitchTheme onClick={toggleTheme} />
      </Container>
    </div>
  )
}
