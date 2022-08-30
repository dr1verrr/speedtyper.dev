import { useEvent, useStore } from 'effector-react'
import React, { createRef, useEffect, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './Challenger.css'

import {
  challengerChanged,
  nextSubToken,
  nextToken,
  statusToggled,
  tokensChanged
} from './events'
import { getSplittedTokens } from './helpers'
import { $challenger, ChallengerStore, CurrentToken } from './store'

import { Box, Button } from '@/components/shared'
import { Theme } from '@/services/theme/types'
import { codeSample } from '@/views/ChallengePage/constants'

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

export default function Challenger() {
  const inputRef = createRef<HTMLTextAreaElement>()
  const codeRef = createRef<HTMLElement>()
  const challenger = useStore($challenger)
  const { paused, started, currentToken, tokens } = challenger

  const classes = useStyles()

  const setTokens = useEvent(tokensChanged)
  const updateChallenger = useEvent(challengerChanged)
  const toggleStatus = useEvent(statusToggled)
  const setNextToken = useEvent(nextToken)
  const setNextSubToken = useEvent(nextSubToken)

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
        language='js'
        style={dracula}
      >
        {codeSample}
      </SyntaxHighlighter>
    ),
    [paused, started]
  )

  const actions = {
    status: {
      paused: {
        toggle: () => toggleStatus('paused')
      },
      started: {
        toggle: () => toggleStatus('started')
      },
      updateHighlights: (prevToken: CurrentToken) => {
        const { tokens } = challenger
        if (tokens) {
          const getPrevElement = () => {
            if (prevToken.subTokens && prevToken.subTokens.length) {
              return prevToken.subTokens[0].element
            } else {
              return prevToken.element
            }
          }
          const getNextElement = () => {
            if (prevToken.subTokens && prevToken.subTokens.length > 1) {
              return prevToken.subTokens[1].element
            } else {
              const nextToken = tokens[prevToken.id + 1]
              if (nextToken) {
                if (nextToken.subTokens.length >= 1) {
                  return nextToken.subTokens[0].element
                } else {
                  prevToken.element.replaceChildren(prevToken.fullWord)
                  return nextToken.element
                }
              }
            }
          }

          const prev = getPrevElement()
          const next = getNextElement()

          prev.className = prev.className.replace('current', '')

          if (next) {
            next.className += ' current'
          }
        }
      },
      currentToken: {
        next: () => setNextToken(),
        nextSubToken: () => setNextSubToken()
      },

      set: (payload: Partial<ChallengerStore>) => updateChallenger(payload)
    }
  }

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
      actions.status.set({
        paused: false,
        started: false,
        currentToken: null,
        finished: false,
        tokens: null
      })
      document.removeEventListener('keydown', handler)
    }

    return () => onUnmount()
  }, [])

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    e.preventDefault()
    const typedValue = e.target.value

    if (currentToken) {
      const { subTokens, element, id, fullWord } = currentToken

      if (subTokens.length) {
        const comparable = subTokens[0].element.textContent
        if (comparable === typedValue) {
          actions.status.updateHighlights(currentToken)
          nextSubToken()
        }
      } else {
        const comparable = element.textContent
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

  useEffect(() => {
    const currentToken = challenger.currentToken

    if (currentToken) {
      const { subTokens, element, id, fullWord } = currentToken
      //console.log('word', fullWord, subTokens)
    }
  }, [challenger])

  const onFocus: React.FocusEventHandler<HTMLTextAreaElement> = e => {
    if (!started) {
      const splittedTokens = getSplittedTokens(codeRef.current)

      if (splittedTokens) {
        actions.status.set({ currentToken: splittedTokens[0] })
        if (splittedTokens[0].subTokens) {
          const children = splittedTokens[0].subTokens
          children[0].element.className += ' current'
        } else {
          splittedTokens[0].element.className += ' current'
        }
        setTokens(splittedTokens)
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
