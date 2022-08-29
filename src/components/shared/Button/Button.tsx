import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import React from 'react'
import { createUseStyles } from 'react-jss'

type RuleNames = 'button'
type Variants = 'primary' | 'action' | 'default'

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: Variants
  sx?: React.CSSProperties
}

type ButtonStyledProps = Omit<ButtonProps, 'variant'> & {
  variant: Variants
}

const useStyles = createUseStyles<RuleNames, ButtonStyledProps, Theme>({
  button: {
    transition: 'background .2s ease',
    background: ({ theme, variant }) => theme.button.variant[variant].bg,
    color: ({ theme, variant }) => theme.button.variant[variant].text,
    border: ({ theme, variant }) => `2px solid ${theme.button.variant[variant].border}`,
    padding: '7px 10px',
    borderRadius: 10,
    cursor: 'pointer',
    '&:hover': {
      background: ({ theme }) => theme.action.hover
    }
  }
})

export default function Button({ variant = 'default', ...props }: ButtonProps) {
  const theme = useTheme()
  const classes = useStyles({ ...props, variant, theme })

  return (
    <button
      type='button'
      className={classes.button}
      {...props}
      style={{ ...props.style, ...props.sx }}
    >
      {props.children}
    </button>
  )
}
