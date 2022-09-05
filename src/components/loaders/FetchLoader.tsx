import { useStore } from 'effector-react'
import { createPortal } from 'react-dom'

import $ui from '@/store/ui/store'

import Box from '../shared/Box'
import SpinnerWave from './SpinnerWave'

export default function FetchingLoader() {
  const domElement = document.getElementById('root') as HTMLElement
  const { loading } = useStore($ui)

  if (loading) {
    return createPortal(
      <Box
        sx={{
          position: 'fixed',
          bottom: 35,
          right: 35
        }}
      >
        <SpinnerWave />
      </Box>,
      domElement
    )
  }

  return null
}
