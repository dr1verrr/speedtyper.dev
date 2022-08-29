import { statusChanged, statusToggled, tokensChanged, tokensCleared } from './events'
import { createStore } from 'effector'

type Challenger = Element[] | null

type ChallengerStatus = {
  paused: boolean
  started: boolean
}

export type { Challenger, ChallengerStatus }

const defaults = {
  $challenger: null,
  $challengerStatus: {
    paused: false,
    started: false
  }
}

const $challenger = createStore<Challenger>(defaults.$challenger)
const $challengerStatus = createStore<ChallengerStatus>(defaults.$challengerStatus)

$challenger
  .on(tokensChanged, (_, payload) => payload)
  .on(tokensCleared, () => defaults.$challenger)

$challengerStatus
  .on(statusChanged, (state, payload) => ({ ...state, ...payload }))
  .on(statusToggled, (state, key) => {
    let status = { ...state } as any

    if (Array.isArray(key)) {
      status = { ...state }
      Object.keys(key).forEach(k => {
        status[k] = !status[k]
      })
    } else {
      status[key] = !status[key]
    }
    console.log('status toggled')

    return { ...state, ...status }
  })
//.watch(state => {
//  console.log(state)
//})

export { $challenger, $challengerStatus }
