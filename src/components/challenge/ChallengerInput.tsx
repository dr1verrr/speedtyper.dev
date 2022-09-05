//Prism.plugins.autoloader.languages_path = ''
import 'prism-themes/themes/prism-one-dark.css'

import { MouseEventHandler, useEffect, useRef } from 'react'

import { Box, Button } from '@/components/shared'
import { useTheme } from '@/services/theme/actions'
import { rgba } from '@/utils/styles'

import { useChallenger } from './hooks'
import useChallengerInput from './hooks/useChallengerInput'
import { useStyles } from './styles/styles.jss'
import { ChallengerInputProps } from './types'

export default function ChallengerInput({ language, code }: ChallengerInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const highlightedRef = useRef<HTMLSpanElement>(null)

  const {
    actions: challengerActions,
    challenger: { started, paused }
  } = useChallenger()

  const { actions, handlers, highlighted, loading, originalHighlighted } =
    useChallengerInput({
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
  const classes = useStyles.challenger({ theme, language, code })
  console.log('loading', loading)

  const onClick: MouseEventHandler<HTMLDivElement> = e => {
    if (!started && !loading.highlighting && originalHighlighted) {
      return actions.status.startTyping(originalHighlighted)
    }
    if (started) {
      inputRef.current?.focus()
    }
  }

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      const preesedKey = e.code

      if (preesedKey === 'Enter' || preesedKey === 'Space') {
        e.preventDefault()
        switch (preesedKey) {
          case 'Enter':
            if (!started && !paused && originalHighlighted) {
              actions.status.startTyping(originalHighlighted)
            }

          case 'Space':
            if (started) challengerActions.status.togglePause()
        }
      }
    }

    if (!started) {
      document.addEventListener('keydown', keydownHandler)
    }

    const onUnmount = () => {
      document.removeEventListener('keydown', keydownHandler)
    }

    return onUnmount
  }, [started, paused, originalHighlighted])

  useEffect(() => {
    actions.status.tokenize()
  }, [])

  useEffect(() => {
    if (!loading.highlighting && originalHighlighted) {
      cursorRef.current!.textContent = originalHighlighted.code.slice(0, 1)
      codeRef.current!.textContent = originalHighlighted.code.slice(1)
    }
  }, [loading, originalHighlighted])

  if (loading.highlighting) return null

  return (
    <Box
      sx={{
        position: 'relative',
        maxHeight: '55vh',
        overflow: !started || paused ? 'hidden' : 'auto',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: rgba(theme.highlighter.color, 0.07),
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
      onClick={onClick}
    >
      <textarea
        ref={inputRef}
        autoCapitalize='none'
        className={classes.hiddenInput}
        tabIndex={-1}
        value=''
        onChange={handlers.handleChange}
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
            style={{ wordBreak: 'break-all', display: 'inline' }}
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
                {paused && 'Press space to unpause'}
                {!started && 'Press enter to start typing'}
              </>
            )}
          </Button>
        </div>
      )}
    </Box>
  )
}
