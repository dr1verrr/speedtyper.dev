import React, { createRef, useEffect, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './Challenger.css'

import { nextSubToken, nextToken } from './events'
import { getSplittedTokens } from './helpers'
import { $challenger } from './store'
import useChallengerInput from './useChallengerInput'

import { Box, Button } from '@/components/shared'
import { Theme } from '@/services/theme/types'

type RuleNames = 'previewMask' | 'previewMaskInner'

const useStyles = createUseStyles<RuleNames, undefined, Theme>({
  previewMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  previewMaskInner: {}
})

type ChallengerInputProps = {
  language: string
  code: string
}

export default function ChallengerInput({ language, code }: ChallengerInputProps) {
  const inputRef = createRef<HTMLTextAreaElement>()
  const codeRef = createRef<HTMLElement>()
  const {
    challenger: { paused, started, currentToken, tokens },
    actions
  } = useChallengerInput()

  const classes = useStyles()

  const Highlighter = useMemo(
    () => (
      <SyntaxHighlighter
        codeTagProps={{
          style: {
            display: 'inline-block',
            zIndex: 100,
            cursor: 'text',
            position: 'relative'
          },
          ref: codeRef
        }}
        customStyle={{
          fontSize: 20,
          fontWeight: 300,
          letterSpacing: 0.5,
          userSelect: 'none',
          filter: started && !paused ? 'none' : 'saturate(0)',
          fontFamily: 'monospace',
          maxHeight: '75vh'
        }}
        language={language}
        style={dracula}
      >
        {code}
      </SyntaxHighlighter>
    ),
    [paused, started]
  )

  useEffect(() => {
    console.log(tokens)
  }, [tokens])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { paused, started } = $challenger.getState()

      if (e.key === 'Enter' && !paused && !started) {
        e.preventDefault()

        actions.status.set({ started: true })
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handler)

    const onUnmount = () => {
      //actions.status.reset()
      actions.reset()
      document.removeEventListener('keydown', handler)
    }

    return () => onUnmount()
  }, [])

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    e.preventDefault()
    const typedValue = e.target.value

    if (currentToken) {
      const { subTokens, element } = currentToken

      if (subTokens.length) {
        const comparable = subTokens[0].element.textContent
        actions.statistics.update(comparable === typedValue)

        if (comparable === typedValue) {
          actions.status.updateHighlights(currentToken)
          nextSubToken()
        }
      } else {
        const comparable = element.textContent
        actions.statistics.update(comparable === typedValue)

        if (comparable === typedValue) {
          actions.status.updateHighlights(currentToken)
          nextToken()
        } else if (comparable === '') {
          actions.status.updateHighlights(currentToken)
          nextToken()
        }
      }
    }
  }

  const onFocus: React.FocusEventHandler<HTMLTextAreaElement> = e => {
    if (!started) {
      const splittedTokens = getSplittedTokens(codeRef.current)

      if (splittedTokens) {
        if (splittedTokens[0].subTokens) {
          const children = splittedTokens[0].subTokens
          children[0].element.className += ' current'
        } else {
          splittedTokens[0].element.className += ' current'
        }
        actions.status.init({ currentToken: splittedTokens[0], tokens: splittedTokens })
      }
    }
  }

  return (
    <Box
      sx={{ position: 'relative' }}
      onClick={() => inputRef.current?.focus()}
    >
      <textarea
        ref={inputRef}
        autoCapitalize='none'
        style={{
          margin: 0,
          padding: 0,
          position: 'absolute',
          display: 'inline-block',
          top: 0,
          right: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          zIndex: -1,
          cursor: 'default'
        }}
        tabIndex={-1}
        value=''
        onChange={handleChange}
        onFocus={onFocus}
      />
      {Highlighter}
      {(!started || paused) && (
        <div
          className={classes.previewMask}
          onClick={() => actions.status.set({ started: true })}
        >
          <Box className={classes.previewMaskInner}>
            <Button
              sx={{
                padding: '12px 30px',
                fontSize: 20,
                boxShadow: '0 0 15px #999'
              }}
            >
              {paused && 'Press space to unpause'}
              {!started && 'Press enter to start typing'}
            </Button>
          </Box>
        </div>
      )}
    </Box>
  )
}
