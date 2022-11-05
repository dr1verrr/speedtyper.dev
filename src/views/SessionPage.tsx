import { useParams } from 'react-router-dom'

import { getSession } from '@/api/firestore/challenge'
import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Box, Typography } from '@/components/shared'
import { ChallengerChart } from '@/features/challenge.features/components/shared'
import { TChallengerResults } from '@/features/challenge.features/types'
import Fetch from '@/features/Fetch'

export default function SessionPage({ stats }: { stats?: TChallengerResults }) {
  const params = useParams() as any

  if (params.id) {
    return (
      <Fetch
        fetch={() => getSession(params.id)}
        loadingElement={FullscreenLoader}
        renderError={() => {
          return (
            <Box>
              <Typography>Something went wrong...</Typography>
            </Box>
          )
        }}
        renderSuccess={response => {
          const stats = response?.results
          if (stats) {
            return <ChallengerChart statistics={stats} />
          }
        }}
      />
    )
  }

  if (stats) {
    return <ChallengerChart statistics={stats} />
  }

  return null
}
