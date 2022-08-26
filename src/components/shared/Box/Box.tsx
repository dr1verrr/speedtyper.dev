import React, { CSSProperties, ReactNode } from 'react'

type BoxProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  sx?: CSSProperties
  children?: ReactNode
}

export type { BoxProps }

export default function Box({ sx, children, ...props }: BoxProps) {
  return (
    <div
      style={{ ...sx }}
      {...props}
    >
      {children}
    </div>
  )
}
