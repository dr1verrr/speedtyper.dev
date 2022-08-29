import { ChallengerStatus } from './store'
import { createEvent } from 'effector'

const tokensChanged = createEvent<Element[]>()
const tokensCleared = createEvent()

const statusChanged = createEvent<Partial<ChallengerStatus>>()
const statusToggled = createEvent<
  Array<keyof ChallengerStatus> | keyof ChallengerStatus
>()

export { statusChanged, tokensChanged, tokensCleared, statusToggled }
