import { useEvent, useStore } from 'effector-react'

import {
  challengerChanged,
  challengerReset,
  challengerStatisticUpdate,
  challengerWorkStatisticsChanged,
  statusToggled
} from '../events'
import { $challenger, ChallengerStore, defaultStore } from '../store'

const useChallenger = () => {
  const { finished, started, paused } = useStore($challenger)
  const updateChallenger = useEvent(challengerChanged)
  const toggleStatus = useEvent(statusToggled)

  const setStatistics = useEvent(challengerWorkStatisticsChanged)
  const resetChallenger = useEvent(challengerReset)

  const actions = {
    status: {
      togglePause: () => {
        actions.status.paused.toggle()
      },
      paused: {
        toggle: () => toggleStatus('paused')
      },
      started: {
        toggle: () => toggleStatus('started')
      },
      reset: () => {
        actions.status.set(defaultStore.$challenger)
      },
      set: (payload: Partial<ChallengerStore>) => updateChallenger(payload)
    },
    statistics: {
      update: (trueTyped: boolean) => {
        challengerStatisticUpdate(trueTyped)
      },
      reset: () => {
        setStatistics(defaultStore.$challengerStatistics)
      }
    },
    reset: resetChallenger
  }

  return {
    challenger: {
      finished,
      started,
      paused
    },
    actions
  }
}

export default useChallenger
