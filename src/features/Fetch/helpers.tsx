const getElementFromComponentOrJSX = <T extends React.ComponentType | JSX.Element>(
  elementOrCmp: T
) => {
  let loader: JSX.Element = elementOrCmp as JSX.Element
  if (typeof elementOrCmp === 'symbol') {
    loader = elementOrCmp
  } else if (typeof elementOrCmp === 'function') {
    const LoadingComponent = elementOrCmp as React.ComponentType
    loader = <LoadingComponent />
  }

  return loader
}

export { getElementFromComponentOrJSX }
