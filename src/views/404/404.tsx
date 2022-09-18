import { useNavigate } from 'react-router-dom'

import { Button, Container, Stack, Typography } from '@/components/shared'
import { useTheme } from '@/services/theme/actions'

export default function NotFound() {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Container>
      <Stack
        direction='column'
        spacing={30}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '75vh',
          fontSize: 100
        }}
      >
        <Stack
          spacing={20}
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <Typography
            sx={{
              background: theme.common.text,
              color: theme.common.bg,
              padding: '10px 20px',
              fontWeight: 700
            }}
          >
            404
          </Typography>
          <Stack
            spacing={15}
            sx={{ flexWrap: 'wrap', justifyContent: 'center', fontSize: 60 }}
          >
            <Typography>Page</Typography>
            <Typography>not</Typography>
            <Typography>found</Typography>
          </Stack>
        </Stack>
        <Button
          sx={{ padding: '12px 30px', fontSize: 20 }}
          onClick={() => navigate(-1)}
        >
          Go back
        </Button>
      </Stack>
    </Container>
  )
}
