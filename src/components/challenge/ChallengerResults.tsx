import { useParams } from 'react-router-dom'

import { getSession } from '@/api/firestore/challenge'
import Fetch from '@/features/Fetch'

import FullscreenLoader from '../loaders/FullscreenLoader'
import ChallengerChart from './ChallengerChart'
import { TChallengerResults } from './types.d'

export default function ChallengerResults({ stats }: { stats?: TChallengerResults }) {
  const params = useParams() as any

  if (params.id) {
    return (
      <Fetch
        fetch={getSession}
        loadingElement={FullscreenLoader}
        renderSuccess={response => {
          const stats = response?.results
          if (stats) {
            return <ChallengerChart statistics={stats} />
          }
          return null
        }}
      />
    )
  }

  if (stats) {
    return <ChallengerChart statistics={stats} />
  }

  return null
}
