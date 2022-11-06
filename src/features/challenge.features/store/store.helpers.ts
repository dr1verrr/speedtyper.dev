import Prism from 'prismjs'

const getToken = (token: string | Prism.Token): string | Prism.Token | undefined => {
  if (typeof token === 'string') {
    return token
  } else {
    if (typeof token.content === 'string') {
      return token as Prism.Token
    } else if (Array.isArray(token.content)) {
      return token
    }
  }
}

type ResplittedToken = {
  type: string
  content: string
  indentSpaces?: string
}

const getHighlighted = (code: string, language: string, grammar?: Prism.Grammar) => {
  const tokens = Prism.tokenize(code, grammar || Prism.languages[language])
  const reformattedTokens: ResplittedToken[] = []

  const resplitToken = (token: string | Prism.Token): ResplittedToken[] => {
    const resplittedTokens: ResplittedToken[] = []

    if (typeof token === 'string') {
      if (token.includes('\n')) {
        if (token.startsWith('\n')) {
          for (let idx = 0; token.length > idx; idx++) {
            const char = token[idx]
            if (char === '\n') {
              let indentChars = ''
              const nextChars = token.slice(idx + 1)

              for (const nextChar of nextChars) {
                if (nextChar === ' ' || nextChar === '\t') {
                  indentChars += nextChar
                } else break
              }

              resplittedTokens.push({
                content: '\n',
                type: 'new-row',
                indentSpaces: indentChars
              })
            } else if (char.match(/[A-Za-z]/) || char === '"' || char === "'") {
              const word = token.slice(idx)
              if (word) {
                resplittedTokens.push({
                  content: word,
                  type: 'plain'
                })
              }
              break
            }
          }
        } else {
          let word = ''

          for (const letter of token) {
            if (letter !== '\n') {
              word += letter
            } else break
          }

          resplittedTokens.push({ content: word, type: 'plain' })

          const specialChars = token.slice(word.length)
          for (let idx = 0; idx < specialChars.length; idx++) {
            const char = specialChars[idx]
            if (char === '\n') {
              let word = ''
              let indentChars = ''
              const nextChars = specialChars.slice(idx + 1)

              for (let idx = 0; nextChars.length > idx; idx++) {
                const nextChar = nextChars[idx]
                if (nextChar === ' ' || nextChar === '\t') {
                  indentChars += nextChar
                } else if (
                  nextChar.match(/[A-Za-z]/) ||
                  nextChar === '"' ||
                  nextChar === "'"
                ) {
                  const removeSpecChars = (word: string) => {
                    let clearWord = ''
                    for (const ltr of word) {
                      if (ltr.match(/[A-Za-z]/)) {
                        clearWord += ltr
                      } else break
                    }
                    return clearWord
                  }
                  const clearWord = removeSpecChars(nextChars.slice(idx))
                  if (clearWord) {
                    word = clearWord
                  }
                  break
                } else break
              }

              resplittedTokens.push({
                content: '\n',
                type: 'new-row',
                indentSpaces: indentChars
              })
              //console.log('WORD', word.split(''))

              if (word) {
                resplittedTokens.push({
                  content: word,
                  type: 'plain'
                })
              }
            }
          }
        }
      } else {
        resplittedTokens.push({ content: token, type: 'plain' })
      }
    } else {
      const firstType = token.type
      const tokenContent = token.content

      if (Array.isArray(tokenContent)) {
        const getStringContentTokens = (tknContent: (string | Prism.Token)[]) => {
          const splitted: ResplittedToken[] = []

          for (const tkn of tknContent) {
            if (typeof tkn === 'string') {
              splitted.push({ type: firstType, content: tkn })
            } else {
              if (typeof tkn.content === 'string') {
                splitted.push({ type: firstType + ' ' + tkn.type, content: tkn.content })
              } else if (Array.isArray(tkn.content)) {
                const stringContentTokens = getStringContentTokens(tkn.content)
                splitted.push(...stringContentTokens)
              }
            }
          }

          return splitted
        }

        const stringContentTokens = getStringContentTokens(tokenContent)
        for (const stringContentTkn of stringContentTokens) {
          resplittedTokens.push(stringContentTkn)
        }
      } else {
        resplittedTokens.push({ content: tokenContent as string, type: firstType })
      }
    }

    return resplittedTokens
  }

  if (tokens.length === 1 && typeof tokens[0] === 'string') {
    let plainToken = tokens[0]
    const presplitted: ResplittedToken[] = []

    for (; plainToken.length; ) {
      const char = plainToken[0]

      if (char === '\n') {
        const nextChars = plainToken.slice(1)
        let indentChars = ''
        for (const nextChar of nextChars) {
          if (nextChar === ' ' || nextChar === '\t') {
            indentChars += nextChar
          } else {
            break
          }
        }

        plainToken = plainToken.slice(indentChars.length + 1)
        presplitted.push({ content: '\n', type: 'new-row', indentSpaces: indentChars })
      } else {
        let word = ''

        for (const char of plainToken) {
          if (char !== '\n') {
            word += char
          } else {
            break
          }
        }

        plainToken = plainToken.slice(word.length)
        presplitted.push({ content: word, type: 'plain' })
      }
    }

    for (const tkn of presplitted) {
      reformattedTokens.push(tkn)
    }
  } else {
    for (const token of tokens) {
      const tokenWithStringContent = getToken(token)
      const resplittedTokens = resplitToken(tokenWithStringContent!)
      for (const resplittedToken of resplittedTokens) {
        reformattedTokens.push(resplittedToken)
      }
    }
  }

  console.log('reformatted tokens', reformattedTokens)

  return {
    code,
    language,
    tokens: reformattedTokens.map((tkn, idx) => {
      const element = document.createElement('span')

      if (tkn.type && tkn.type !== 'plain') {
        if (tkn.type !== 'new-row') {
          element.className = 'token ' + tkn.type
        } else {
          element.className = 'new-row'
        }
      }

      return {
        ...tkn,
        element,
        id: idx,
        type: tkn.type
      }
    }),
    total: reformattedTokens.reduce((acc, current) => {
      return acc + current.content.length
    }, 0)
  }
}

type Highlighted = ReturnType<typeof getHighlighted>

export type { Highlighted }
export { getToken as getFirstTokenWithStringContent, getHighlighted }
