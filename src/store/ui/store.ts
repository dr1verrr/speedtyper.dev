import { createStore } from 'effector'

import { loadingChanged, uiChanged } from './events'

type UIStore = {
  loading: boolean
}

export type { UIStore }

const defaultStore = {
  loading: false
}

const $ui = createStore<UIStore>(defaultStore)

$ui
  .on(loadingChanged, (state, payload) => ({ ...state, loading: payload }))
  .on(uiChanged, (state, payload) => ({ ...state, ...payload }))

export default $ui
