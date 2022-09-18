import { capitalize } from 'lodash'

const convertMessage = (message: string): string => {
  const splittedBySlash = message
    .split('')
    .filter(s => s !== '(' && s !== ')')
    .join('')
    .split('/')

  return capitalize(
    splittedBySlash[splittedBySlash.length - 1].split('-').join(' ').trim()
  )
}

export default convertMessage
