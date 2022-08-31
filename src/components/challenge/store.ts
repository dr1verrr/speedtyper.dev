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
  challengerWorkStatisticsChanged,
  challengerReset
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
  errors: CurrentToken[]
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
  maxWpm: BaseChallengerStatistics['wpm']
  maxCombo: BaseChallengerStatistics['combo']
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
  errors: [],
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
    timeline: [],
    maxWpm: 0,
    maxCombo: 0
  },
  $challengerWorkStatistics: baseChallengerStatistics
}

export { baseChallengerStatistics, defaultStore }

const $challenger = createStore<ChallengerStore>(defaultStore.$challenger)

$challenger
  .reset(challengerReset)
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

$challengerStatistics.reset(challengerReset)

$challengerWorkStatistics
  .reset(challengerReset)
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
        const { currentToken } = $challenger.getState()
        const errors = [...state.errors]
        const existedErrorIndex = state.errors.findIndex(e => e.id === currentToken?.id)
        if (currentToken && existedErrorIndex === -1) {
          errors.push(currentToken)
        }
        return {
          ...state,
          errors,
          combo: 0,
          code: { ...state.code, left }
        }
      }

      return {
        ...state,
        code: { ...state.code, left },
        combo: state.combo + 1,
        keyboard: {
          pressed: state.keyboard.pressed + 1
        }
      }
    }
  })
  .on(challengerWorkStatisticsChanged, (state, payload) => {
    return { ...state, ...payload }
  })
  .reset(challengerReset)
  .watch(state => {
    console.log('work statistics changed', state)
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
      const timeinMinutes = state.time / 1000 / 60
      const pressed = state.keyboard.pressed
      if (state.time < 1000) {
        return pressed / 5 / (1 / 60)
      }

      return pressed / 5 / timeinMinutes
    }

    const getBestStats = (wpm: number) => {
      const challengerStats = $challengerStatistics.getState()
      let maxCombo = challengerStats.maxCombo
      let maxWpm = challengerStats.maxWpm
      if (challengerStats.maxCombo < state.combo) {
        maxCombo = state.combo
      }
      if (challengerStats.maxWpm < wpm) {
        maxWpm = wpm
      }
      return { maxCombo, maxWpm }
    }

    const progress = getProgress()
    const wpm = getWpm()
    const bestStats = getBestStats(wpm)
    const { maxWpm, maxCombo } = bestStats

    const timeline = $challengerStatistics.getState().timeline
    const updatedStats = { ...state, wpm, progress, maxCombo, maxWpm }
    const timelineExistedIndex = timeline.findIndex(t => t.time === state.time)

    const getUpdatedTimeline = () => {
      const updatedTimeline = [...timeline]
      if (timelineExistedIndex !== -1) {
        const existedTimelineItem = updatedTimeline[timelineExistedIndex]
        updatedTimeline[timelineExistedIndex] = {
          ...existedTimelineItem,
          ...updatedStats
        }
      } else {
        updatedTimeline.push({ ...updatedStats, second: updatedStats.time / 1000 })
      }
      return updatedTimeline
    }

    const updatedTimeline = getUpdatedTimeline()

    return { ...updatedStats, timeline: updatedTimeline }
  },
  target: $challengerStatistics
})

export { $challenger, $challengerWorkStatistics, $challengerStatistics }
