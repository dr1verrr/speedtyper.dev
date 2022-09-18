import clsx from 'clsx'
import React, { ReactNode } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'

type ContainerVariants = 'sm' | 'lg' | 'md'

type ContainerProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  sx?: React.CSSProperties
  maxWidth?: ContainerVariants
  children?: ReactNode
}

const variants = {
  lg: 1440,
  md: 1200,
  sm: 400
}

const getMaxWidth = (maxWidth?: ContainerVariants) => {
  if (maxWidth) return variants[maxWidth]
  return 'auto'
}

const useStyles = createUseStyles<
  'container',
  Omit<ContainerProps, 'children' | 'className' | 'sx'>,
  Theme
>({
  container: ({ theme, maxWidth }) => ({
    margin: '0 auto',
    padding: '0 15px',
    maxWidth: getMaxWidth(maxWidth)
  })
})

export default function Container({
  sx,
  maxWidth,
  children,
  className,
  ...props
}: ContainerProps) {
  const theme = useTheme()
  const classes = useStyles({ theme, maxWidth, ...props })

  return (
    <div
      className={clsx(classes.container, className)}
      style={sx}
      {...props}
    >
      {children}
    </div>
  )
}
