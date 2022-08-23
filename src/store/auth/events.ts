import { createEvent } from 'effector'

const authChanged = createEvent<boolean>()

export { authChanged }
