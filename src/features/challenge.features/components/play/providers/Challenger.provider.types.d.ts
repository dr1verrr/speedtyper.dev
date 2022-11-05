type TChallengerContextActions = {
  setResults: (results: TChallengerResults) => unknown
  resetResults: () => void
}

type TChallengerContext = {
  results: TChallengerResults | null
  actions: TChallengerContextActions
  options: ChallengerOptions
}

export { TChallengerContext, TChallengerContextActions }
