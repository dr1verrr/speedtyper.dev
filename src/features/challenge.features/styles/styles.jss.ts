import { createUseStyles } from 'react-jss'

import { Theme } from '@/services/theme/types'
import { PreferencesStore } from '@/store/preferences/store'
import { rgba } from '@/utils/styles'

import { ChallengerInputProps } from '../types'

type ChallengerRuleNames =
  | 'previewMask'
  | 'hiddenInput'
  | 'previewMaskButton'
  | 'highlighter'
  | 'cursor'
  | 'codeLeft'
  | 'wrapper'
  | 'highlighterWrapper'
  | 'highlighterInner'
  | '@keyframes gradient'

type ChallengerStyledProps = ChallengerInputProps & {
  finished: boolean
  started: boolean
  paused: boolean
  focused: boolean
  preferences: PreferencesStore
}

type GetCursorColorProps = {
  focused: boolean
  started: boolean
  theme: Theme
}

const HELPERS = {
  getCursorColor: ({ focused, started, theme }: GetCursorColorProps) => {
    let color = ''

    if (started) {
      if (focused) {
        color = theme.highlighter.cursor.color
      } else {
        color = theme.highlighter.color
      }
    } else {
      color = rgba(theme.highlighter.color, 0.85)
    }

    return { color }
  }
}

const useStyles = {
  challenger: createUseStyles<ChallengerRuleNames, ChallengerStyledProps, Theme>({
    '@keyframes gradient': {
      '0%': {
        backgroundPosition: '0% 50%'
      },
      '50%': {
        backgroundPosition: '100% 50%'
      },
      '100%': {
        backgroundPosition: '0% 50%'
      }
    },
    previewMask: ({ theme }) => ({
      transition: 'background 0.2s ease',
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
      '&:hover': {
        background: rgba(theme.highlighter.hover, 0.1)
      }
    }),
    hiddenInput: {
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
    },
    previewMaskButton: ({ theme }) => ({
      padding: '12px 30px',
      fontSize: 20,
      borderColor: 'palevioletred'
    }),
    highlighter: ({ theme, preferences }) => ({
      background: theme.highlighter.background,
      position: 'relative',
      fontSize: preferences.challenger.fontSize,
      fontFamily: preferences.challenger.fontFamily + ', monospace',
      fontVariantLigatures: 'none',
      lineHeight: 1.45,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
      tabSize: 2,
      borderLeft: `1px solid ${theme.divider}`,
      borderRight: `1px solid ${theme.divider}`,
      margin: 'auto auto'
    }),
    highlighterInner: ({ theme }) => ({
      padding: '25px 50px'
    }),
    highlighterWrapper: ({ theme, paused, started }) => ({
      position: 'relative',
      transition: 'filter 0.1s ease',
      width: '100%',
      overflow: 'hidden',
      maxHeight: '50vh',
      filter: (paused && 'blur(12.5px)') || 'none',
      display: 'flex',
      justifyContent: 'center'
    }),
    codeLeft: ({ theme }) => ({
      color: rgba(theme.highlighter.color, 0.75)
    }),
    wrapper: ({ theme, focused, started, paused }) => ({
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
      background: theme.highlighter.background,
      overflow: 'hidden',
      outline:
        !focused && started && !paused
          ? `1px dashed ${rgba(theme.highlighter.color, 0.7)}`
          : 'none',
      borderRadius: 15,
      border: `1px solid ${theme.divider}`
    }),
    cursor: ({ theme, focused, preferences, started, paused }) => ({
      color: HELPERS.getCursorColor({ focused, started, theme }).color,
      background: focused ? theme.highlighter.cursor.bg : theme.highlighter.background,
      position: 'relative',
      scrollMargin: '35px',
      '&.new-row': {
        background: 'none',
        outline: 'none',
        color: theme.highlighter.color
      },
      '&.new-row:after': {
        position: 'absolute',
        content: '"↵"',
        whiteSpace: 'nowrap',
        right: -(preferences.challenger.fontSize + 5),
        bottom: 0,
        top: 0
      }
    })
  })
}

export { useStyles }
