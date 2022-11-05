import { Link } from 'react-router-dom'

import { getChallenges } from '@/api/firestore/challenge'
import ChallengesList from '@/components/interact/list/Challenges.list'
import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Box, Button, Container, Stack, Typography } from '@/components/shared'
import Fetch from '@/features/Fetch'
import requestWithLoading from '@/handlers/requestWithLoading'

export default function ChallengesPage() {
  return (
    <Fetch
      fetch={() => requestWithLoading(getChallenges)}
      loadingElement={FullscreenLoader}
      renderError={() => {
        return <Box>Something went wrong...</Box>
      }}
      renderSuccess={challenges => {
        if (challenges && challenges.length) {
          return <ChallengesList data={challenges} />
        }
        return (
          <Container
            maxWidth='sm'
            sx={{ textAlign: 'center' }}
          >
            <Stack
              direction='column'
              spacing={25}
              sx={{ padding: 30, alignItems: 'center', justifyContent: 'center' }}
            >
              <Typography sx={{ fontSize: 42, display: 'block' }}>
                No data existed.
              </Typography>
              <Link to='/get-started'>
                <Button>Create your first one challenge</Button>
              </Link>
            </Stack>
          </Container>
        )
      }}
    />
  )
}
