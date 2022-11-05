import { CSSProperties } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'

type SpinnerProps = {
  size?: number
  sx?: CSSProperties
}

export type { SpinnerProps }

type RuleNames = 'spinner' | '@keyframes spinner'

type SpinnerStyledProps = Omit<SpinnerProps, 'size'> & {
  size: number
}

const useStyles = createUseStyles<RuleNames, SpinnerStyledProps, Theme>({
  '@keyframes spinner': {
    '0%': {
      top: 8,
      height: 64
    },
    '50%': {
      top: 24,
      height: 32
    },
    '100%': {
      top: 24,
      height: 32
    }
  },
  spinner: {
    display: 'inline-block',
    position: 'relative',
    width: ({ size }) => size,
    height: ({ size }) => size,
    '& div': {
      display: 'inline-block',
      position: 'absolute',
      left: '8px',
      width: '16px',
      background: ({ theme }) => theme.common.text,
      animation: '$spinner 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite'
    },
    '& div:nth-child(1)': {
      left: '8px',
      animationDelay: '-0.24s'
    },
    '& div:nth-child(2)': {
      left: '32px',
      animationDelay: '-0.12s'
    },
    '& div:nth-child(3)': {
      left: '56px',
      animationDelay: 0
    }
  }
})

export default function SpinnerWave({ size = 30, sx, ...props }: SpinnerProps) {
  const theme = useTheme()
  const classes = useStyles({ size, theme, ...props })

  return (
    <div
      className={classes.spinner}
      style={sx}
    >
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
