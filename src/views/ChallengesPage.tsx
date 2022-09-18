import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Timestamp from 'react-timestamp'
import { toast } from 'react-toastify'

import {
  Challenge,
  getChallenges,
  removeChallenge,
  removeChallenges,
  removeSessions
} from '@/api/firestore/challenge'
import ChallengeInfoButtons from '@/components/buttons/ChallengeInfoButtons'
import SpinnerWave from '@/components/loaders/SpinnerWave'
import { Box, Button, Container, Stack, TextField, Typography } from '@/components/shared'
import requestWithLoading from '@/handlers/requestWithLoading'
import requestWithToastify from '@/handlers/requestWithToastify'

const toastId = 'deleted'

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    requestWithLoading(getChallenges)
      .then(ch => setChallenges(ch || []))
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          paddingTop: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SpinnerWave />
      </Box>
    )
  }

  if (!loading) {
    if (challenges && challenges.length) {
      return (
        <Container sx={{ maxWidth: 540 }}>
          <Stack
            direction='column'
            spacing={15}
            sx={{ padding: 10, paddingTop: 30 }}
          >
            <Stack spacing={10}>
              <Link
                style={{ flex: 1 }}
                to='/get-started'
              >
                <Button sx={{ width: '100%' }}>Create</Button>
              </Link>
              <Button
                onClick={() => {
                  requestWithToastify(
                    () => {
                      removeChallenges()
                      removeSessions()
                    },
                    {
                      showProgress: true,
                      messages: {
                        pending: 'Deleting...',
                        success: 'Successfully deleted.'
                      }
                    }
                  ).then(() => {
                    setChallenges(undefined)
                  })
                }}
              >
                ✖️ Delete all
              </Button>
            </Stack>
            {challenges?.map((ch, idx) => (
              <Stack
                key={idx}
                direction='column'
                spacing={10}
                sx={{
                  padding: 30,
                  borderRadius: 15
                }}
              >
                <Stack
                  spacing={5}
                  sx={{ alignItems: 'center', fontWeight: 600, flexWrap: 'wrap' }}
                >
                  <Typography highlighted>Created: </Typography>
                  <Box>
                    <Timestamp
                      relative
                      date={new Date()}
                      relativeTo={ch.created}
                    />
                    {' ago'}
                    {' - '}
                    {ch.created.toLocaleString()}
                  </Box>
                </Stack>
                <Stack
                  spacing={5}
                  sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                >
                  <Typography highlighted>Language: </Typography>
                  <Typography>{ch.language}</Typography>
                </Stack>
                <TextField
                  defaultValue={ch.code}
                  sx={{ cursor: 'default' }}
                />
                <Stack
                  spacing={10}
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Stack
                    spacing={5}
                    sx={{ flex: 1 }}
                  >
                    <ChallengeInfoButtons challengeId={ch.id} />
                  </Stack>
                  <Button
                    onClick={() => {
                      toast
                        .promise(
                          () => removeChallenge(ch.id),
                          {
                            error: 'Something went wrong',
                            pending: 'Deleting data with its sessions...',
                            success: 'Deleted successfully.'
                          },
                          { autoClose: 2000, updateId: toastId }
                        )
                        .then(() => {
                          setChallenges(chs => chs?.filter(c => c.id !== ch.id))
                        })
                    }}
                  >
                    ✖
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Container>
      )
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
  }

  return null
}
