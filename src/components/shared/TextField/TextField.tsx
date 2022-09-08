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
    zIndex: 1,
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

export default function TextField({ sx, multiline = false, ...props }: TextFieldProps) {
  const theme = useTheme()
  const classes = useStyles({ theme, ...props })

  if (multiline) {
    return (
      <textarea
        className={classes.input}
        {...props}
        style={sx}
      />
    )
  }

  return (
    <input
      className={classes.input}
      style={sx}
      {...props}
    />
  )
}
