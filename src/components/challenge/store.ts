import { createStore, sample } from 'effector'

import {
  statusToggled,
  challengerCleared,
  challengerChanged,
  nextToken,
  nextSubToken,
  challengerInited,
  challengerStatisticsFilled,
  challengerStatisticUpdate,
  challengerStatisticsChanged
} from './events'
import { getTotal } from './helpers'

type SubToken = {
  element: Element
  id: number
}

type CurrentToken = {
  element: Element
  id: number
  subTokens: SubToken[]
  fullWord: string
}

type BaseChallengerStatistics = {
  code: null | {
    total: number
    left: number
  }
  wpm: number
  combo: number
  progress: number
  errors: number
  keyboard: {
    pressed: number
  }
  time: number
}

type ChallengerStore = {
  paused: boolean
  started: boolean
  tokens: CurrentToken[] | null
  currentToken: CurrentToken | null
  finished: boolean
}

type ChallengerStatisticsTimeline = BaseChallengerStatistics & {
  second: number
}

type ChallengerStatisticsStore = BaseChallengerStatistics & {
  timeline: ChallengerStatisticsTimeline[]
}

type ChallengerWorkStatisticsStore = BaseChallengerStatistics

export type {
  ChallengerStore,
  ChallengerWorkStatisticsStore,
  ChallengerStatisticsStore,
  CurrentToken,
  SubToken
}

const baseChallengerStatistics = {
  code: null,
  wpm: 0,
  combo: 0,
  time: 0,
  progress: 0,
  errors: 0,
  keyboard: {
    pressed: 0
  }
}

const defaultStore = {
  $challenger: {
    paused: false,
    started: false,
    tokens: null,
    currentToken: null,
    finished: false
  },
  $challengerStatistics: {
    ...baseChallengerStatistics,
    timeline: []
  },
  $challengerWorkStatistics: baseChallengerStatistics
}

const $challenger = createStore<ChallengerStore>(defaultStore.$challenger)

$challenger
  .on(challengerInited, (state, payload) => ({ ...state, ...payload }))
  .on(challengerCleared, () => defaultStore.$challenger)
  .on(challengerChanged, (state, payload) => ({ ...state, ...payload }))
  .on(statusToggled, (state, key) => {
    let status = { ...state } as any

    if (Array.isArray(key)) {
      status = { ...state }
      Object.keys(key).forEach(k => {
        status[k] = !status[k]
      })
    } else {
      status[key] = !status[key]
    }

    return { ...state, ...status }
  })
  .on(nextToken, state => {
    if (state.tokens) {
      if (state.tokens[state.tokens.length - 1].id === state.currentToken?.id) {
        return { ...defaultStore.$challenger, finished: true }
      }
      const next = state.tokens[state.currentToken?.id! + 1]
      return { ...state, currentToken: next }
    }
  })
  .on(nextSubToken, state => {
    if (state.tokens && state.currentToken) {
      const subTokens = state.currentToken.subTokens

      if (subTokens.length) {
        const currentSubToken = state.currentToken.subTokens[0]

        if (currentSubToken.id !== subTokens[subTokens.length - 1].id) {
          const getNotTypedYed = () => {
            const result = subTokens.filter(s => s.id !== currentSubToken.id)
            return result
          }

          return {
            ...state,
            currentToken: { ...state.currentToken, subTokens: getNotTypedYed() }
          }
        } else {
          const getNextToken = () => {
            if (state.currentToken) {
              const currentTokenId = state.currentToken?.id
              const next = state.tokens?.find(t => t.id === currentTokenId + 1)
              return next
            }
          }

          const nextToken = getNextToken()

          if (nextToken) {
            return { ...state, currentToken: nextToken }
          } else {
            return {
              ...state,
              finished: true
            }
          }
        }
      }
    }
  })

const $challengerWorkStatistics = createStore<ChallengerWorkStatisticsStore>(
  defaultStore.$challengerWorkStatistics
)

const $challengerStatistics = createStore<ChallengerStatisticsStore>(
  defaultStore.$challengerStatistics
)

$challengerWorkStatistics
  .on(challengerStatisticsFilled, (state, payload) => {
    if (payload.tokens) {
      const total = getTotal(payload.tokens)

      return { ...state, code: { left: total, total } }
    }
  })
  .on(challengerStatisticUpdate, (state, trueTyped) => {
    if (state.code) {
      const getLeft = (): number => {
        if (trueTyped) {
          return state.code?.left! - 1
        }
        return state.code?.left as number
      }

      const left = getLeft()

      if (!trueTyped) {
        return {
          ...state,
          errors: state.errors + 1,
          code: { ...state.code, left }
        }
      }

      return {
        ...state,
        code: { ...state.code, left },
        keyboard: {
          pressed: state.keyboard.pressed + 1
        }
      }
    }
  })
  .on(challengerStatisticsChanged, (state, payload) => {
    return { ...state, ...payload }
  })

sample({
  clock: $challengerWorkStatistics,
  source: { state: $challengerWorkStatistics },
  fn: ({ state }) => {
    const getProgress = () => {
      if (!state.code) {
        return 0
      }
      return 100 - (state.code?.left / state.code?.total) * 100
    }

    const getWpm = () => {
      if (state.time < 1000) {
        return 0
      }
      const timeinMinutes = state.time / 1000 / 60
      let pressed: number = state.keyboard.pressed

      return pressed / 5 / timeinMinutes
    }

    const progress = getProgress()
    const wpm = getWpm()

    const timeline = $challengerStatistics.getState().timeline

    const updatedStats = { ...state, wpm, progress }

    const updatedTimeline = [
      ...timeline,
      { ...updatedStats, second: updatedStats.time / 1000 }
    ]

    return { ...updatedStats, timeline: updatedTimeline }
  },
  target: $challengerStatistics
}).watch(state => {
  console.log('timeline', state.time / 1000, state.timeline)
})

export { $challenger, $challengerWorkStatistics, $challengerStatistics }
