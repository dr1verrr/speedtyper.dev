import { createStore } from 'effector'

import { loadingChanged, uiChanged } from './events'

type UIStore = {
  loading: boolean
  dimensions: {
    navBar: {
      height: null | number
    }
  }
}

export type { UIStore }

const defaultStore = {
  loading: false,
  dimensions: {
    navBar: {
      height: null
    }
  }
}

const $ui = createStore<UIStore>(defaultStore)

$ui
  .on(loadingChanged, (state, payload) => ({ ...state, loading: payload }))
  .on(uiChanged, (state, payload) => ({ ...state, ...payload }))

export default $ui
