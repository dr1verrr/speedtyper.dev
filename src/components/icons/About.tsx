import { CSSProperties } from 'react'

type AboutProps = {
  style?: CSSProperties
}

export default function About({ style }: AboutProps) {
  return (
    <svg
      width='128px'
      height='128px'
      fill='inherit'
      style={{ ...style }}
      viewBox='0 0 128 128'
      id='Layer_1'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g>
        <path d='M64,1C29.3,1,1,29.3,1,64s28.3,63,63,63s63-28.3,63-63S98.7,1,64,1z M64,119C33.7,119,9,94.3,9,64S33.7,9,64,9   s55,24.7,55,55S94.3,119,64,119z' />
        <rect
          height='40'
          width='8'
          x='60'
          y='54.5'
        />
        <rect
          height='8'
          width='8'
          x='60'
          y='35.5'
        />
      </g>
    </svg>
  )
}
