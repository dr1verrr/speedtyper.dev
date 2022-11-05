import React, { useEffect, useState } from 'react'

import { getElementFromComponentOrJSX } from './helpers'

type FetchProps<FetchFn, Error = any> = {
  loadingElement: React.ComponentType | JSX.Element
  renderError?: (error: Error, refetch: FetchFn) => JSX.Element | void | null
  renderSuccess?: (
    successData: FetchFn extends (...args: any[]) => Promise<infer Res> ? Res : never,
    refetch: FetchFn
  ) => JSX.Element | void | null
  fetch: FetchFn extends (...args: any[]) => Promise<infer Res> ? FetchFn : never
}

const Fetch = <FetchFn, Error>({
  loadingElement,
  renderError,
  fetch,
  renderSuccess
}: FetchProps<FetchFn, Error>) => {
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
    const renderedError = renderError(error, fetch)
    if (renderedError) return renderedError
    return null
  }

  if (renderSuccess && response) {
    const renderedSuccess = renderSuccess(response, fetch)
    if (renderedSuccess) return renderedSuccess
    return null
  }

  return null
}

export default Fetch
