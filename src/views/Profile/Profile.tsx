import { useEffect, useState } from 'react'
import Timestamp from 'react-timestamp'

import { getSessions, Session } from '@/api/firestore/challenge'
import ChallengeInfoButtons from '@/components/buttons/ChallengeInfoButtons'
import Preferences from '@/components/configurations/Preferences'
import SpinnerWave from '@/components/loaders/SpinnerWave'
import { Stack, Typography } from '@/components/shared'
import Container from '@/components/shared/Container'
import UserDashboard from '@/components/User/UserDashboard'
import useAuthUser from '@/hooks/useAuthUser'

export default function Profile() {
  const { user } = useAuthUser()
  const [sessions, setSessions] = useState<Session[]>()
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getSessions(4, { sort: true }).then(s => {
      setSessions(s)
      setLoading(false)
    })
  }, [])

  return (
    <Container
      maxWidth='md'
      sx={{ paddingBottom: 50 }}
    >
      <Stack
        direction='column'
        spacing={40}
        sx={{
          paddingTop: 20,
          paddingBottom: 40,
          alignItems: 'center'
        }}
      >
        <Stack direction='column'>
          <Container
            maxWidth='sm'
            sx={{ margin: 0 }}
          >
            {user && <UserDashboard user={user} />}
          </Container>
          <Container
            maxWidth='sm'
            sx={{ margin: 0, marginTop: 30 }}
          >
            {user && <Preferences />}
          </Container>
        </Stack>
        {user && isLoading && <SpinnerWave />}
        {sessions && (
          <Container
            maxWidth='sm'
            sx={{ margin: 0, width: '100%' }}
          >
            <Stack
              direction='column'
              spacing={15}
              sx={{ width: '100%' }}
            >
              {sessions.map(s => (
                <Stack
                  key={s.sessionId}
                  direction='column'
                  spacing={10}
                >
                  <Stack spacing={15}>
                    <Typography
                      highlighted
                      sx={{ padding: '3px 10px' }}
                    >
                      <Timestamp
                        autoUpdate
                        relative
                        date={s.results.timeStarted}
                        relativeTo={new Date()}
                      />
                      {' ago'}
                      {' - '}
                      <Timestamp date={s.results.timeEnded} />
                    </Typography>
                  </Stack>
                  <Stack
                    spacing={10}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    <ChallengeInfoButtons
                      challengeId={s.challengeId}
                      sessionId={s.sessionId}
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Container>
        )}
      </Stack>
    </Container>
  )
}
