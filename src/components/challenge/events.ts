import { createEvent } from 'effector'

import { ChallengerStatisticsStore, ChallengerStore } from './store'

const challengerInited = createEvent<Partial<ChallengerStore>>()
const challengerCleared = createEvent()
const challengerChanged = createEvent<Partial<ChallengerStore>>()

const challengerStatisticsFilled = createEvent<Partial<ChallengerStore>>()
const challengerStatisticsChanged = createEvent<Partial<ChallengerStatisticsStore>>()

type IsError = boolean

const challengerStatisticUpdate = createEvent<IsError>()

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
  challengerInited,
  challengerCleared,
  statusToggled,
  nextToken,
  nextSubToken,
  challengerStatisticsFilled,
  challengerStatisticUpdate,
  challengerStatisticsChanged
}
