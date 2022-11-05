/* eslint-disable react-hooks/rules-of-hooks */
import { useStore } from 'effector-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Button, Container, Stack, Typography } from '@/components/shared'
import PlayChallenge from '@/features/challenge.features'
import Fetch from '@/features/Fetch'
import { FetchErrorProps, FetchRefetch } from '@/features/Fetch/types'
import requestWithLoading from '@/handlers/requestWithLoading'
import { fetchChallengesFx } from '@/store/challenges/effects'
import $challenges, { Challenge } from '@/store/challenges/store'

type TSuccessProps = {
  challenges: Challenge[] | undefined
  refetch: FetchRefetch
}

const Status = () => {}

Status.Success = ({ challenges, refetch }: TSuccessProps) => {
  const { current: challenge } = useStore($challenges)

  if (challenge) {
    return (
      <PlayChallenge
        multiple
        showNextButton
        challengeData={challenge}
      />
    )
  }
  return null
}

Status.Fail = ({ error, refetch }: FetchErrorProps) => {
  const navigate = useNavigate()
  const [isTrySamples, setIsTrySamples] = useState(false)
  const { current: challenge } = useStore($challenges)

  if (isTrySamples && challenge) {
    return (
      <PlayChallenge
        multiple
        showNextButton
        challengeData={challenge}
      />
    )
  }

  return (
    <Container
      sx={{ height: '100%', display: 'flex', alignItems: 'center', fontSize: '2em' }}
    >
      <Stack
        direction='column'
        spacing={30}
      >
        <Stack
          direction='column'
          spacing={15}
        >
          <Typography>Something went wrong. </Typography>
          <Typography>May be you are not authorized. </Typography>
          <Typography>Do you want to try some samples ?</Typography>
        </Stack>
        <Stack spacing={10}>
          <Button
            variant='primary'
            onClick={() => {
              setIsTrySamples(true)
            }}
          >
            Definitely, <span style={{ fontWeight: 700 }}>yes</span>
          </Button>
          <Button
            variant='default'
            onClick={() => {
              navigate(-1)
            }}
          >
            Go back
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default function PlayChallenges() {
  const actions = {
    getChallenges: () => {
      return requestWithLoading(fetchChallengesFx)
    }
  }

  return (
    <Fetch
      fetch={actions.getChallenges}
      loadingElement={FullscreenLoader}
      renderError={(error, refetch) => (
        <Status.Fail
          error={error}
          refetch={refetch}
        />
      )}
      renderSuccess={(challenges, refetch) => (
        <Status.Success
          challenges={challenges}
          refetch={refetch}
        />
      )}
    />
  )
}
