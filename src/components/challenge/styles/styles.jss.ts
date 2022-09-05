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

const useStyles = {
  challenger: createUseStyles<ChallengerRuleNames, ChallengerInputProps, Theme>({
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
      fontSize: 17,
      fontWeight: 300,
      //padding: '25px 50px',
      //paddingLeft: 25,
      fontFamily: 'Hack',
      lineHeight: 1.4,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
      margin: 0
    }),
    cursor: ({ theme }) => ({
      background: theme.highlighter.accent,
      color: '#000',
      outline: `1px solid ${'#000'}`,
      display: 'inline-block',
      '&.new-row': {
        display: 'inline',
        position: 'relative',
        outline: 'none',
        color: theme.highlighter.color
      },
      '&.new-row:after': {
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'absolute',
        content: '"↵"',
        whiteSpace: 'nowrap',
        right: -5,
        bottom: 5,
        top: 0
      }
    })
  })
}

export { useStyles }
