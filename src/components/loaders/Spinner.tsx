import { Theme } from '@/services/theme/types'
import { CSSProperties } from 'react'
import { createUseStyles } from 'react-jss'

type SpinnerProps = {
  size?: number
  sx?: CSSProperties
}

type RuleNames = 'spinner' | '@keyframes spinner'

const useStyles = createUseStyles<RuleNames, SpinnerProps, Theme>({
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
    width: ({ size }) => size,
    height: ({ size }) => size,
    '&:after': {
      content: '',
      display: 'block',
      borderRadius: '50%',
      width: '0',
      height: '0',
      margin: '8px',
      boxSizing: 'border-box',
      border: '32px solid #fff',
      borderColor: '#fff transparent #fff transparent',
      animation: '$spinner 1.2s infinite'
      //animationName: '$spinner',
      //animationDuration: '1.2s',
      //animationIterationCount: 'infinite'
    }
  }
})

export default function Spinner({ size = 80, sx, ...props }: SpinnerProps) {
  const classes = useStyles({ size, ...props })

  return (
    <div
      className={classes.spinner}
      style={sx}
    ></div>
  )
}
