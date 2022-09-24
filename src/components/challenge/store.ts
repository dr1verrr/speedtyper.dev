import { createStore, sample } from 'effector'

import {
  challengerChanged,
  challengerCleared,
  challengerReset,
  challengerResetAll,
  challengerStatisticsCleared,
  challengerStatisticUpdate as challengerWorkStatisticUpdate,
  challengerStatsProgressUpdate,
  challengerStatsReset,
  challengerWorkStatisticsChanged,
  statusToggled
} from './events'
import { Highlighted } from './helpers'

type BaseChallengerStatistics = {
  code: null | {
    total: number
    left: number
  }
  currentId: number
  wpm: number
  combo: number
  progress: number
  timeStarted: Date | null
  errors: number[]
  keyboard: {
    pressed: number
  }
  time: number
}

type ChallengerStore = {
  id: string
  paused: boolean
  started: boolean
  finished: boolean
  highlighted: Highlighted | null
}

type ChallengerStatistics = Omit<BaseChallengerStatistics, 'currentId' | 'keyboard'>
type ChallengerStatisticsTimeline = ChallengerStatistics

type ChallengerStatisticsStore = ChallengerStatistics & {
  timeline: ChallengerStatisticsTimeline[]
  maxCombo: BaseChallengerStatistics['combo']
}

type ChallengerWorkStatisticsStore = BaseChallengerStatistics

export type { ChallengerStore, ChallengerWorkStatisticsStore, ChallengerStatisticsStore }
export type { BaseChallengerStatistics }

const baseChallengerStatistics = {
  code: null,
  wpm: 0,
  combo: 0,
  time: 0,
  progress: 0,
  currentId: 0,
  timeStarted: null,
  errors: [],
  keyboard: {
    pressed: 0
  }
}

const { currentId, keyboard, ...challengerStats } = baseChallengerStatistics

const defaultStore = {
  $challenger: {
    id: '',
    paused: false,
    started: false,
    finished: false,
    highlighted: null
  },
  $challengerStatistics: {
    ...challengerStats,
    timeline: [],
    maxCombo: 0
  },
  $challengerWorkStatistics: baseChallengerStatistics
}

const getProgress = (code: BaseChallengerStatistics['code']) => {
  if (!code) {
    return 0
  }
  return 100 - (code?.left / code?.total) * 100
}

const getLeft = (code: BaseChallengerStatistics['code'], trueTyped: boolean): number => {
  if (trueTyped) {
    return code?.left! - 1
  }
  return code?.left as number
}

const $challenger = createStore<ChallengerStore>({ ...defaultStore.$challenger })

$challenger
  .reset(challengerReset)
  .reset(challengerResetAll)
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

const $challengerWorkStatistics = createStore<ChallengerWorkStatisticsStore>(
  defaultStore.$challengerWorkStatistics
)

const $challengerStatistics = createStore<ChallengerStatisticsStore>(
  defaultStore.$challengerStatistics
)

$challengerStatistics
  .on(challengerStatsProgressUpdate, (state, trueTyped) => {
    if (state.code) {
      const left = getLeft(state.code, trueTyped)
      const progress = getProgress({ ...state.code, left })

      return { ...state, code: { ...state.code, left }, progress }
    }
  })
  .reset([challengerStatisticsCleared, challengerStatsReset])

$challengerWorkStatistics
  .reset([challengerStatsReset, challengerResetAll])
  .on(challengerWorkStatisticUpdate, (state, trueTyped) => {
    if (state.code) {
      const left = getLeft(state.code, trueTyped)

      if (!trueTyped) {
        const errors = [...state.errors]
        const existedErrorIndex = state.errors.findIndex(
          errId => errId === state.currentId
        )

        if (existedErrorIndex === -1) {
          errors.push(state.currentId)
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
        },
        currentId: state.currentId + 1
      }
    }
  })
  .on(challengerWorkStatisticsChanged, (state, payload) => {
    return { ...state, ...payload }
  })

sample({
  clock: [challengerWorkStatisticUpdate, challengerWorkStatisticsChanged],
  source: { state: $challengerWorkStatistics },
  fn: ({ state }) => {
    //const getWpm = () => {
    //  const pressed = state.keyboard.pressed
    //  if (state.time < 1000) {
    //    return pressed / 5 / (1 / 60)
    //  }

    //  const timeinMinutes = state.time / 1000 / 60

    //  return pressed / 5 / timeinMinutes
    //}

    const getBestStats = () => {
      const challengerStats = $challengerStatistics.getState()
      let maxCombo = challengerStats.maxCombo
      if (challengerStats.maxCombo < state.combo) {
        maxCombo = state.combo
      }
      return { maxCombo }
    }

    const progress = getProgress(state.code)
    //const wpm = getWpm()
    const bestStats = getBestStats()
    const { maxCombo } = bestStats

    const timeline = $challengerStatistics.getState().timeline
    const { currentId, keyboard, ...onlyStats } = state
    const updatedStats = { ...onlyStats, progress, maxCombo }
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
        updatedTimeline.push(updatedStats)
      }
      return updatedTimeline
    }

    const updatedTimeline = getUpdatedTimeline()

    return { ...updatedStats, timeline: updatedTimeline }
  },
  target: $challengerStatistics
})

export { baseChallengerStatistics, defaultStore }
export { $challenger, $challengerWorkStatistics, $challengerStatistics }
