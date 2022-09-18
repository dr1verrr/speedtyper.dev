import { useId } from 'react'
import { createUseStyles } from 'react-jss'

import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'
import { rgba } from '@/utils/styles'

type CheckBoxProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type RuleNames = 'container' | 'checkbox' | 'wrapper'

const useStyles = createUseStyles<RuleNames, CheckBoxProps, Theme>({
  checkbox: {
    display: 'none',
    '&:checked + label div:before': {
      left: '1.5em',
      background: ({ theme }) => rgba(theme.input.text, 0.85),
      rotate: '45deg'
    },
    '&:hover + label div:first-child': {
      borderColor: ({ theme }) => theme.input.border.hover
    }
  },
  container: ({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
    minWidth: '2.6em',
    height: '1.2em',
    border: `2px solid ${theme.divider}`,
    borderRadius: '1em',
    background: theme.input.bg,
    cursor: 'pointer',
    '&:before': {
      transition: 'left .1s ease',
      content: "''",
      borderRadius: '1em',
      position: 'absolute',
      width: '0.8em',
      height: '0.8em',
      left: '0.3em',
      top: '0.2em',
      background: rgba(theme.common.textColors.secondary, 0.85)
    }
  }),
  wrapper: ({ theme }) => ({
    display: 'inline-block',
    maxWidth: 'fit-content'
  })
})

export default function CheckBox({ children, ...props }: CheckBoxProps) {
  const theme = useTheme()
  const classes = useStyles({ theme })
  const inputId = useId()

  return (
    <div className={classes.wrapper}>
      <input
        className={classes.checkbox}
        id={inputId}
        type='checkbox'
        {...props}
      />
      <label
        htmlFor={props.id || inputId}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '5px 0'
        }}
      >
        <div className={classes.container} />
        {children && (
          <div
            style={{
              display: 'inline-block',
              userSelect: 'none',
              flex: 1,
              cursor: 'pointer'
            }}
          >
            {children}
          </div>
        )}
      </label>
    </div>
  )
}
