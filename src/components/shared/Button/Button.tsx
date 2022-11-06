import clsx from 'clsx'
import React from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { rgba } from '@/utils/styles'

type RuleNames = 'button'
type Variants = 'primary' | 'action' | 'default' | 'info'

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

export type { Variants, ButtonProps }

const useStyles = createUseStyles<RuleNames, ButtonStyledProps, Theme>({
  button: {
    transition: 'background .2s ease',
    background: ({ theme, variant }) => theme.button.variant[variant].bg,
    color: ({ theme, variant }) => rgba(theme.button.variant[variant].text, 0.9),
    border: ({ theme, variant }) => `2px solid ${theme.button.variant[variant].border}`,
    fontSize: 16,
    padding: '7px 10px',
    borderRadius: 10,
    cursor: 'pointer',
    '&:hover': {
      background: ({ theme }) => theme.action.hover
    }
  }
})

export default function Button({
  variant = 'default',
  className,
  sx,
  ...props
}: ButtonProps) {
  const theme = useTheme()
  const classes = useStyles({ ...props, variant, theme })

  return (
    <button
      className={clsx(classes.button, className)}
      style={sx}
      type='button'
      {...props}
    >
      {props.children}
    </button>
  )
}
