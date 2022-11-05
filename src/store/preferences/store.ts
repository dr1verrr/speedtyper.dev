/* eslint-disable no-eval */
import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

import { preferencesChanged } from './events'

type PreferencesStore = {
  challenger: {
    show_stats: boolean
    show_progressbar: boolean
    show_controls: boolean
    collect_stats: boolean
    use_challenger_large_view_width: boolean
    fontFamily: string
    fontSize: number
  }
}

export type { PreferencesStore }

const defaultStore = {
  challenger: {
    show_stats: true,
    show_progressbar: true,
    show_controls: true,
    collect_stats: true,
    use_challenger_large_view_width: true,
    fontFamily: 'JetBrains Mono',
    fontSize: 17
  }
}

export const preferencesNames = {
  challenger: {
    show_stats: 'show_stats',
    show_progressbar: 'show_progressbar',
    show_controls: 'show_controls',
    collect_stats: 'collect_stats',
    use_challenger_large_view_width: 'use_challenger_large_view_width',
    fontFamily: 'font-family',
    fontSize: 'font-size'
  }
}

const $preferences = createStore<PreferencesStore>(defaultStore as PreferencesStore)

$preferences.on(preferencesChanged, (state, payload) => {
  return { ...state, ...payload }
})

persist({ store: $preferences, key: 'preferences' })

export default $preferences
