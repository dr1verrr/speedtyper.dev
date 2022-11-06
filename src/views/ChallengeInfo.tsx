import { useParams } from 'react-router-dom'

import { getChallenge } from '@/api/firestore/challenge'
import ChallengeEditable from '@/components/interact/editable/Challenge.editable'
import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Box } from '@/components/shared'
import Fetch from '@/features/Fetch'

export default function ChallengeInfo() {
  const params = useParams() as any

  if (params.id) {
    return (
      <Fetch
        fetch={() => getChallenge({ challengeId: params.id })}
        loadingElement={FullscreenLoader}
        renderSuccess={challenge => {
          if (challenge) {
            return <ChallengeEditable data={challenge} />
          }
          return <Box>May be this challenge does not exist.</Box>
        }}
      />
    )
  }

  return null
}
