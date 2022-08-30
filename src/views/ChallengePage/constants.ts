const codeSamples = {
  ruby: `
  def sum_eq_n?(arr, n)
  return true if arr.empty? && n == 0
  arr.product(arr).reject { |a,b| a == b }.any? { |a,b| a + b == n }
end
`,
  javascript: `function createMicrobrewery(name) {
  const breweryName = name || "Hipster Brew Co.";
}`,
  javascriptreact: `
  const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello, world!</h1>);`
}

export { codeSamples }
