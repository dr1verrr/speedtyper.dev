import { CSSProperties } from 'react'

type AboutProps = {
  style?: CSSProperties
}

export default function About({ style }: AboutProps) {
  return (
    <svg
      fill='inherit'
      height='24px'
      style={{ ...style }}
      viewBox='0 0 64 64'
      width='24px'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M 9 10 C 6.791 10 5 11.791 5 14 L 5 48 C 5 50.209 6.791 52 9 52 L 35.789062 52 L 35 62 L 46.865234 52 L 55 52 C 57.209 52 59 50.209 59 48 L 59 14 C 59 11.791 57.209 10 55 10 L 9 10 z M 32 17 C 34.209 17 36 18.791 36 21 C 36 23.209 34.209 25 32 25 C 29.791 25 28 23.209 28 21 C 28 18.791 29.791 17 32 17 z M 31 29 L 35 29 L 35 43 L 29 43 L 29 31 L 31 29 z' />
    </svg>
  )
}
