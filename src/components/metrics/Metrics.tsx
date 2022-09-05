import { CSSProperties } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'

import { Box, Typography } from '../shared'

type MetricsProps<T extends Array<[string, any]>> = {
  data: T extends infer R ? R : never
  style?: CSSProperties
}

type RuleNames = 'metricName' | 'metricValue' | 'metric'

type StyledMetricsProps = {
  style: CSSProperties | undefined
}

const useStyles = createUseStyles<RuleNames, StyledMetricsProps, Theme>({
  metric: ({ theme }) => ({
    width: '100%',
    background: theme.highlighter.background,
    color: '#fff',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 600
  }),
  metricName: ({ theme }) => ({
    color: theme.highlighter.color
  }),
  metricValue: ({ theme }) => ({
    color: theme.highlighter.accent
  })
})

export default function Metrics<T extends Array<[string, any]>>({
  data,
  style
}: MetricsProps<T>) {
  const theme = useTheme()
  const classes = useStyles({ theme, style })

  return (
    <>
      {data.map((m, idx) => (
        <Box
          key={idx}
          className={classes.metric}
          style={style}
        >
          <Typography className={classes.metricName}>{m[0]}: </Typography>
          <Typography className={classes.metricValue}>{m[1]}</Typography>
        </Box>
      ))}
    </>
  )
}
