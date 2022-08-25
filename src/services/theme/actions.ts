import { Theme } from './types'
import { useTheme as useJssTheme } from 'react-jss'

const useTheme = () => useJssTheme<Theme>()

export { useTheme }
