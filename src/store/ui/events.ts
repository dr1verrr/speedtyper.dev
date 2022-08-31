import { createEvent } from 'effector'

import { UIStore } from './store'

const loadingChanged = createEvent<boolean>()
const uiChanged = createEvent<Partial<UIStore>>()

export { loadingChanged, uiChanged }
