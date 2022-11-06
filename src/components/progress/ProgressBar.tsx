import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'

import { Box } from '../shared'

type RuleNames = 'progressBar' | 'progressBarWrapper'

type ProgressBarProps = {
  value: number
  showLabel?: boolean
  style?: React.CSSProperties
}

export type { ProgressBarProps }

const useStyles = createUseStyles<RuleNames, Omit<ProgressBarProps, 'style'>, Theme>({
  progressBar: ({ theme, value }) => ({
    width: '100%',
    padding: 1.5,
    position: 'relative',
    borderRadius: 30,
    background: theme.highlighter.progressBar.noFilled,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::after': {
      content: '""',
      transition: 'translate 0.2s ease',
      translate: `-${100 - value}% 0`,
      background: theme.highlighter.progressBar.filled.color,
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: 'inherit'
    }
  }),
  progressBarWrapper: ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: 7,
    background: theme.highlighter.background,
    overflow: 'hidden'
  })
})

export default function ProgressBar({
  value,
  showLabel = true,
  style
}: ProgressBarProps) {
  const theme = useTheme()
  const classes = useStyles({ theme, value, showLabel })

  return (
    <Box
      className={classes.progressBarWrapper}
      style={style}
    >
      <Box className={classes.progressBar}></Box>
    </Box>
  )
}
