const COLLECT_STATS_HELPERS = {
  getElapsedTime: (elapsedTime: number) => {
    if (elapsedTime < 0) {
      return elapsedTime * -1
    }
    if (elapsedTime === 0) return 0
    return elapsedTime
  },
  getWpm: (pressed: number) => {
    return pressed / 5 / (1 / 60)
  }
}

export { COLLECT_STATS_HELPERS }
