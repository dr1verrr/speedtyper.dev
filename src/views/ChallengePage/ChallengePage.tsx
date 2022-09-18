import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { getChallenge } from '@/api/firestore/challenge'
import ChallengerWrapper from '@/components/challenge'
import SpinnerWave from '@/components/loaders/SpinnerWave'
import Box from '@/components/shared/Box'

interface ChallengeData {
  language: string
  code: string
  id: string
}

export default function ChallengePage() {
  const location = useLocation() as any
  const params = useParams() as any
  const [challengeData, setChallengeData] = useState<ChallengeData>()

  useEffect(() => {
    if (location.state && location.state.code && location.state.language) {
      setChallengeData({
        code: location.state.code as string,
        id: location.state.id || ('' as string),
        language: location.state.language as string
      })
    } else if (params.id) {
      getChallenge({ challengeId: params.id }).then(c => {
        if (c) {
          setChallengeData({ code: c.code, id: c.id, language: c.language })
        }
      })
    }
  }, [location, params])

  if (challengeData) {
    return <ChallengerWrapper challengeData={challengeData} />
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        translate: '-50% 0'
      }}
    >
      <SpinnerWave size={150} />
    </Box>
  )
}
