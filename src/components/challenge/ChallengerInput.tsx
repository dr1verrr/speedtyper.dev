import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'

import { Box, Button } from '@/components/shared'
import { useTheme } from '@/services/theme/actions'
import usePrismStyles from '@/services/theme/prism-themes'

import { useChallenger } from './hooks'
import useChallengerInput from './hooks/useChallengerInput'
import { useStyles } from './styles/styles.jss'
import { ChallengerInputProps } from './types'

export default function ChallengerInput({ language, code }: ChallengerInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const highlightedRef = useRef<HTMLSpanElement>(null)
  const highlightedWrapperRef = useRef<HTMLEmbedElement>(null)
  const [isFocused, setFocused] = useState(false)
  const listenersAdded = useRef({ onPressedEnter: false, onPressedPauseHotkey: false })
  const theme = useTheme()
  const prismClasses = usePrismStyles({ theme })

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
      highlightedRef,
      highlightedWrapperRef
    }
  })

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
        e.preventDefault()
        actions.status.startTyping(originalHighlighted)
      }
    },
    [originalHighlighted]
  )

  const onPressedPauseHotkey = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Backquote' && e.altKey) {
      e.preventDefault()
      challengerActions.status.togglePause()
    }
  }, [])

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
      listenersAdded.current = { onPressedEnter: false, onPressedPauseHotkey: false }
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
      className={`${classes.wrapper} ${prismClasses[theme.mode as 'light']}`}
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

      <div
        ref={highlightedWrapperRef}
        className={`language-${language} ${classes.highlighterWrapper}`}
      >
        <pre className={classes.highlighter}>
          <div className={classes.highlighterInner}>
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
          </div>
        </pre>
      </div>
      {(!started || paused) && (
        <div className={classes.previewMask}>
          {loading.highlighting && (
            <Button className={classes.previewMaskButton}>Tokenization...</Button>
          )}
          {!started && (
            <Button className={classes.previewMaskButton}>Press Enter to start.</Button>
          )}
          {paused && (
            <Button sx={{ fontSize: 20 }}>
              Press <span style={{ fontWeight: 'bold' }}>Alt+`</span> to continue.
            </Button>
          )}
        </div>
      )}
    </Box>
  )
}
