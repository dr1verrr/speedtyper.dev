import { createStore } from 'effector'

import {
  statusToggled,
  tokensChanged,
  challengerCleared,
  challengerChanged,
  nextToken,
  nextSubToken
} from './events'

type SubToken = {
  element: Element
  id: number
}

type CurrentToken = {
  element: Element
  id: number
  subTokens: SubToken[]
  fullWord: string
}

type ChallengerStore = {
  paused: boolean
  started: boolean
  tokens: CurrentToken[] | null
  currentToken: CurrentToken | null
  finished: boolean
}

export type { ChallengerStore, CurrentToken, SubToken }

const defaultStore = {
  paused: false,
  started: false,
  tokens: null,
  currentToken: null,
  finished: false,
  fullWord: null
}

const $challenger = createStore<ChallengerStore>(defaultStore)

$challenger
  .on(tokensChanged, (state, payload) => ({ ...state, tokens: payload }))
  .on(challengerCleared, () => defaultStore)
  .on(challengerChanged, (state, payload) => ({ ...state, ...payload }))
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

    return { ...state, ...status }
  })
  .on(nextToken, state => {
    if (state.tokens) {
      if (state.tokens[state.tokens.length - 1].id === state.currentToken?.id) {
        return { ...defaultStore, finished: true }
      }
      const next = state.tokens[state.currentToken?.id! + 1]
      return { ...state, currentToken: next }
    }
  })
  .on(nextSubToken, state => {
    if (state.tokens && state.currentToken) {
      const subTokens = state.currentToken.subTokens

      if (subTokens.length) {
        const currentSubToken = state.currentToken.subTokens[0]

        if (currentSubToken.id !== subTokens[subTokens.length - 1].id) {
          const getNotTypedYed = () => {
            const result = subTokens.filter(s => s.id !== currentSubToken.id)
            return result
          }

          return {
            ...state,
            currentToken: { ...state.currentToken, subTokens: getNotTypedYed() }
          }
        } else {
          const getNextToken = () => {
            if (state.currentToken) {
              const currentTokenId = state.currentToken?.id
              const next = state.tokens?.find(t => t.id === currentTokenId + 1)
              return next
            }
          }

          const nextToken = getNextToken()

          if (nextToken) {
            return { ...state, currentToken: nextToken }
          } else {
            return { ...state, finished: true }
          }
        }
      }
    }
  })

export { $challenger }
