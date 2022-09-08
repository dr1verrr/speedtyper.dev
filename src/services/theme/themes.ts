const lightTheme = {
  mode: 'light',
  input: {
    bg: '#f5f5f5',
    hover: 'blue',
    text: '#333',
    border: {
      color: '#dcdcdc',
      hover: '#333'
    }
  },
  action: {
    hover: '#ececec'
  },
  divider: '#dcdcdc',
  button: {
    variant: {
      default: {
        bg: '#f5f5f5',
        text: '#333',
        border: '#dcdcdc'
      },
      primary: {
        bg: '#000',
        text: '#fff',
        border: '#ccc'
      },
      action: {
        bg: '#22a5f1',
        text: '#000',
        border: '#ccc'
      }
    }
  },
  common: {
    bg: '#fff',
    text: '#000',
    border: '#ccc',
    textColors: {
      primary: '#000',
      secondary: '#7a7a7a'
    }
  },
  status: {
    ghost: '#ccc'
  },
  highlighter: {
    background: '#F5F5F5',
    color: '#000',
    hover: '#333',
    progressBar: {
      filled: {
        color: '#212121'
      },
      noFilled: {
        color: '#dcdcdc'
      }
    }
  }
}

const darkTheme = {
  mode: 'dark',
  input: {
    hover: 'blue',
    bg: '#222',
    text: '#fff',
    border: {
      color: '#3e3e3e',
      hover: '#ccc'
    }
  },
  action: {
    hover: '#333'
  },
  divider: '#3e3e3e',
  button: {
    variant: {
      default: {
        bg: '#222',
        text: '#fff',
        border: '#3e3e3e'
      },
      primary: {
        bg: '#000',
        text: '#fff',
        border: ''
      },
      action: {
        bg: '#22a5f1',
        text: '#000',
        border: ''
      }
    }
  },
  common: {
    bg: '#333',
    text: '#fff',
    border: '#555',
    textColors: {
      primary: '#fff',
      secondary: '#919191'
    }
  },
  status: {
    ghost: ''
  },
  highlighter: {
    background: '#222',
    color: '#fff',
    hover: '#ccc',
    progressBar: {
      filled: {
        color: '#e1e1e1'
      },
      noFilled: {
        color: '#393939'
      }
    }
  }
}

const defaultTheme = lightTheme

export { defaultTheme, lightTheme, darkTheme }
