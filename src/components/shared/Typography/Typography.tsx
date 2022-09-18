import clsx from 'clsx'
import React, { createElement, ReactNode } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { rgba } from '@/utils/styles'

type TypographyProps = {
  className?: string
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'body-lg'
  sx?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
  highlighted?: boolean
  hoverable?: boolean
}

type RuleNames = 'typo'

const useStyles = createUseStyles<RuleNames, TypographyProps, Theme>({
  typo: ({ theme, highlighted }) =>
    !highlighted
      ? {
          color: theme.common.text
        }
      : {
          color: theme.common.textColors.secondary,
          background: rgba(theme.common.textColors.primary, 0.08),
          padding: '3px 5px',
          fontWeight: 600,
          borderRadius: 5,
          cursor: 'default'
        }
})

export default function Typography({
  variant = 'body',
  highlighted = false,
  sx,
  children,
  className,
  hoverable = false,
  ...props
}: TypographyProps) {
  const style = sx
  const theme = useTheme()
  const classes = useStyles({ theme, highlighted, hoverable })

  if (variant === 'body' || variant === 'body-lg') {
    return (
      <span
        className={clsx(className, classes.typo)}
        style={style}
        {...props}
      >
        {children}
      </span>
    )
  }

  return createElement(variant, {
    style,
    children,
    className: clsx(className, classes.typo),
    ...props
  })
}
