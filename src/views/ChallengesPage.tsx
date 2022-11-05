import { getChallenges } from '@/api/firestore/challenge'
import ChallengesList from '@/components/interact/list/Challenges.list'
import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Box } from '@/components/shared'
import Fetch from '@/features/Fetch'
import requestWithLoading from '@/handlers/requestWithLoading'

export default function ChallengesPage() {
  return (
    <Fetch
      fetch={() => requestWithLoading(getChallenges)}
      loadingElement={FullscreenLoader}
      renderError={() => {
        return <Box>Something went wrong...</Box>
      }}
      renderSuccess={challenges => {
        return <ChallengesList data={challenges} />
      }}
    />
  )
}
