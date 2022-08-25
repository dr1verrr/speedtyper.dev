import { LocalStorageKeys } from './constants'
import { authChanged } from './events'
import { loadState, saveState } from '@/utils/localStorage'
import { createStore } from 'effector'

type AuthStore = boolean

const $auth = createStore<AuthStore>(loadState(LocalStorageKeys.auth) || false)

$auth.on(authChanged, (_, payload) => {
  saveState(LocalStorageKeys.auth, payload)
  return payload
})

export default $auth
