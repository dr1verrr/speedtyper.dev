import { useEvent, useStore } from 'effector-react'

import { nextChallenge } from '@/store/challenges/events'

import {
  challengerChanged,
  challengerReset,
  challengerStatisticUpdate,
  challengerStatsProgressUpdate,
  challengerStatsReset,
  challengerWorkStatisticsChanged,
  statusToggled
} from '../events'
import { getHighlighted } from '../helpers'
import { $challenger, ChallengerStore } from '../store'

const useChallenger = () => {
  const { finished, started, paused, highlighted, id } = useStore($challenger)
  const updateChallenger = useEvent(challengerChanged)
  const toggleStatus = useEvent(statusToggled)
  const setNextChallenge = useEvent(nextChallenge)

  const setStatistics = useEvent(challengerWorkStatisticsChanged)
  const resetChallenger = useEvent(challengerReset)
  const resetStats = useEvent(challengerStatsReset)
  const updateProgress = useEvent(challengerStatsProgressUpdate)

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
        actions.status.set({ finished: false, paused: false, started: false })
      },
      set: (payload: Partial<ChallengerStore>) => updateChallenger(payload),
      cancel: () => {
        actions.reset()
      }
    },
    statistics: {
      update: (trueTyped: boolean) => {
        challengerStatisticUpdate(trueTyped)
      },
      reset: () => {
        resetStats()
      },
      updateProgress
    },
    reset: () => {
      actions.status.set({ finished: false, paused: false, started: false })
      actions.statistics.reset()
    },
    nextChallenge: () => {
      setNextChallenge()
    },
    onUnmount: () => {
      resetChallenger()
      actions.statistics.reset()
    },
    challenger: {
      start: () => {
        if (highlighted) {
          actions.status.set({
            finished: false,
            paused: false,
            started: true
          })

          setStatistics({
            code: { left: highlighted.total, total: highlighted.total },
            timeStarted: new Date()
          })
        }
      },
      tokenize: (code: string, language: string) => {
        const tokenized = getHighlighted(code, language)
        actions.status.set({ highlighted: tokenized })
      }
    }
  }

  return {
    challenger: {
      finished,
      started,
      paused,
      highlighted,
      id
    },
    actions
  }
}

export default useChallenger
