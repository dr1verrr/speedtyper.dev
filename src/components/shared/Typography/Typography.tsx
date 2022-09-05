import React, { createElement, ReactNode } from 'react'

type TypographyProps = {
  className?: string
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'body-lg'
  sx?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}

export default function Typography({
  variant = 'body',
  sx,
  children,
  ...props
}: TypographyProps) {
  const style = sx

  if (variant === 'body' || variant === 'body-lg') {
    return (
      <span
        style={sx}
        {...props}
      >
        {children}
      </span>
    )
  }

  return createElement(variant, { style, children, ...props })
}
