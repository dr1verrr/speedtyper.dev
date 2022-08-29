import { createEvent } from 'effector'

import { ChallengerStore, CurrentToken } from './store'

const tokensChanged = createEvent<CurrentToken[]>()
const challengerCleared = createEvent()
const challengerChanged = createEvent<Partial<ChallengerStore>>()

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
  tokensChanged,
  challengerCleared,
  statusToggled,
  nextToken,
  nextSubToken
}
