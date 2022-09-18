import { CSSProperties, forwardRef, ReactNode } from 'react'
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

const useStyles = createUseStyles<RuleNames, StackStyledProps>({
  stack: ({ direction, spacing }) => ({
    display: 'flex',
    flexDirection: direction,
    gap: spacing
  })
})

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ children, sx, direction = 'row', spacing, ...props }, ref) => {
    const classes = useStyles({ sx, direction, spacing })
    return (
      <div
        ref={ref}
        className={classes.stack}
        style={sx}
        {...props}
      >
        {children}
      </div>
    )
  }
)

export default Stack
