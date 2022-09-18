import { ChallengerStatisticsStore } from './store'

type ChallengerInputProps = {
  language: string
  code: string
}

type ChallengerProps = {
  language: string
  code: string
  id?: string
  showNextButton?: boolean
}

type TChallengerResults = Omit<
  ChallengerStatisticsStore,
  'code' | 'currentId' | 'keyboard' | 'progress' | 'combo'
> & {
  timeEnded: Date
  accuracy: number
}

type TSTATUS = {
  grammarNotFound: 'grammar-not-found'
  languageNotFound: 'langauge-not-found'
  grammarLoaded: 'grammar-loaded'
}

type StatusKeys = keyof TSTATUS
type StatusValues = TSTATUS[StatusKeys]

export type {
  ChallengerInputProps,
  ChallengerProps,
  TChallengerResults,
  TSTATUS,
  StatusKeys,
  StatusValues
}
