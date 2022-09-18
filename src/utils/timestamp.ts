function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0')
}

function convertMsToTime(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60

  hours = hours % 24
  const result = `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds
  )}`

  const splitted = result.split(':').map(s => (s[0] === '0' ? s.slice(1) : s))
  if (splitted[0] !== '0') {
    return `${splitted[0]}h, ${splitted[1]}m, ${splitted[2]}s`
  } else if (splitted[1] !== '0') {
    return `${splitted[1]}m, ${splitted[2]}s`
  }

  return `${splitted[2]}s`
}

export { convertMsToTime }
