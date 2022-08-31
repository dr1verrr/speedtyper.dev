import { useEvent, useStore } from 'effector-react'

import {
  challengerChanged,
  statusToggled,
  nextToken,
  nextSubToken,
  challengerInited,
  challengerStatisticsFilled,
  challengerStatisticUpdate,
  challengerWorkStatisticsChanged,
  challengerReset
} from './events'
import { $challenger, ChallengerStore, CurrentToken, defaultStore } from './store'

const useChallenger = () => {
  const { currentToken, finished, started, paused, tokens } = useStore($challenger)
  const initChallenger = useEvent(challengerInited)
  const updateChallenger = useEvent(challengerChanged)
  const toggleStatus = useEvent(statusToggled)

  const setNextToken = useEvent(nextToken)
  const setNextSubToken = useEvent(nextSubToken)

  const fillStatistics = useEvent(challengerStatisticsFilled)
  const setStatistics = useEvent(challengerWorkStatisticsChanged)
  const resetChallenger = useEvent(challengerReset)

  const actions = {
    status: {
      paused: {
        toggle: () => toggleStatus('paused')
      },
      started: {
        toggle: () => toggleStatus('started')
      },
      updateHighlights: (prevToken: CurrentToken) => {
        if (tokens) {
          const getPrevElement = () => {
            if (prevToken.subTokens && prevToken.subTokens.length) {
              return prevToken.subTokens[0].element
            } else {
              return prevToken.element
            }
          }
          const getNextElement = () => {
            if (prevToken.subTokens && prevToken.subTokens.length > 1) {
              return prevToken.subTokens[1].element
            } else {
              const nextToken = tokens[prevToken.id + 1]
              if (nextToken) {
                prevToken.element.replaceChildren(prevToken.fullWord)
                if (nextToken.subTokens.length >= 1) {
                  return nextToken.subTokens[0].element
                } else {
                  return nextToken.element
                }
              }
            }
          }

          const prev = getPrevElement()
          const next = getNextElement()

          prev.className = prev.className.replace('current', '')

          if (next) {
            next.className += ' current'
          }
        }
      },
      currentToken: {
        next: () => setNextToken(),
        nextSubToken: () => setNextSubToken()
      },
      reset: () => {
        actions.status.set(defaultStore.$challenger)
      },
      init: (payload: Partial<ChallengerStore>) => {
        initChallenger(payload)
        fillStatistics(payload)
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
      currentToken,
      finished,
      started,
      paused,
      tokens
    },
    actions
  }
}

export default useChallenger
