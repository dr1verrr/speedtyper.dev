import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import $preferences from '@/store/preferences/store'

import { $challengerStatistics } from '../../store/store'
import { Highlighted } from '../../store/store.helpers'
import { ChallengerInputProps } from '../../types'
import useChallenger from '../useChallenger'
import { defaults } from './constants'

type Loading = {
  highlighting: boolean
}

type useChallengerProps = ChallengerInputProps & {
  refs: {
    inputRef: React.RefObject<HTMLTextAreaElement>
    codeRef: React.RefObject<HTMLSpanElement>
    highlightedRef: React.RefObject<HTMLSpanElement>
    cursorRef: React.RefObject<HTMLSpanElement>
    highlightedWrapperRef: React.RefObject<HTMLElement>
  }
}

const useChallengerInput = ({ refs }: useChallengerProps) => {
  const highlighted = useRef<Highlighted>()
  const currentTokenIndex = useRef(0)
  const [loading, setLoading] = useState<Loading>(defaults.loading)
  const [cursorClassName, setCursorClassName] = useState('')
  const height = useRef<number>(0)
  const listenersAdded = useRef({
    onPressedEnter: false,
    onPressedPauseHotkey: false,
    onPressedCancelHotkey: false
  })
  const [keydownHandlers, setKeydownHandlers] = useState<{
    pause: (...args: any) => unknown
    start: (...args: any) => unknown
    cancel: (...args: any) => unknown
  }>()

  const {
    actions,
    challenger: { paused, started, finished, highlighted: originalHighlighted }
  } = useChallenger()

  const keydownListeners = {
    remove: (handlers: NonNullable<typeof keydownHandlers>) => {
      Object.values(handlers).forEach(handler => {
        document.removeEventListener('keydown', handler)
      })
    }
  }

  const typing = {
    reset: () => {
      if (originalHighlighted) {
        highlighted.current = _.cloneDeep(originalHighlighted)
        refs.cursorRef.current!.className = cursorClassName
        refs.cursorRef.current!.textContent = originalHighlighted!.code.slice(0, 1)
        refs.codeRef.current!.textContent = originalHighlighted!.code.slice(1)
        refs.highlightedRef.current!.innerHTML = ''

        for (const hlToken of highlighted.current!.tokens) {
          hlToken.element.textContent = ''
        }

        currentTokenIndex.current = 0
        height.current = 0
        refs.highlightedWrapperRef.current?.scroll({ top: 0 })
        actions.status.set({ finished: true, started: false, paused: false })
      }
    }
  }

  useEffect(() => {
    const onPressedEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        actions.challenger.start()
      }
    }

    const onPressedPauseHotkey = (e: KeyboardEvent) => {
      if ((e.code === 'Backquote' && e.altKey) || e.code === 'Escape') {
        e.preventDefault()
        actions.status.togglePause()
      }
    }

    const onPressedCancelHotkey = (e: KeyboardEvent) => {
      if (e.key === 'q' && e.altKey) {
        actions.status.cancel()
      }
    }

    if (originalHighlighted && !keydownHandlers) {
      setKeydownHandlers({
        pause: onPressedPauseHotkey,
        start: onPressedEnter,
        cancel: onPressedCancelHotkey
      })
    }
  }, [originalHighlighted, keydownHandlers])

  useEffect(() => {
    if (keydownHandlers) {
      if (!started) {
        typing.reset()
      }
      if (!started && !listenersAdded.current.onPressedEnter) {
        listenersAdded.current.onPressedEnter = true
        document.addEventListener('keydown', keydownHandlers.start)
      }
      if (started && !listenersAdded.current.onPressedPauseHotkey) {
        listenersAdded.current = {
          onPressedEnter: false,
          onPressedPauseHotkey: true,
          onPressedCancelHotkey: true
        }
        document.addEventListener('keydown', keydownHandlers.cancel)
        document.addEventListener('keydown', keydownHandlers.pause)
        document.removeEventListener('keydown', keydownHandlers.start)
      }
      if (finished) {
        const stats = $challengerStatistics.getState()
        if (stats.progress !== 100) {
          typing.reset()
        }
        listenersAdded.current = {
          onPressedEnter: true,
          onPressedPauseHotkey: false,
          onPressedCancelHotkey: false
        }
        keydownListeners.remove(keydownHandlers)
        document.addEventListener('keydown', keydownHandlers.start)
      }
    }
  }, [started, paused, finished, keydownHandlers, originalHighlighted])

  useEffect(() => {
    const onUnmount = () => {
      if (keydownHandlers) {
        keydownListeners.remove(keydownHandlers)
      }
    }

    return onUnmount
  }, [keydownHandlers])

  useEffect(() => {
    if (
      refs &&
      refs.codeRef.current &&
      refs.cursorRef.current &&
      refs.highlightedRef.current &&
      originalHighlighted
    ) {
      height.current = refs.highlightedRef.current?.clientHeight

      if (!cursorClassName) {
        setCursorClassName(refs.cursorRef.current.className)
      }
      highlighted.current = _.cloneDeep(originalHighlighted)
      setLoading({ highlighting: false })
    }
  }, [originalHighlighted])

  const doesNeedScroll = () => {
    const highlightedWrapperEl = refs.highlightedWrapperRef.current
    const highlightedEl = refs.highlightedRef.current

    if (
      highlightedWrapperEl!.clientHeight / 1.5 -
        (highlightedEl!.offsetHeight - height.current) <=
      0
    ) {
      height.current = highlightedEl!.offsetHeight
      return true
    }

    return false
  }

  const handlers = {
    handleChange: () => {
      if (
        refs &&
        refs.codeRef &&
        refs.cursorRef &&
        refs.highlightedRef &&
        originalHighlighted
      ) {
        const preferences = $preferences.getState()
        const getUpdaterFn = () => {
          if (preferences.challenger.collect_stats) {
            return (trueTyped: boolean) => {
              actions.statistics.update(trueTyped)
            }
          }
          if (!preferences.challenger.show_progressbar) return () => {}
          return (trueTyped: boolean) => {
            actions.statistics.updateProgress(trueTyped)
          }
        }
        const statsUpdaterFn = getUpdaterFn()
        return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          e.preventDefault()
          const typedValue = e.currentTarget.value
          const { tokens } = highlighted.current!

          const current = {
            index: currentTokenIndex.current,
            token: highlighted.current!.tokens[currentTokenIndex.current],
            symbol: highlighted.current!.tokens[currentTokenIndex.current].content.slice(
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
            highlightedChildren[highlightedChildren.length - 1].textContent =
              '\n' + spaces

            refs.codeRef.current!.textContent = refs.codeRef.current!.textContent!.slice(
              spaces.length
            )
          }

          const syncChanges = () => {
            refs.highlightedRef.current!.children[current.index].textContent +=
              current.symbol
            refs.codeRef.current!.textContent =
              refs.codeRef.current!.textContent!.slice(1)

            if (current.token.type === 'new-row') {
              if (current.token.indentSpaces) {
                insertIndentSpaces(current.token.indentSpaces)
              }
            }

            const newSymbol = current.token.content.slice(1, 2)

            if (!newSymbol) {
              const newToken = updateToken(current.index + 1)

              refs.cursorRef.current!.textContent = newToken.symbol
            } else {
              current.token.content = current.token.content.slice(1)
              refs.cursorRef.current!.textContent = newSymbol
            }

            if (current.symbol === '\n') {
              refs.cursorRef.current!.className = cursorClassName + ' ' + 'new-row'
            } else {
              refs.cursorRef.current!.className = cursorClassName
            }

            if (doesNeedScroll()) {
              refs.cursorRef.current?.scrollIntoView({ block: 'start' })
            }
          }

          const nextToken = (symbol?: string) => {
            syncChanges()
          }

          statsUpdaterFn(isEqualToTyped(current.symbol))

          if (!refs.highlightedRef.current!.children[current.index]) {
            const highlightedChildren = refs.highlightedRef.current!.children
            const lastHighlightedElement =
              highlightedChildren[highlightedChildren.length - 1]

            if (highlightedChildren.length) {
              lastHighlightedElement.after(current.token.element)
            } else {
              refs.highlightedRef.current!.replaceChildren(current.token.element)
            }
          }

          if (isEqualToTyped(current.symbol)) {
            if (current.token.content.length <= 1 && !tokens[current.index + 1]) {
              typing.reset()
            } else {
              nextToken()
            }
          }
        }
      }
      return () => {}
    },
    handleClick: (): ((e: React.MouseEvent<HTMLDivElement>) => unknown) | undefined => {
      if (!started) {
        return () => {
          refs.inputRef.current?.focus()
          actions.challenger.start()
        }
      }
      if (paused) {
        return () => {
          refs.inputRef.current?.focus()
          actions.status.togglePause()
        }
      }
      if (!paused && started) {
        return () => {
          refs.inputRef.current?.focus()
        }
      }
      return undefined
    }
  }

  return {
    handlers,
    loading,
    highlighted,
    originalHighlighted
  }
}

export default useChallengerInput
