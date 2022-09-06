// FIX: missing highlight token (incorrect id)
import Prism from 'prismjs'

const getFirstTokenWithStringContent = (
  token: string | Prism.Token
): string | Prism.Token | undefined => {
  if (typeof token === 'string') {
    return token
  } else {
    if (typeof token.content === 'string') {
      return token
    } else if (Array.isArray(token.content)) {
      return getFirstTokenWithStringContent(token.content[0])
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
  const resplittedTokens: ResplittedToken[] = []

  if (language === 'plain' && typeof tokens[0] === 'string') {
    const splittedByNewRow = tokens[0].split('\n')
    const plainTokens = []

    for (let idx = 0; idx < splittedByNewRow.length; idx++) {
      const splittedTkn = splittedByNewRow[idx]
      const element = document.createElement('span')

      if (splittedTkn.startsWith(' ')) {
        const spacesBefore = ' '.repeat(
          splittedTkn.length - splittedTkn.trimStart().length
        )
        plainTokens.push(
          {
            content: '\n',
            type: 'new-row',
            element,
            indentSpaces: spacesBefore
          },
          {
            content: splittedTkn.trimStart(),
            type: 'plain',
            element: document.createElement('span')
          }
        )
      } else if (idx > 0) {
        if (splittedTkn.trim() === '') {
          plainTokens.push({
            content: '\n',
            indentSpaces: splittedTkn.repeat(splittedTkn.length),
            type: 'new-row',
            element
          })
        } else {
          plainTokens.push(
            {
              content: '\n',
              type: 'new-row',
              element,
              indentSpaces: ''
            },
            {
              content: splittedTkn,
              type: 'plain',
              element: document.createElement('span')
            }
          )
        }
      } else {
        plainTokens.push({ content: splittedTkn, type: 'plain', element })
      }
    }

    return {
      code,
      language,
      tokens: plainTokens.map((pt, idx) => {
        return {
          ...pt,
          id: idx
        }
      }),
      total: plainTokens.reduce((acc, current) => {
        return acc + current.content.length
      }, 0)
    }
  }

  function getSplittedTokens(token: string | Prism.Token, prefix?: string) {
    let splittedTokens: ResplittedToken[] = []

    if (typeof token === 'string') {
      if (token.includes('\n')) {
        let splitted = token
        const tokens: ResplittedToken[] = []

        if (splitted.startsWith(' ')) {
          let word = ''

          for (const letter of splitted) {
            if (letter !== '\n') {
              word += letter
            } else break
          }

          tokens.push({ content: word, type: 'plain' })

          const nextTokens = splitted.replace(word, '').split('\n')

          for (let idx = 0; idx < nextTokens.length; idx++) {
            const nextToken = nextTokens[idx]
            if (nextToken === '') {
              if (nextTokens[idx + 1]) {
                tokens.push({
                  content: '\n',
                  type: 'plain',
                  indentSpaces: nextTokens[idx + 1]
                })
              } else {
                tokens.push({
                  content: '\n',
                  type: 'plain',
                  indentSpaces: ''
                })
              }
            }
          }
        } else {
          let splittedLetters: string[] = []
          const word = splitted.slice(1).trimStart()

          if (word) {
            splittedLetters = splitted.replace(word, '').split('\n')
          } else {
            splittedLetters = splitted.split('\n')
          }

          if (
            splittedLetters.length === 2 &&
            !splittedLetters[0] &&
            !splittedLetters[1]
          ) {
            tokens.push({ content: '\n', indentSpaces: '', type: 'plain' })
          } else {
            for (let idx = 0; idx < splittedLetters.length; idx++) {
              const splittedLetter = splittedLetters[idx]
              if (splittedLetter === '') {
                if (splittedLetters[idx + 1]) {
                  tokens.push({
                    content: '\n',
                    type: 'plain',
                    indentSpaces: splittedLetters[idx + 1]
                  })
                } else {
                  tokens.push({ content: '\n', indentSpaces: '', type: 'plain' })
                }
              }
            }
          }

          if (word) {
            tokens.push({ content: word, type: 'plain' })
          }
        }

        for (const token of tokens) {
          splittedTokens.push(token)
        }
      } else {
        splittedTokens.push({ type: 'plain', content: token })
      }
    } else {
      if (prefix) {
        splittedTokens.push({
          type: prefix + ' ' + token.type,
          content: token.content as string
        })
      } else {
        splittedTokens.push({ type: token.type, content: token.content as string })
      }
    }

    return splittedTokens
  }

  const addResplitedToken = (token: string | Prism.Token, prefix?: string) => {
    const splittedTokens = getSplittedTokens(token, prefix)

    for (const splittedTkn of splittedTokens) {
      resplittedTokens.push(splittedTkn)
    }
  }

  for (const token of tokens) {
    if (typeof token !== 'string') {
      if (Array.isArray(token.content)) {
        for (const arrToken of token.content) {
          addResplitedToken(arrToken, token.type)
        }
      } else {
        addResplitedToken(token)
      }
    } else {
      addResplitedToken(token)
    }
  }

  return {
    code,
    language,
    tokens: resplittedTokens.map((tkn, idx) => {
      const element = document.createElement('span')
      //if (tkn.indentSpaces) {
      //  element.textContent = '\n' + tkn.indentSpaces
      //}

      if (tkn.type && tkn.type !== 'plain') {
        if (tkn.type.includes('-')) {
          tkn.type = tkn.type.split('-').join(' ')
        }

        element.className = 'token ' + tkn.type
      } else if (tkn.content === '\n') {
        element.className = 'new-row'
      }

      return {
        ...tkn,
        element,
        id: idx,
        type: tkn.content === '\n' ? 'new-row' : tkn.type
      }
    }),
    total: resplittedTokens.reduce((acc, current) => {
      return acc + current.content.length
    }, 0)
  }
}

type Highlighted = ReturnType<typeof getHighlighted>

export type { Highlighted }
export { getFirstTokenWithStringContent, getHighlighted }
