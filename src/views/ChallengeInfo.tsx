import { doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Challenge, getChallenge } from '@/api/firestore/challenge'
import { getUser } from '@/app/actions'
import { db } from '@/app/config/firebase'
import Play from '@/components/icons/Play'
import SpinnerWave from '@/components/loaders/SpinnerWave'
import { Box, Button, Container, Stack, TextField, Typography } from '@/components/shared'
import requestWithLoading from '@/handlers/requestWithLoading'

const toastId = 'update-info'

export default function ChallengeInfo() {
  const [challenge, setChallenge] = useState<Challenge>()
  const [isLoading, setLoading] = useState(true)
  const [input, setInput] = useState({ code: '' })
  const params = useParams() as any

  useEffect(() => {
    if (params.id) {
      getChallenge({ challengeId: params.id })
        .then(ch => {
          if (ch) {
            setChallenge(ch)
            setInput({ code: ch.code })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [params])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    if (challenge?.id && input.code) {
      requestWithLoading(() =>
        getUser().then(user => {
          if (user?.uid) {
            const washingtonRef = doc(db, 'users', user?.uid, 'challenges', challenge.id)
            updateDoc(washingtonRef, {
              code: input.code
            })
          }
        })
      ).then(() => {
        toast('Info were updated!', { autoClose: 2000, toastId, updateId: toastId })
        setChallenge({ ...challenge, code: input.code })
      })
    }
  }

  if (isLoading) {
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

  if (challenge) {
    return (
      <Container maxWidth='sm'>
        <form onSubmit={onSubmit}>
          <Stack
            direction='column'
            spacing={15}
            sx={{ padding: '30px 15px 50px' }}
          >
            <Stack
              spacing={5}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Typography highlighted>Language:</Typography>
              {challenge.language}
            </Stack>
            <Stack
              spacing={5}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Typography highlighted>Created: </Typography>
              {challenge.created.toLocaleString()}
            </Stack>
            <Link
              style={{ maxWidth: 'fit-content' }}
              to={`/challenge/${challenge.id}`}
            >
              <Button>
                <Play />
              </Button>
            </Link>
            <TextField
              multiline
              name='text'
              spellCheck={false}
              sx={{ resize: 'none', padding: '20px 50px 50px 20px' }}
              value={input.code}
              onChange={e => {
                setInput({ code: e.currentTarget.value })
              }}
            />
            {input.code !== challenge.code && (
              <Button
                type='submit'
                variant='primary'
              >
                Submit changes
              </Button>
            )}
          </Stack>
        </form>
      </Container>
    )
  }

  return null
}
