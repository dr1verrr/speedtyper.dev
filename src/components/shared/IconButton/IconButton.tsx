import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import React, { ReactNode } from 'react'
import { createUseStyles } from 'react-jss'

type RuleNames = 'button'

type Variants = 'primary' | 'action' | 'default'

type IconButtonProps = {
  variant?: Variants
  sx?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}

type IconButtonStyledProps = Omit<IconButtonProps, 'variant'> & {
  variant: Variants
}

export type { IconButtonProps }

const useStyles = createUseStyles<RuleNames, IconButtonStyledProps, Theme>({
  button: {
    background: ({ theme, variant }) => theme.button.variant[variant].bg,
    color: ({ theme, variant }) => theme.button.variant[variant].text,
    border: 0,
    padding: '1%',
    borderRadius: '100%',
    cursor: 'pointer',
    '& svg': {
      width: '100% !important',
      height: 'auto !important',
      fill: 'inherit'
    }
  }
})

export default function IconButton({
  variant = 'default',
  sx,
  ...props
}: IconButtonProps) {
  const theme = useTheme()
  const classes = useStyles({ ...props, variant, theme })

  return (
    <button
      className={classes.button}
      {...props}
      style={{ fill: theme.button.variant[variant].text, ...sx }}
    >
      {props.children}
    </button>
  )
}
