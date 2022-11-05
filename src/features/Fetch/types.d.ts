type FetchRefetch = (...args: unknown[]) => unknown

type FetchErrorProps = {
  error: any
  refetch: FetchRefetch
}

export type { FetchErrorProps, FetchRefetch }
