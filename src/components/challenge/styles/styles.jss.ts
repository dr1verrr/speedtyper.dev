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
  | 'highlighterInner'

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
        background: rgba(theme.highlighter.hover, 0.1)
      },
      '&:hover $previewMaskButton': {
        //background: rgba(theme.highlighter.accent, 0.75),
        //color: rgba(theme.highlighter.color, 0.75),
        //borderColor: rgba(theme.highlighter.color, 0.75)
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
      position: 'relative',
      fontSize: 18,
      fontFamily: 'monospace',
      lineHeight: 1.4,
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
    highlighterWrapper: ({ theme, paused }) => ({
      position: 'relative',
      transition: 'filter 0.2s ease',
      width: '100%',
      overflow: 'auto',
      maxHeight: '55vh',
      filter: paused ? 'blur(7px)' : 'none',
      display: 'flex',
      justifyContent: 'center'
    }),
    codeLeft: ({ theme }) => ({
      color: rgba(theme.highlighter.color, 0.75)
    }),
    wrapper: ({ theme, focused }) => ({
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
      background: theme.highlighter.background,
      overflow: 'hidden',
      outline: !focused ? `1px dashed ${rgba(theme.highlighter.color, 0.7)}` : 'none',
      borderRadius: 15,
      border: `1px solid ${theme.divider}`
    }),
    cursor: ({ theme, focused }) => ({
      color: rgba(theme.highlighter.background, 1),
      background: rgba(theme.highlighter.color, 0.85),
      '&.new-row': {
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
