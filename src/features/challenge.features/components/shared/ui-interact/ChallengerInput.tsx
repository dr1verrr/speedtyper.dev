import '../../../styles/ChallengerInput.css'

import { useStore } from 'effector-react'
import React, { useEffect, useRef, useState } from 'react'

import { Box, Button, Typography } from '@/components/shared'
import { useChallenger, useChallengerInput } from '@/features/challenge.features/hooks'
import { useStyles } from '@/features/challenge.features/styles/styles.jss'
import { ChallengerInputProps } from '@/features/challenge.features/types'
import { useTheme } from '@/services/theme/actions'
import usePrismStyles from '@/services/theme/prism-themes'
import $preferences from '@/store/preferences/store'

export default function ChallengerInput({ language, code }: ChallengerInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const highlightedRef = useRef<HTMLSpanElement>(null)
  const highlightedWrapperRef = useRef<HTMLEmbedElement>(null)
  const [isFocused, setFocused] = useState(false)
  const theme = useTheme()
  const prismClasses = usePrismStyles({ theme })
  const preferences = useStore($preferences)

  const {
    actions,
    challenger: { started, paused, finished, highlighted }
  } = useChallenger()

  const { handlers, loading } = useChallengerInput({
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
    focused: isFocused,
    preferences
  })

  useEffect(() => {
    if (!started && !highlighted) {
      actions.challenger.tokenize(code, language)
    }
    if (paused || finished) {
      inputRef.current?.blur()
    }

    if (started && !paused) {
      inputRef.current?.focus()
    }
  }, [started, paused, finished, highlighted, code, language])

  useEffect(() => {
    if (cursorRef.current && codeRef.current && highlighted) {
      cursorRef.current!.textContent = highlighted.code.slice(0, 1)
      codeRef.current!.textContent = highlighted.code.slice(1)
    }
  }, [highlighted])

  const onBlur: React.FocusEventHandler<HTMLTextAreaElement> = e => {
    if (isFocused) {
      setFocused(false)
    }
  }

  const onFocus: React.FocusEventHandler<HTMLTextAreaElement> = e => {
    if (!isFocused) {
      if (!started) {
        inputRef.current?.blur()
      } else {
        setFocused(true)
      }
    }
  }

  return (
    <Box
      className={`${classes.wrapper} ${prismClasses[theme.mode as 'light']}`}
      onClick={handlers.handleClick()}
    >
      <textarea
        ref={inputRef}
        autoCapitalize='none'
        className={classes.hiddenInput}
        tabIndex={-1}
        value=''
        onBlur={onBlur}
        onChange={handlers.handleChange()}
        onFocus={onFocus}
      />
      <div
        ref={highlightedWrapperRef}
        className={`language-${language} ${classes.highlighterWrapper}`}
      >
        <pre className={classes.highlighter}>
          <div className={classes.highlighterInner}>
            {loading.highlighting && code}
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
          {!started && !loading.highlighting && (
            <Button className={classes.previewMaskButton}>
              Press <Typography highlighted>Enter</Typography> to start.
            </Button>
          )}
          {paused && (
            <Button
              sx={{
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                padding: '7px 15px',
                borderColor: 'palevioletred'
              }}
            >
              Press
              <Typography
                highlighted
                sx={{ marginLeft: 7, marginRight: 7 }}
              >
                Alt+`
              </Typography>
              to continue.
            </Button>
          )}
        </div>
      )}
    </Box>
  )
}
