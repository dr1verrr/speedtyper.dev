import { createEvent } from 'effector'

import { ChallengerStatisticsStore, ChallengerStore } from './store'

const challengerCleared = createEvent()
const challengerChanged = createEvent<Partial<ChallengerStore>>()

const challengerStatisticsFilled = createEvent<Partial<ChallengerStore>>()
const challengerWorkStatisticsChanged = createEvent<Partial<ChallengerStatisticsStore>>()
const challengerStatisticsCleared = createEvent()

type IsError = boolean

const challengerStatisticUpdate = createEvent<IsError>()

const challengerReset = createEvent()

const nextToken = createEvent()
const nextSubToken = createEvent()

type TBoolean<T> = {
  [K in keyof T as T[K] extends boolean ? K : never]: T[K]
}

const statusToggled = createEvent<
  Array<keyof TBoolean<ChallengerStore>> | keyof TBoolean<ChallengerStore>
>()

export {
  challengerChanged,
  challengerCleared,
  statusToggled,
  nextToken,
  nextSubToken,
  challengerStatisticsFilled,
  challengerStatisticUpdate,
  challengerWorkStatisticsChanged,
  challengerReset,
  challengerStatisticsCleared
}
