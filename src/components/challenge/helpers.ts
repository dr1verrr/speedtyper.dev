import { WHITESPACE } from './constants'
import { CurrentToken, SubToken } from './store'

// FIX: missing highlight token (incorrect id)

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
  return tokenCollection.filter(el => {
    if (el.textContent && el.textContent.length > 1) {
      return !el.textContent?.match(/^\s*$/)
    }
    return true
  })
}

const getSplittedTokens = (htmlCollection: HTMLElement | null) => {
  const htmlTokenCollection = htmlCollection?.children
  const tokenCollection: Element[] = []

  if (htmlTokenCollection) {
    const collection = Object.values(htmlTokenCollection)

    for (const el of collection) {
      let whitespaceElements: {
        before: null | Element
        after: null | Element
      } = {
        before: null,
        after: null
      }

      const isTokenContainsWhitespace =
        el.textContent?.match(/[A-Za-z]/) && el.textContent.includes(WHITESPACE)

      if (el.textContent && isTokenContainsWhitespace) {
        if (el.textContent.startsWith(WHITESPACE)) {
          const whitespaceBeforeWordElement = document.createElement('span')
          const whitespacesBeforeWord = getWhitespacesBeforeWord(el.textContent)
          whitespaceBeforeWordElement.textContent = whitespacesBeforeWord
          whitespaceElements.before = whitespaceBeforeWordElement

          el.before(whitespaceBeforeWordElement)
        }

        if (el.textContent.endsWith(WHITESPACE)) {
          const whitespaceAfterWordElement = document.createElement('span')
          const whitespaceAfterWord = getWhitespacesAfterWord(el.textContent)

          whitespaceAfterWordElement.textContent = whitespaceAfterWord
          whitespaceElements.after = whitespaceAfterWordElement

          el.after(whitespaceAfterWordElement)
        }

        el.textContent = el.textContent.replaceAll(WHITESPACE, '')
      }

      if (whitespaceElements.after && whitespaceElements.before) {
        tokenCollection.push(whitespaceElements.before, el, whitespaceElements.after)
      } else if (whitespaceElements.after) {
        tokenCollection.push(el, whitespaceElements.after)
      } else if (whitespaceElements.before) {
        tokenCollection.push(whitespaceElements.before, el)
      } else {
        tokenCollection.push(el)
      }
    }

    const filteredTokenCollection = filterTokenWithIndentSpaces(tokenCollection)

    for (const filteredToken of filteredTokenCollection) {
      if (filteredToken.textContent) {
        const isTokenValidToSplit = filteredToken.textContent !== '\n'

        if (isTokenValidToSplit) {
          const splittedToken = filteredToken.textContent.split('')
          filteredToken.textContent = null

          for (const token of splittedToken) {
            const splittedTokenLetterElement = document.createElement('span')
            splittedTokenLetterElement.textContent = token
            splittedTokenLetterElement.style.cssText = 'color: #d3d3d3;'

            filteredToken.appendChild(splittedTokenLetterElement)
          }
        }
      }
    }

    return filteredTokenCollection
      .filter(token => token.textContent)
      .map((token, idx) => {
        let fullWord = ''
        let subTokens: SubToken[] = []

        if (token.childNodes.length > 1) {
          Object.values(token.children).forEach((child, idx) => {
            fullWord += child.textContent
            subTokens.push({ element: child, id: idx })
          })
        } else {
          fullWord = token.textContent as string
        }

        return { element: token, id: idx, fullWord, subTokens }
      })
  }
}

const getTotal = (tokens: CurrentToken[]) => {
  let total = 0
  for (const token of tokens) {
    if (token.subTokens.length) {
      total += token.subTokens.length
    } else {
      total++
    }
  }
  return total
}

export {
  getWhitespacesAfterWord,
  getWhitespacesBeforeWord,
  filterTokenWithIndentSpaces,
  getSplittedTokens,
  getTotal
}
