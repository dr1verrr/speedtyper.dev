import { loadState, saveState } from '@/utils/localStorage'
import { createStore } from 'effector'
import { LocalStorageKeys } from './constants'
import { authChanged } from './events'

type AuthStore = boolean

const $auth = createStore<AuthStore>(loadState(LocalStorageKeys.auth) || false)

$auth.on(authChanged, (_, payload) => {
  saveState(LocalStorageKeys.auth, payload)
  return payload
})

export default $auth