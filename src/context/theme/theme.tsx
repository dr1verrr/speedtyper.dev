import { ReactNode } from 'react'
import { ThemeContext } from './constants'
import { Theme } from './types'

type ThemeProviderProps = {
  children?: ReactNode
  theme: Theme
}

const ThemeProvider = ({ children, theme }: ThemeProviderProps) => {
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
