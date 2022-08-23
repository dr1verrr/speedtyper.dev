import { useTheme } from '@/context/theme/constants'
import React, { ReactNode } from 'react'

type ButtonProps = {
  variant?: 'primary' | 'action'
  sx?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}

export default function Button({
  sx,
  onClick,
  children,
  variant = 'primary'
}: ButtonProps) {
  const { theme } = useTheme()
  const buttonProps = theme.button.variant[variant]

  return (
    <button
      onClick={onClick}
      style={{ background: buttonProps.bg, color: buttonProps.text, ...sx }}
    >
      {children}
    </button>
  )
}
