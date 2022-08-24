import { useTheme as useJssTheme } from 'react-jss'

import { Theme } from './types'

const useTheme = () => useJssTheme<Theme>()

export { useTheme }
