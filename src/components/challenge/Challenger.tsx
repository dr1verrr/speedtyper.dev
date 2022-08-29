import { useEvent, useStore } from 'effector-react'
import React, { createRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { WHITESPACE } from './constants'
import { statusChanged, statusToggled, tokensChanged } from './events'
import {
  filterTokenWithIndentSpaces,
  getWhitespacesAfterWord,
  getWhitespacesBeforeWord
} from './helpers'
import { $challenger, $challengerStatus, ChallengerStatus } from './store'

import { Button, Box } from '@/components/shared'
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
  const inputRef = createRef<HTMLInputElement>()
  const codeRef = createRef<HTMLElement>()
  const { paused, started } = useStore($challengerStatus)
  console.log(paused, started)

  const tokens = useStore($challenger)
  const classes = useStyles()

  const setTokens = useEvent(tokensChanged)

  const setStatus = useEvent(statusChanged)
  const toggleStatus = useEvent(statusToggled)

  const actions = {
    status: {
      paused: {
        toggle: () => toggleStatus('paused')
      },
      started: {
        toggle: () => toggleStatus('started')
      },
      set: (payload: Partial<ChallengerStatus>) => setStatus(payload)
    }
  }

  useEffect(() => {
    console.log(tokens)
  }, [tokens])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { paused, started } = $challengerStatus.getState()

      if (e.key === 'Enter' && !paused) {
        e.preventDefault()

        actions.status.set({ started: true })
        inputRef.current?.focus()
      } else if (e.key === ' ' && started) {
        e.preventDefault()
        actions.status.paused.toggle()
      }
    }

    document.addEventListener('keydown', handler)

    const onUnmount = () => {
      actions.status.set({ paused: false, started: false })
      document.removeEventListener('keydown', handler)
    }

    return () => onUnmount()
  }, [])

  const getSplittedTokens = () => {
    const tokenCollection = codeRef.current?.children

    if (tokenCollection) {
      const collectionArr = Object.values(tokenCollection)
      for (const el of collectionArr) {
        const isTokenContainsWhitespace =
          el.textContent?.match(/[A-Za-z]/) && el.textContent.includes(WHITESPACE)

        if (el.textContent && isTokenContainsWhitespace) {
          if (el.textContent.startsWith(WHITESPACE)) {
            const whitespaceBeforeElement = document.createElement('span')
            const whitespacesBeforeWord = getWhitespacesBeforeWord(el.textContent)
            whitespaceBeforeElement.textContent = whitespacesBeforeWord

            el.before(whitespaceBeforeElement)
          }

          if (el.textContent.endsWith(WHITESPACE)) {
            const whitespaceAfterWordElement = document.createElement('span')
            const whitespaceAfterWord = getWhitespacesAfterWord(el.textContent)
            whitespaceAfterWordElement.textContent = whitespaceAfterWord

            el.after(whitespaceAfterWord)
          }

          el.textContent = el.textContent.replaceAll(WHITESPACE, '')
        }
      }

      const filteredTokenCollection = filterTokenWithIndentSpaces(collectionArr)

      for (const filteredToken of filteredTokenCollection) {
        if (filteredToken.textContent) {
          const isTokenValidToSplit =
            filteredToken.textContent !== '\n' &&
            filteredToken.textContent.length > 1 &&
            !filteredToken.textContent.includes(' ')

          if (isTokenValidToSplit) {
            const splittedToken = filteredToken.textContent.split('')
            filteredToken.textContent = null

            for (const token of splittedToken) {
              const splittedTokenLetterElement = document.createElement('span')
              splittedTokenLetterElement.textContent = token
              splittedTokenLetterElement.style.cssText = 'color: #fff;'

              filteredToken.appendChild(splittedTokenLetterElement)
            }
          }
        }
      }

      return filteredTokenCollection
    }
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault()
    console.log('keydown')
  }

  const onFocus: React.FocusEventHandler<HTMLInputElement> = e => {
    if (!started) {
      const splittedTokens = getSplittedTokens()
      if (splittedTokens) {
        setTokens(splittedTokens)
      }
    }
  }

  return (
    <Box
      sx={{ position: 'relative' }}
      onClick={() => inputRef.current?.focus()}
    >
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
          fontFamily: 'monospace'
        }}
        language='js'
        style={dracula}
      >
        {codeSample}
      </SyntaxHighlighter>
      <input
        ref={inputRef}
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
          zIndex: 10,
          cursor: 'default'
        }}
        tabIndex={-1}
        type='text'
        onChange={handleChange}
        onFocus={onFocus}
      />
      {(!started || paused) && (
        <div
          className={classes.previewMask}
          onClick={() => actions.status.set({ started: true })}
        >
          <Box className={classes.previewMaskInner}>
            <Button sx={{ padding: '12px 30px', fontSize: 20 }}>
              {paused && 'Press space to unpause'}
              {!started && 'Press enter to start typing'}
            </Button>
          </Box>
        </div>
      )}
    </Box>
  )
}
