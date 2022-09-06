import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'

import { Box, Button } from '@/components/shared'
import { useTheme } from '@/services/theme/actions'

import { useChallenger } from './hooks'
import useChallengerInput from './hooks/useChallengerInput'
import { useStyles } from './styles/styles.jss'
import { ChallengerInputProps } from './types'

export default function ChallengerInput({ language, code }: ChallengerInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const highlightedRef = useRef<HTMLSpanElement>(null)
  const [isFocused, setFocused] = useState(false)
  const listenersAdded = useRef({ onPressedEnter: false, onPressedPauseHotkey: false })

  const {
    actions: challengerActions,
    challenger: { started, paused, finished }
  } = useChallenger()

  const { actions, handlers, loading, originalHighlighted } = useChallengerInput({
    code,
    language,
    refs: {
      inputRef,
      cursorRef,
      codeRef,
      highlightedRef
    }
  })

  const theme = useTheme()
  const classes = useStyles.challenger({
    theme,
    language,
    code,
    finished,
    paused,
    started,
    focused: isFocused
  })

  const onClick: MouseEventHandler<HTMLDivElement> = e => {
    if (!started && !loading.highlighting && originalHighlighted) {
      return actions.status.startTyping(originalHighlighted)
    }
    if (paused) {
      challengerActions.status.togglePause()
    }
    if (started) {
      inputRef.current?.focus()
    }
  }

  const onPressedEnter = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && originalHighlighted) {
        actions.status.startTyping(originalHighlighted)
      }
    },
    [originalHighlighted]
  )

  const onPressedPauseHotkey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'p' && e.altKey) {
        challengerActions.status.togglePause()
      }
    },
    [paused]
  )

  useEffect(() => {
    if (paused) {
      inputRef.current?.blur()
    }

    if (started && !paused) {
      inputRef.current?.focus()
    }

    if (started && !listenersAdded.current.onPressedPauseHotkey) {
      listenersAdded.current = { onPressedEnter: false, onPressedPauseHotkey: true }
      document.addEventListener('keydown', onPressedPauseHotkey)
      document.removeEventListener('keydown', onPressedEnter)
    }

    if (!started && !listenersAdded.current.onPressedEnter && originalHighlighted) {
      listenersAdded.current.onPressedEnter = true
      document.addEventListener('keydown', onPressedEnter)
    }

    if (finished) {
      listenersAdded.current = { onPressedEnter: true, onPressedPauseHotkey: false }
      document.addEventListener('keydown', onPressedEnter)
      document.removeEventListener('keydown', onPressedPauseHotkey)
    }
  }, [started, paused, finished, originalHighlighted])

  useEffect(() => {
    const onUnmount = () => {
      document.removeEventListener('keydown', onPressedEnter)
      document.removeEventListener('keydown', onPressedPauseHotkey)
    }

    actions.status.tokenize()

    return () => {
      onUnmount()
    }
  }, [])

  useEffect(() => {
    if (!loading.highlighting && originalHighlighted) {
      cursorRef.current!.textContent = originalHighlighted.code.slice(0, 1)
      codeRef.current!.textContent = originalHighlighted.code.slice(1)
    }
  }, [loading, originalHighlighted])

  //useEffect(() => {
  //  console.log('added listenrs', listenersAdded.current)
  //}, [isFocused])

  if (loading.highlighting) return null

  const onBlur: React.FocusEventHandler<HTMLTextAreaElement> = e => {
    if (isFocused) {
      setFocused(false)
    }
  }

  const onFocus: React.FocusEventHandler<HTMLTextAreaElement> = e => {
    if (!isFocused) {
      setFocused(true)
    }
  }

  return (
    <Box
      className={classes.wrapper}
      onClick={onClick}
    >
      <textarea
        ref={inputRef}
        autoCapitalize='none'
        className={classes.hiddenInput}
        tabIndex={-1}
        value=''
        onBlur={onBlur}
        onChange={handlers.handleChange}
        onFocus={onFocus}
      />

      <div className={`language-${language}`}>
        <pre className={classes.highlighter}>
          <span
            ref={highlightedRef}
            className='hl'
          ></span>
          <span
            ref={cursorRef}
            className={classes.cursor}
          ></span>
          <span
            ref={codeRef}
            className={classes.codeLeft}
          ></span>
        </pre>
      </div>
      {(!started || paused) && (
        <div className={classes.previewMask}>
          <Button className={classes.previewMaskButton}>
            {loading.highlighting ? (
              'Loading...'
            ) : (
              <>
                {paused && 'Press Alt+P to continue'}
                {!started && 'Press enter to start typing'}
              </>
            )}
          </Button>
        </div>
      )}
    </Box>
  )
}
