import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

import { saveState } from '@/utils/localStorage'

import { LocalStorageKeys } from './constants'
import { authChanged } from './events'

type AuthStore = string | undefined | null

const $auth = createStore<AuthStore>(null)

$auth.on(authChanged, (_, uid) => {
  saveState(LocalStorageKeys.auth, uid)
  return uid
})

persist({ store: $auth, key: LocalStorageKeys.auth })

export default $auth
