import React, { useEffect, useState } from 'react'

import { getElementFromComponentOrJSX } from './helpers'

type FetchProps<FetchFn, Error = any> = {
  loadingElement: React.ComponentType | JSX.Element
  renderError?: (error: Error) => JSX.Element | null
  renderSuccess?: (
    successData: FetchFn extends (...args: any[]) => Promise<infer Res> ? Res : never
  ) => JSX.Element | null
  fetch: FetchFn extends (...args: any[]) => Promise<infer Res> ? FetchFn : never
}

export default function Fetch<FetchFn, Error>({
  loadingElement,
  renderError,
  fetch,
  renderSuccess
}: FetchProps<FetchFn, Error>) {
  const [loader, setLoader] = useState<JSX.Element>()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [response, setResponse] = useState<any>()

  useEffect(() => {
    if (loader) {
      setLoading(true)
      fetch()
        .then(setResponse)
        .catch(error => {
          setError(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [fetch, loader])

  useEffect(() => {
    const loader = getElementFromComponentOrJSX(loadingElement)
    setLoader(loader)
  }, [loadingElement])

  if (loader && isLoading) {
    return loader
  }

  if (renderError && error) {
    return renderError(error)
  }

  if (renderSuccess && response) {
    return renderSuccess(response)
  }

  return null
}
