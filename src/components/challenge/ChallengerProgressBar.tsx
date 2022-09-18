import { useStore } from 'effector-react'

import ProgressBar, { ProgressBarProps } from '../progress/ProgressBar'
import { $challengerStatistics } from './store'

export default function ChallengerProgressBar(props: Omit<ProgressBarProps, 'value'>) {
  const { progress } = useStore($challengerStatistics)

  return (
    <ProgressBar
      {...props}
      value={progress}
    />
  )
}
