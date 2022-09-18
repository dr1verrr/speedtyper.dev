import { forwardRef } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'

interface TextFieldProps
  extends React.AllHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  sx?: React.CSSProperties
  multiline?: boolean
}

type RuleNames = 'input'

const useStyles = createUseStyles<RuleNames, TextFieldProps, Theme>({
  input: ({ theme }) => ({
    display: 'inline-block',
    transition: 'background .2s ease',
    border: `2px solid ${theme.input.border.color}`,
    fontSize: 'inherit',
    padding: 10,
    background: theme.input.bg,
    borderRadius: 5,
    color: theme.input.text,
    outline: 'none',
    '&:autofill': {
      background: theme.input.bg
    },
    '&:hover,  &:focus': {
      borderColor: theme.input.border.hover
    },
    '&:invalid': {
      borderColor: 'red'
    }
  })
})

const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  ({ sx, multiline = false, ...props }, ref) => {
    const theme = useTheme()
    const classes = useStyles({ theme, ...props })

    if (multiline) {
      return (
        <textarea
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
          className={classes.input}
          style={sx}
          {...props}
        />
      )
    }

    return (
      <input
        ref={ref as React.ForwardedRef<HTMLInputElement>}
        className={classes.input}
        style={sx}
        {...props}
      />
    )
  }
)

export default TextField
