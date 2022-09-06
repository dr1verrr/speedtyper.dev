import { createUseStyles } from 'react-jss'

import { Theme } from '@/services/theme/types'
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

type ChallengerStyledProps = ChallengerInputProps & {
  finished: boolean
  started: boolean
  paused: boolean
  focused: boolean
}

const useStyles = {
  challenger: createUseStyles<ChallengerRuleNames, ChallengerStyledProps, Theme>({
    previewMask: ({ theme }) => ({
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
      '&:hover': {
        background: rgba(theme.highlighter.accent, 0.1)
      },
      '&:hover $previewMaskButton': {
        background: rgba(theme.highlighter.accent, 0.75),
        color: rgba(theme.highlighter.color, 0.75),
        borderColor: rgba(theme.highlighter.color, 0.75)
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
      background: '#b794f4',
      borderColor: theme.highlighter.color
    }),
    highlighter: ({ theme }) => ({
      color: theme.highlighter.color,
      background: theme.highlighter.background,
      fontSize: 18,
      fontFamily: 'monospace',
      lineHeight: 1.4,
      whiteSpace: 'pre-wrap',
      margin: 0,
      maxHeight: '100%',
      padding: 50,
      paddingBottom: 50,
      wordBreak: 'break-all',
      marginTop: 50,
      tabSize: 2,
      border: `1px solid ${rgba(theme.highlighter.color, 0.1)}`
    }),
    highlighterWrapper: ({ theme, paused }) => ({
      transition: 'filter 0.2s ease',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto',
      width: '100%',
      background: rgba(theme.highlighter.background, 0.86),
      filter: paused ? 'blur(7px)' : 'none'
    }),
    codeLeft: ({ theme }) => ({
      color: rgba(theme.highlighter.color, 0.75)
    }),
    wrapper: ({ theme, focused }) => ({
      position: 'relative',
      maxHeight: '55vh',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
      background: rgba(theme.highlighter.color, 0.07),
      outline: !focused ? `2px dashed ${rgba(theme.highlighter.color, 0.7)}` : 'none',
      borderRadius: 10,
      overflow: 'hidden',
      border: `1px solid ${rgba(theme.highlighter.color, 0.1)}`
    }),
    cursor: ({ theme, focused }) => ({
      //color: focused ? theme.highlighter.color : rgba(theme.highlighter.background, 0.75),
      color: rgba(theme.highlighter.background, 1),
      background: rgba(theme.highlighter.color, 0.85),
      //outline: focused ? `1px solid ${theme.highlighter.color}` : 'none',
      display: 'inline-block',
      '&.new-row': {
        display: 'inline',
        position: 'relative',
        outline: 'none',
        color: theme.highlighter.color
      },
      '&.new-row:after': {
        width: '0',
        height: '0',
        position: 'absolute',
        content: '"↵"',
        whiteSpace: 'nowrap',
        right: -3,
        bottom: 0,
        top: 0
      }
    })
  })
}

export { useStyles }
