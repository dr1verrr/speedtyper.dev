import { createContext, useContext } from 'react'

const lightTheme = {
  mode: 'light',
  button: {
    bg: '',
    text: '',
    variant: {
      primary: {
        bg: '#000',
        text: '#fff'
      },
      action: {
        bg: '#22a5f1',
        text: '#000'
      }
    }
  },
  common: {
    bg: '',
    text: ''
  },
  status: {
    ghost: ''
  }
}

const darkTheme = {
  mode: 'dark',
  button: {
    bg: '',
    text: '',
    variant: {
      primary: {
        bg: '#000',
        text: '#fff'
      },
      action: {
        bg: '#22a5f1',
        text: '#000'
      }
    }
  },
  common: {
    bg: '',
    text: ''
  },
  status: {
    ghost: ''
  }
}

const defaultTheme = lightTheme

const ThemeContext = createContext({ theme: defaultTheme })

const useTheme = () => useContext(ThemeContext)

export { defaultTheme, lightTheme, darkTheme, useTheme, ThemeContext }
