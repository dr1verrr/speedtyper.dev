const lightTheme = {
  mode: 'light',
  input: {
    border: '#ccc',
    hover: 'blue'
  },
  action: {
    hover: '#333'
  },
  button: {
    variant: {
      default: {
        bg: '#000',
        text: '#fff'
      },
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
    bg: '#fff',
    text: '#000',
    border: '#ccc'
  },
  status: {
    ghost: '#ccc'
  }
}

const darkTheme = {
  mode: 'dark',
  input: {
    border: '#ccc',
    hover: 'blue'
  },
  action: {
    hover: '#ccc'
  },
  button: {
    variant: {
      default: {
        bg: '#fff',
        text: '#000'
      },
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
    bg: '#333',
    text: '#fff',
    border: '#555'
  },
  status: {
    ghost: ''
  }
}

const defaultTheme = lightTheme

export { defaultTheme, lightTheme, darkTheme }
