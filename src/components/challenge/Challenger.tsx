import ChallengerInput from './ChallengerInput'
import ChallengerRealtimeStatistics from './ChallengerRealtimeStatistics'

import { Box } from '@/components/shared'

type ChallengerProps = {
  language: string
  code: string
}

export default function Challenger({ language, code }: ChallengerProps) {
  const codeTrimmed = code.trim()

  return (
    <Box>
      <ChallengerRealtimeStatistics />
      <ChallengerInput
        code={codeTrimmed}
        language={language}
      />
    </Box>
  )
}
