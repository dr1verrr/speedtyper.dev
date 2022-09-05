import { createStore } from 'effector'

import { loadState, saveState } from '@/utils/localStorage'

import { LocalStorageKeys } from './constants'
import { themeChanged, themeToggled } from './events'

type ThemeStore = 'dark' | 'light'

export type { ThemeStore }

const defaultValue = 'light'

const $theme = createStore<ThemeStore>(loadState(LocalStorageKeys.theme) || defaultValue)

$theme
  .on(themeChanged, (_, payload) => payload)
  .on(themeToggled, theme => {
    if (theme === 'dark') return 'light'
    return 'dark'
  })
  .watch(state => {
    saveState(LocalStorageKeys.theme, state)
  })

export default $theme
