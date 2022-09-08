import React, { ReactNode } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { rgba } from '@/utils/styles'

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
  button: ({ theme, styledSize, variant }) => ({
    transition: 'background .2s ease',
    minWidth: styledSize,
    minHeight: styledSize,
    maxHeight: styledSize,
    maxWidth: styledSize,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
    height: '100%',
    background: theme.button.variant[variant].bg,
    color: rgba(theme.button.variant[variant].text, 0.9),
    border: `2px solid ${theme.button.variant[variant].border}`,
    padding: 7,
    borderRadius: '100%',
    cursor: 'pointer',
    '&:hover': {
      background: theme.action.hover
    },
    '& svg': {
      fill: rgba(theme.common.text, 0.9)
    }
  })
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
