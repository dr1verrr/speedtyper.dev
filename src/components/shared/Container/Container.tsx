import React, { ReactNode } from 'react'

type ContainerVariants = 'sm' | 'lg' | 'md'

type ContainerProps = {
  sx?: React.CSSProperties
  maxWidth?: ContainerVariants
  children?: ReactNode
}

const variants = {
  lg: 1440,
  md: 1200,
  sm: 400
}

export default function Container({ sx, maxWidth, children }: ContainerProps) {
  const getMaxWidth = () => {
    if (maxWidth) return variants[maxWidth]
    return 'auto'
  }

  return (
    <div style={{ maxWidth: getMaxWidth(), margin: '0 auto', ...sx }}>{children}</div>
  )
}
