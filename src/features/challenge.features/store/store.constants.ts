const WHITESPACE = ' '
const CHALLENGER_STATS_TIME_INCREMENT = 1000

enum E_STATUS {
  grammarNotFound = 'grammar-not-found',
  languageNotFound = 'langauge-not-found',
  grammarLoaded = 'grammar-loaded'
}

const STATUS = {
  grammarNotFound: E_STATUS.grammarNotFound,
  languageNotFound: E_STATUS.languageNotFound,
  grammarLoaded: E_STATUS.grammarLoaded
} as const

export { E_STATUS }
export { WHITESPACE, CHALLENGER_STATS_TIME_INCREMENT, STATUS }
