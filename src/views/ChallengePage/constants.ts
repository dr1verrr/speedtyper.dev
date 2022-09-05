const codeSamples = {
  ruby: `
  def sum_eq_n?(arr, n)
  return true if arr.empty? && n == 0
  arr.product(arr).reject { |a,b| a == b }.any? { |a,b| a + b == n }
end
`,
  javascript: [
    `function createMicrobrewery(name) {
  const breweryName = name || "Hipster Brew Co.";
}`,
    `const binarySearch = (nums, target) => {
  let left = 0
  let right = nums.length - 1
  let mid

  const getMiddle = () => {
    return Math.round((right - left) / 2 + left)
  }

  while (left <= right) {
    mid = getMiddle()

    if (nums[mid] === target) {
      return mid
    } else if (target < nums[mid]) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  return -1
}`
  ],
  javascriptreact: `
  const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello, world!</h1>);`,
  short: `const foo = () => {}`
}

export { codeSamples }
