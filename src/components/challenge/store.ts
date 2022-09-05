import { createStore, sample } from 'effector'

import {
  challengerChanged,
  challengerCleared,
  challengerReset,
  challengerStatisticsCleared,
  challengerStatisticUpdate as challengerWorkStatisticUpdate,
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
  errors: number[]
  keyboard: {
    pressed: number
  }
  time: number
}

type ChallengerStore = {
  paused: boolean
  started: boolean
  finished: boolean
  highlighted: Highlighted
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

export type { ChallengerStore, ChallengerWorkStatisticsStore, ChallengerStatisticsStore }

const baseChallengerStatistics = {
  code: null,
  wpm: 0,
  combo: 0,
  time: 0,
  progress: 0,
  currentId: 0,
  errors: [],
  keyboard: {
    pressed: 0
  }
}

const defaultStore = {
  $challenger: {
    paused: false,
    started: false,
    finished: false,
    highlighted: {} as Highlighted
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

const $challenger = createStore<ChallengerStore>({ ...defaultStore.$challenger })

$challenger
  .reset(challengerReset)
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

$challengerStatistics.reset(challengerStatisticsCleared).watch(state => {})

$challengerWorkStatistics
  .reset(challengerReset)
  .on(challengerWorkStatisticUpdate, (state, trueTyped) => {
    if (state.code) {
      const getLeft = (): number => {
        if (trueTyped) {
          return state.code?.left! - 1
        }
        return state.code?.left as number
      }

      const left = getLeft()

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
  .reset(challengerReset)

sample({
  clock: [challengerWorkStatisticUpdate, challengerWorkStatisticsChanged],
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
