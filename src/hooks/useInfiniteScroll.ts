import { useEffect, useRef, useState } from 'react'

const useInfiniteScroll = (data: any[], increment = 5, initialCount = 5) => {
  const INITIAL_COUNT = initialCount
  const COUNT_INCREMENT = increment
  const [count, setCount] = useState(INITIAL_COUNT)
  const [isLoading, setLoading] = useState(false)
  const isMounted = useRef(false)

  const scrollIfHasMore = () => {
    if (
      document.documentElement.offsetHeight <=
      document.documentElement.clientHeight + document.documentElement.scrollTop
    ) {
      setLoading(true)
    }
  }

  useEffect(() => {
    if (!isMounted.current) {
      scrollIfHasMore()
      isMounted.current = true
    }
    const handler = (e: Event) => {
      scrollIfHasMore()
    }

    window.addEventListener('scroll', handler)

    if (!isLoading) return
    if (count + COUNT_INCREMENT >= data.length) {
      setCount(data.length)
    } else {
      setCount(count + COUNT_INCREMENT)
    }

    setLoading(false)

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [isLoading])

  useEffect(() => {
    scrollIfHasMore()
  }, [count])

  return { count }
}

export default useInfiniteScroll
