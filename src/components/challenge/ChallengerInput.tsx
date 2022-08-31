import React, { createRef, useEffect, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './Challenger.css'

import { nextSubToken, nextToken } from './events'
import { $challenger } from './store'
import useChallenger from './useChallenger'
import { getSplittedTokens } from './helpers'

import { Box, Button } from '@/components/shared'
import { Theme } from '@/services/theme/types'

type RuleNames = 'previewMask'

const useStyles = createUseStyles<RuleNames, undefined, Theme>({
  previewMask: {
    transition: 'background 0.3s ease',
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    overflow: 'hidden',
    '&:hover': {
      background: 'rgba(255,255,255, 0.1)'
    }
  }
})

type ChallengerInputProps = {
  language: string
  code: string
}

export default function ChallengerInput({ language, code }: ChallengerInputProps) {
  const inputRef = createRef<HTMLTextAreaElement>()
  const codeRef = createRef<HTMLElement>()
  const {
    challenger: { paused, started, currentToken },
    actions
  } = useChallenger()

  const classes = useStyles()

  const startTyping = () => {
    inputRef.current?.focus()
    actions.status.set({ started: true })
  }

  const memoizedHighlighter = useMemo(
    () => (
      <SyntaxHighlighter
        codeTagProps={{
          style: {
            display: 'inline-block',
            zIndex: 100,
            cursor: 'text',
            position: 'relative',
            filter: started && !paused ? 'none' : 'saturate(0)',
            overflow: 'hidden'
          },
          ref: codeRef
        }}
        customStyle={{
          fontSize: 20,
          userSelect: 'none',
          fontFamily: 'monospace',
          maxHeight: '75vh',
          margin: 0,
          overflow: 'hidden'
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
    const handler = (e: KeyboardEvent) => {
      const { paused, started } = $challenger.getState()
      const isReadyToStart = e.key === 'Enter' && !paused && !started

      if (isReadyToStart) {
        e.preventDefault()
        startTyping()
      }
    }

    document.addEventListener('keydown', handler)

    const onUnmount = () => {
      document.removeEventListener('keydown', handler)
    }

    return () => onUnmount()
  }, [])

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    const typedValue = e.target.value

    const compareTyped = (comparable: string | null) => {
      if (comparable === typedValue || (comparable === '\n' && typedValue === ' ')) {
        return true
      }
      return false
    }

    if (currentToken) {
      const { subTokens, element } = currentToken

      if (subTokens.length) {
        const comparable = subTokens[0].element.textContent
        actions.statistics.update(compareTyped(comparable))

        if (compareTyped(comparable)) {
          actions.status.updateHighlights(currentToken)
          nextSubToken()
        }
      } else {
        const comparable = element.textContent
        actions.statistics.update(compareTyped(comparable))

        if (compareTyped(comparable)) {
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
    const hasChildren = codeRef.current?.children

    const getTotal = () => {
      let total = 0
      const tokens = Object.values(codeRef.current?.children!)
      for (const token of tokens) {
        if (token.textContent) {
          if (token.textContent.length > 1) {
            total += token.textContent.length
          } else {
            total++
          }
        }
      }
      return total
    }

    if (!started && hasChildren) {
      const total = getTotal()
      if (total === code.length) {
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
  }

  return (
    <Box
      sx={{ position: 'relative' }}
      onClick={startTyping}
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
      {memoizedHighlighter}
      {(!started || paused) && (
        <div className={classes.previewMask}>
          <Box>
            <Button
              sx={{
                padding: '12px 30px',
                fontSize: 20,
                background: '#b794f4',
                borderColor: '#fff',
                color: '#000'
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
