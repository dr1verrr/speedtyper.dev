import { ChallengerStatisticsStore } from './store/store'

type ChallengerInputProps = {
  language: string
  code: string
}

type ChallengerOptions = {
  collectStats?: boolean
  showProgressBar?: boolean
  showControls?: boolean
  showStats?: boolean
  collectStats?: boolean
  useLargeView?: boolean
}

type ChallengerProps = {
  language: string
  code: string
  id?: string
  showNextButton?: boolean
  multiple?: boolean
  options?: ChallengerOptions
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
  ChallengerOptions,
  StatusValues
}
