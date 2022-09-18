import { useStore } from 'effector-react'
import { useEffect, useState } from 'react'

import requestWithLoading from '@/handlers/requestWithLoading'
import { fetchChallengesFx } from '@/store/challenges/effects'
import $challenges from '@/store/challenges/store'

import SpinnerWave from '../loaders/SpinnerWave'
import { Box } from '../shared'
import ChallengerWrapper from '.'

export default function Play() {
  const { current: challenge } = useStore($challenges)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    requestWithLoading(fetchChallengesFx).finally(() => {
      setLoading(false)
    })
  }, [])

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

  if (!isLoading && challenge) {
    return (
      <ChallengerWrapper
        showNextButton
        challengeData={challenge}
      />
    )
  }

  return null
}
