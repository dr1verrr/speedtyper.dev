import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { ReactNode } from 'react'
import { createUseStyles } from 'react-jss'

interface TextFieldProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  sx?: React.CSSProperties
  children?: ReactNode
}

type RuleNames = 'input'

const useStyles = createUseStyles<RuleNames, TextFieldProps, Theme>({
  input: {
    display: 'inline-block',
    zIndex: 1,
    transition: 'background .2s ease',
    border: ({ theme }) => `2px solid ${theme.input.border}`,
    fontSize: 'inherit',
    padding: 10,
    borderRadius: 5,
    outline: 'none',
    '&:hover,  &:focus': {
      borderColor: ({ theme }) => theme.input.hover
    },
    '&:invalid': {
      borderColor: 'red !important'
    },
    '&:before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      background: 'red',
      width: 15,
      height: 15,
      top: 0,
      left: 0
    }
  }
})

export default function TextField({ sx, ...props }: TextFieldProps) {
  const theme = useTheme()
  const classes = useStyles({ theme })

  return (
    <input
      className={classes.input}
      style={sx}
      {...props}
    />
  )
}
