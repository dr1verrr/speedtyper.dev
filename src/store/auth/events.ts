import { createEvent } from 'effector'

const authChanged = createEvent<string | undefined | null>()

export { authChanged }
