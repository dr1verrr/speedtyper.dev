import { loadingChanged } from './events'
import { createStore } from 'effector'

type UIStore = {
  loading: boolean
}

export type { UIStore }

const defaultStore = {
  loading: false
}

const $ui = createStore<UIStore>(defaultStore)

$ui.on(loadingChanged, (state, payload) => ({ ...state, loading: payload }))

export default $ui
