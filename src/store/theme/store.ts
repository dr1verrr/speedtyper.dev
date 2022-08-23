import { loadState } from '@/utils/localStorage'
import { createStore } from 'effector'
import { LocalStorageKeys } from './constants'

type ThemeStore = 'dark' | 'light'

export type { ThemeStore }

const defaultValue = 'light'

const $theme = createStore<ThemeStore>(loadState(LocalStorageKeys.theme) || defaultValue)

export default $theme
