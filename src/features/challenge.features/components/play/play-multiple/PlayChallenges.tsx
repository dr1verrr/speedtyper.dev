/* eslint-disable react-hooks/rules-of-hooks */
import { useStore } from 'effector-react'

import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Box } from '@/components/shared'
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
        showNextButton
        challengeData={challenge}
      />
    )
  }
  return null
}

Status.Fail = ({ error, refetch }: FetchErrorProps) => {
  return <Box>Something went wrong.</Box>
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
