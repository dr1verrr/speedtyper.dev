function componentToHex(c: number) {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null
}

const rgba = (hex: string, opacity: number) => {
  return `rgba(${hexToRgb(hex)?.join(',')},${opacity})`
}

export { componentToHex, rgbToHex, hexToRgb, rgba }
