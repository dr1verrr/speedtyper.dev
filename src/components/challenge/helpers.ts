const getWhitespacesBeforeWord = (str: string) => {
  let whitespaces = ''
  let isStart = false

  for (const letter of str) {
    if (letter !== ' ' && !isStart) {
      isStart = true
    }

    if (!isStart) {
      whitespaces += ' '
    }

    if (isStart) {
      if (letter === ' ') break
    }
  }

  return whitespaces
}

const getWhitespacesAfterWord = (str: string) => {
  let whitespaces = ''
  let isStart = false
  let isEnd = false

  for (const letter of str) {
    if (letter !== ' ' && !isStart) {
      isStart = true
    }

    if (isStart) {
      if (letter === ' ') {
        isStart = false
        isEnd = true
      }
    }

    if (isEnd) {
      whitespaces += ' '
    }
  }

  return whitespaces
}

const filterTokenWithIndentSpaces = (tokenCollection: Element[]) => {
  return tokenCollection.filter(el => !el.textContent?.match(/  +/))
}

export { getWhitespacesAfterWord, getWhitespacesBeforeWord, filterTokenWithIndentSpaces }
