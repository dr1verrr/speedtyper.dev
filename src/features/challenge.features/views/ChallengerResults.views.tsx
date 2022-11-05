import { useParams } from 'react-router-dom'

import { getSession } from '@/api/firestore/challenge'
import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Box, Typography } from '@/components/shared'
import Fetch from '@/features/Fetch'

import ChallengerChart from '../components/shared/metrics/ChallengerChart'
import { TChallengerResults } from '../types'

export default function ChallengerResults({ stats }: { stats?: TChallengerResults }) {
  const params = useParams() as any

  if (params.id) {
    return (
      <Fetch
        fetch={getSession}
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
