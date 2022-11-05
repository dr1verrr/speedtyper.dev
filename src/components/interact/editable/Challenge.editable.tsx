import { doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Challenge } from '@/api/firestore/challenge'
import { getUser } from '@/app/actions'
import { db } from '@/app/config/firebase'
import Play from '@/components/icons/Play'
import { Button, Container, Stack, TextField, Typography } from '@/components/shared'
import requestWithLoading from '@/handlers/requestWithLoading'

const toastId = 'update-info'

type ChallengeEditableProps = {
  data: Challenge
}

export default function ChallengeEditable({ data }: ChallengeEditableProps) {
  const [challenge, setChallenge] = useState<Challenge>(data)
  const [input, setInput] = useState({ code: data.code })

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    if (challenge?.id && input.code) {
      requestWithLoading(async () => {
        const user = await getUser()
        if (user?.uid) {
          const washingtonRef = doc(db, 'users', user?.uid, 'challenges', challenge.id)
          updateDoc(washingtonRef, {
            code: input.code
          })
        }
      }).then(() => {
        toast('Info were updated!', { autoClose: 2000, toastId, updateId: toastId })
        setChallenge({ ...challenge, code: input.code })
      })
    }
  }

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
