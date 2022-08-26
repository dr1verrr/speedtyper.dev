import { createEvent } from 'effector'

const loadingChanged = createEvent<boolean>()

export { loadingChanged }
