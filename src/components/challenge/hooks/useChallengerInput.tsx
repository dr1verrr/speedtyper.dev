import { useEvent } from 'effector-react'
import _ from 'lodash'
import React, { useRef, useState } from 'react'

import { challengerWorkStatisticsChanged } from '../events'
import { getHighlighted, Highlighted } from '../helpers'
import { ChallengerInputProps } from '../types'
import useChallenger from './useChallenger'

const defaults = {
  loading: {
    highlighting: true
  }
}

type Loading = {
  highlighting: boolean
}

type useChallengerProps = ChallengerInputProps & {
  refs: {
    inputRef: React.RefObject<HTMLTextAreaElement>
    codeRef: React.RefObject<HTMLSpanElement>
    highlightedRef: React.RefObject<HTMLSpanElement>
    cursorRef: React.RefObject<HTMLSpanElement>
  }
}

const useChallengerInput = ({ code, language, refs }: useChallengerProps) => {
  const highlighted = useRef<Highlighted>()
  const [originalHighlighted, setOriginalHighlighted] = useState<Highlighted>()
  const [loading, setLoading] = useState<Loading>(defaults.loading)
  const currentTokenIndex = useRef(0)

  const { actions: challengerActions } = useChallenger()

  const setStatistics = useEvent(challengerWorkStatisticsChanged)

  const actions = {
    status: {
      toggleLoading: (
        payload?: keyof Loading | Array<keyof Loading> | Partial<Loading>
      ) => {
        let loadingChanged = { ...loading }
        if (!payload) {
          for (const key in loadingChanged) {
            loadingChanged[key as keyof Loading] = !loadingChanged[key as keyof Loading]
          }
        } else if (typeof payload === 'string') {
          loadingChanged[payload] = !loadingChanged[payload]
        } else if (typeof payload === 'object' && !Array.isArray(payload)) {
          loadingChanged = { ...loadingChanged, ...payload }
        } else if (Array.isArray(payload)) {
          for (const key of payload) {
            loadingChanged[key] = !loadingChanged[key]
          }
        }
        setLoading(loadingChanged)
      },
      startTyping: (tokenized: Highlighted) => {
        refs.inputRef.current?.focus()
        challengerActions.status.set({
          finished: false,
          highlighted: tokenized,
          paused: false,
          started: true
        })

        setStatistics({ code: { left: tokenized.total, total: tokenized.total } })
      },
      tokenize: () => {
        const tokenized = getHighlighted(code, language)
        highlighted.current = _.cloneDeep(tokenized)

        actions.status.toggleLoading({ highlighting: false })

        setOriginalHighlighted(_.cloneDeep(tokenized))
      }
    }
  }

  const handlers = {
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      const typedValue = e.currentTarget.value

      if (refs.highlightedRef.current && refs.cursorRef.current && highlighted.current) {
        const { code, language, tokens } = highlighted.current

        const current = {
          index: currentTokenIndex.current,
          token: highlighted.current.tokens[currentTokenIndex.current],
          symbol: highlighted.current.tokens[currentTokenIndex.current].content.slice(
            0,
            1
          )
        }

        const updateToken = (newIndex: number) => {
          currentTokenIndex.current = newIndex
          current.index = newIndex
          current.token = tokens[newIndex]
          current.symbol = tokens[newIndex].content.slice(0, 1)

          return current
        }

        const isEqualToTyped = (comparable: string) => {
          if (comparable === typedValue) {
            return true
          }
          return false
        }

        const insertIndentSpaces = (spaces: string) => {
          const highlightedChildren = refs.highlightedRef.current!.children
          const indentSpacesElement = document.createElement('span')

          indentSpacesElement.textContent = '' + spaces
          highlightedChildren[highlightedChildren.length - 1].after(indentSpacesElement)
          refs.codeRef.current!.textContent = refs.codeRef.current!.textContent!.slice(
            spaces.length
          )
        }

        const syncChanges = () => {
          refs.highlightedRef.current!.children[current.index].textContent +=
            current.symbol
          refs.codeRef.current!.textContent = refs.codeRef.current!.textContent!.slice(1)

          if (current.token.indentSpaces) {
            insertIndentSpaces(current.token.indentSpaces)
          }

          const newSymbol = current.token.content.slice(1, 2)

          if (!newSymbol) {
            const newToken = updateToken(current.index + 1)

            refs.cursorRef.current!.textContent = newToken.symbol
          } else {
            current.token.content = current.token.content.slice(1)
            refs.cursorRef.current!.textContent = newSymbol
          }

          if (refs.cursorRef.current!.textContent === '\n') {
            refs.cursorRef.current!.classList.add('new-row')
          } else {
            if (refs.cursorRef.current?.className.includes('new-row')) {
              refs.cursorRef.current!.classList.remove('new-row')
            }
          }
        }

        const nextToken = (symbol?: string) => {
          syncChanges()
        }

        challengerActions.statistics.update(isEqualToTyped(current.symbol))

        if (!refs.highlightedRef.current.children[current.index]) {
          const highlightedChildren = refs.highlightedRef.current.children
          if (!highlightedChildren.length) {
            refs.highlightedRef.current.replaceChildren(current.token.element)
          } else {
            const lastHighlightedElement =
              highlightedChildren[highlightedChildren.length - 1]

            lastHighlightedElement.after(current.token.element)
          }
        }
        if (isEqualToTyped(current.symbol)) {
          if (current.token.content.length <= 1 && !tokens[current.index + 1]) {
            highlighted.current = _.cloneDeep(originalHighlighted)
            refs.cursorRef.current!.textContent = originalHighlighted!.code.slice(0, 1)
            refs.codeRef.current!.textContent = originalHighlighted!.code.slice(1)
            refs.highlightedRef.current.innerHTML = ''

            for (const hlToken of highlighted.current!.tokens) {
              hlToken.element.textContent = ''
            }

            currentTokenIndex.current = 0
            challengerActions.reset()
            challengerActions.status.set({ finished: true })
            console.log('finished')
          } else {
            nextToken()
          }
        }
      }
    }
  }

  return {
    actions,
    handlers,
    loading,
    highlighted,
    originalHighlighted
  }
}

export default useChallengerInput
