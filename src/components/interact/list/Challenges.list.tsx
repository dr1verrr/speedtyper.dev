import { useState } from 'react'
import { Link } from 'react-router-dom'
import Timestamp from 'react-timestamp'
import { toast } from 'react-toastify'

import {
  Challenge,
  removeChallenge,
  removeChallenges,
  removeSessions
} from '@/api/firestore/challenge'
import ChallengeInfoButtons from '@/components/buttons/ChallengeInfoButtons'
import { Box, Button, Container, Stack, TextField, Typography } from '@/components/shared'
import requestWithToastify from '@/handlers/requestWithToastify'

type ChallengesListProps = {
  data: Challenge[]
}

const toastId = 'deleted'

export default function ChallengesList({ data }: ChallengesListProps) {
  const [listData, setListData] = useState(data)

  const actions = {
    remove: (id: string) => {
      toast
        .promise(
          () => removeChallenge(id),
          {
            error: 'Something went wrong',
            pending: 'Deleting data with its sessions...',
            success: 'Deleted successfully.'
          },
          { autoClose: 2000, updateId: toastId }
        )
        .then(() => {
          setListData(chs => chs.filter(c => c.id !== id))
        })
    },
    removeAll: async () => {
      await requestWithToastify(
        async () => {
          await removeChallenges()
          await removeSessions()
        },
        {
          showProgress: true,
          messages: {
            pending: 'Deleting...',
            success: 'Successfully deleted.'
          }
        }
      )
      setListData([])
    }
  }

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
          <Button onClick={actions.removeAll}>✖️ Delete all</Button>
        </Stack>
        {listData.map((ch, idx) => (
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
              <Button onClick={() => actions.remove(ch.id)}>✖</Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Container>
  )
}
