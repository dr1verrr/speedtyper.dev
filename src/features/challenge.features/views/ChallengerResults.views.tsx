import ChallengerChart from '../components/shared/metrics/ChallengerChart'
import { TChallengerResults } from '../types'

export default function ChallengerResults({ stats }: { stats: TChallengerResults }) {
  return <ChallengerChart statistics={stats} />
}
