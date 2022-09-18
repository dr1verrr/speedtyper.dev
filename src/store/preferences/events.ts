import { createEvent } from 'effector'

import { PreferencesStore } from './store'

const preferencesChanged = createEvent<Partial<PreferencesStore>>()

export { preferencesChanged }
