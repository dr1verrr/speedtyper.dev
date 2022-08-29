import React, { CSSProperties, forwardRef, ReactNode } from 'react'

type BoxProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  sx?: CSSProperties
  children?: ReactNode
}

export type { BoxProps }

export default forwardRef<HTMLDivElement, BoxProps>(({ sx, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      style={{ ...sx }}
      {...props}
    >
      {children}
    </div>
  )
})
