import { createEvent } from 'effector'

import { ThemeStore } from './store'

const themeChanged = createEvent<ThemeStore>()
const themeToggled = createEvent()

export { themeChanged, themeToggled }
