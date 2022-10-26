import 'chartjs-adapter-moment'

import { useParams } from 'react-router-dom'

import { getSession } from '@/api/firestore/challenge'
import Fetch from '@/features/Fetch'

import SpinnerWave from '../loaders/SpinnerWave'
import { Container } from '../shared'
import ChallengerChart from './ChallengerChart'
import { TChallengerResults } from './types.d'

const Loader = (
  <Container
    sx={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <SpinnerWave />
  </Container>
)

export default function ChallengerResults({ stats }: { stats?: TChallengerResults }) {
  const params = useParams() as any

  if (params.id) {
    return (
      <Fetch
        fetch={getSession}
        loadingElement={Loader}
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
