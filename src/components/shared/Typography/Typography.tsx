import { createElement, ReactNode } from 'react'

type TypographyProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'body-lg'
  sx?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}

export default function Typography({ variant = 'body', sx, children }: TypographyProps) {
  const style = sx

  if (variant !== 'body' && variant !== 'body-lg') {
    return <span style={sx}>{children}</span>
  }

  return createElement(variant, { style, children })
}
