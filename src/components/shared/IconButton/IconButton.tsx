import React, { ReactNode } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'

type RuleNames = 'button'

type Variants = 'primary' | 'action' | 'default'

type Sizes = 'small' | 'medium' | 'large'

type IconButtonProps = {
  size?: Sizes
  variant?: Variants
  sx?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}

type IconButtonStyledProps = Omit<IconButtonProps, 'variant'> & {
  variant: Variants
  styledSize: number
}

export type { IconButtonProps }

const useStyles = createUseStyles<RuleNames, IconButtonStyledProps, Theme>({
  button: {
    transition: 'background .2s ease',
    background: ({ theme, variant }) => theme.button.variant[variant].bg,
    color: ({ theme, variant }) => theme.button.variant[variant].text,
    minWidth: ({ styledSize }) => styledSize,
    minHeight: ({ styledSize }) => styledSize,
    maxHeight: ({ styledSize }) => styledSize,
    maxWidth: ({ styledSize }) => styledSize,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
    height: '100%',
    border: ({ theme, variant }) => `2px solid ${theme.button.variant[variant].border}`,
    padding: 7,
    borderRadius: '100%',
    cursor: 'pointer',
    '& svg': {
      width: '100% !important',
      height: 'auto !important',
      fill: 'inherit'
    },
    '&:hover': {
      background: ({ theme }) => theme.action.hover
    }
  }
})

const SIZES = {
  small: 35,
  medium: 60,
  large: 85
}

const getSize = (size: Sizes) => {
  switch (size) {
    case 'small':
      return SIZES.small
    case 'medium':
      return SIZES.medium
    case 'large':
      return SIZES.large

    default:
      return SIZES.small
  }
}

export default function IconButton({
  variant = 'default',
  size = 'small',
  sx,
  ...props
}: IconButtonProps) {
  const theme = useTheme()

  const styledSize = getSize(size)

  const classes = useStyles({ ...props, variant, styledSize, theme })

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
