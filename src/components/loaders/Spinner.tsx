import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { CSSProperties } from 'react'
import { createUseStyles } from 'react-jss'

type SpinnerProps = {
  size?: number
  sx?: CSSProperties
}

type RuleNames = 'spinner' | '@keyframes spinner'

type SpinnerStyledProps = Omit<SpinnerProps, 'size'> & {
  size: number
}

const useStyles = createUseStyles<RuleNames, SpinnerStyledProps, Theme>({
  '@keyframes spinner': {
    '0%': {
      transform: 'rotate(0)',
      animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
    },
    '50%': {
      transform: 'rotate(900deg)',
      animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    '100%': {
      transform: 'rotate(1800deg)'
    }
  },
  spinner: {
    display: 'inline-block',
    position: 'relative',
    width: ({ size }) => size + size * 2,
    height: ({ size }) => size + size * 2,
    '&:after': {
      content: '""',
      display: 'block',
      borderRadius: '50%',
      width: 0,
      height: 0,
      margin: 8,
      boxSizing: 'border-box',
      border: ({ theme, size }) => `${size}px solid ${theme.common.text}`,
      borderColor: ({ theme }) =>
        `${theme.common.text} transparent ${theme.common.text} transparent`,
      animation: '$spinner 1.2s infinite'
    }
  }
})

export default function Spinner({ size = 30, sx, ...props }: SpinnerProps) {
  const theme = useTheme()
  const classes = useStyles({ size, theme, ...props })

  return (
    <div
      className={classes.spinner}
      style={sx}
    ></div>
  )
}
