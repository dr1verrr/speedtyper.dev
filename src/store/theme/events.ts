import { ThemeStore } from './store'
import { createEvent } from 'effector'

const themeChanged = createEvent<ThemeStore>()
const themeToggled = createEvent()

export { themeChanged, themeToggled }
