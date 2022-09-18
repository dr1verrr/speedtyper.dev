import { useEffect, useRef } from 'react'

export default function useDebouncedFunction(
  func: (...args: any) => any,
  delay: number,
  cleanUp = false
): (...args: any) => any {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  function clearTimer() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }

  useEffect(() => (cleanUp ? clearTimer : undefined), [cleanUp])

  return (...args) => {
    clearTimer()
    timeoutRef.current = setTimeout(() => func(...args), delay)
  }
}
