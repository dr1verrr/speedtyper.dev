import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import React, { ReactNode } from 'react'
import { createUseStyles } from 'react-jss'

type RuleNames = 'button'
type Variants = 'primary' | 'action' | 'default'

type ButtonProps = {
  variant?: Variants
  sx?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}

type ButtonStyledProps = Omit<ButtonProps, 'variant'> & {
  variant: Variants
}

const useStyles = createUseStyles<RuleNames, ButtonStyledProps, Theme>({
  button: {
    background: ({ theme, variant }) => theme.button.variant[variant].bg,
    color: ({ theme, variant }) => theme.button.variant[variant].text,
    border: 0,
    padding: '7px 10px',
    borderRadius: 10,
    cursor: 'pointer'
  }
})

export default function Button({ variant = 'default', ...props }: ButtonProps) {
  const theme = useTheme()
  const classes = useStyles({ ...props, variant, theme })

  return (
    <button
      className={classes.button}
      {...props}
      style={props.sx}
    >
      {props.children}
    </button>
  )
}
