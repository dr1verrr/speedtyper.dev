import { useTheme } from '@/services/theme/actions'
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
  const theme = useTheme()

  return (
    <div
      style={{ background: theme.common.bg, ...sx }}
      {...props}
    >
      {children}
    </div>
  )
}
