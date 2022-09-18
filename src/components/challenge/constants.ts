const WHITESPACE = ' '
const CHALLENGER_STATS_TIME_INCREMENT = 1000

const STATUS = {
  grammarNotFound: 'grammar-not-found',
  languageNotFound: 'langauge-not-found',
  grammarLoaded: 'grammar-loaded'
} as const

export { WHITESPACE, CHALLENGER_STATS_TIME_INCREMENT, STATUS }
