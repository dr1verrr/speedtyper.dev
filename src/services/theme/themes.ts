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
  info: '#afeeee',
  action: {
    hover: '#ececec'
  },
  divider: '#dcdcdc',
  button: {
    variant: {
      default: {
        bg: '#f5f5f5',
        text: '#333',
        border: '#dcdcdc',
        svg: '#333'
      },
      primary: {
        bg: '#fff',
        text: '#333',
        border: '#55affa',
        svg: '#fff'
      },
      action: {
        bg: '#db7093',
        text: '#000',
        border: '#333',
        svg: '#000'
      },
      info: {
        bg: '#55affa',
        text: '#333',
        border: '#55affa',
        svg: '#999'
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
  info: '#afeeee',
  divider: '#3e3e3e',
  button: {
    variant: {
      default: {
        bg: '#222',
        text: '#fff',
        border: '#3e3e3e',
        svg: '#fff'
      },
      primary: {
        bg: '#222',
        text: '#fff',
        border: '#3857cb',
        svg: '#fff'
      },
      action: {
        bg: '#db7093',
        text: '#000',
        border: '#dad8d6',
        svg: '#000'
      },
      info: {
        bg: '#3857cb',
        text: '#dad8d6',
        border: '#3857cb',
        svg: '#000'
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
