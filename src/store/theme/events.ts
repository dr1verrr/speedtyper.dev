import { createEvent } from 'effector'
import { ThemeStore } from './store'

const themeChanged = createEvent<ThemeStore>()

export { themeChanged }
