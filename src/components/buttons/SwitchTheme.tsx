import { IconButtonProps } from '../shared/IconButton'
import DarkTheme from '@/components/icons/DarkTheme'
import LightTheme from '@/components/icons/LightTheme'
import IconButton from '@/components/shared/IconButton'
import { useTheme } from '@/services/theme/actions'

type SwitchThemeProps = IconButtonProps

export default function SwitchTheme({ variant = 'default', ...props }: SwitchThemeProps) {
  const theme = useTheme()

  return (
    <IconButton {...props}>
      {theme.mode === 'light' ? <LightTheme /> : <DarkTheme />}
    </IconButton>
  )
}
