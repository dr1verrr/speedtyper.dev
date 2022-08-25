import { Theme } from '@/services/theme/types'
import { CSSProperties, ReactNode } from 'react'
import { createUseStyles } from 'react-jss'

type StackProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  sx?: CSSProperties
  children?: ReactNode
  direction?: 'row' | 'column'
  spacing?: number
}

type RuleNames = 'stack'

type StackStyledProps = Omit<StackProps, 'direction'> &
  Required<Pick<StackProps, 'direction'>>

const useStyles = (props: StackStyledProps) =>
  createUseStyles<RuleNames, StackStyledProps, Theme>({
    stack: {
      display: 'flex',
      flexDirection: props.direction,
      gap: props.spacing,
      ...props.sx
    }
  })(props)

export default function Stack({
  children,
  sx,
  direction = 'row',
  spacing,
  ...props
}: StackProps) {
  const classes = useStyles({ sx, direction, spacing })

  return (
    <div
      className={classes.stack}
      {...props}
    >
      {children}
    </div>
  )
}
