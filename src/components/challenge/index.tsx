import { useEffect, useState } from 'react'

import Prism from '@/services/highlight/prism'

import SpinnerWave from '../loaders/SpinnerWave'
import { Box } from '../shared'
import Challenger from './Challenger'
import { STATUS } from './constants'
import { StatusValues } from './types'

type ChallengerWrapperProps = {
  challengeData: {
    id?: string
    language: string
    code: string
  }
  showNextButton?: boolean
}

export default function ChallengerWrapper({
  challengeData,
  showNextButton = false
}: ChallengerWrapperProps) {
  const [isLoading, setLoading] = useState(true)
  const [status, setStatus] = useState<StatusValues>()

  const actions = {
    loadLanguages: (lang: string) => {
      if (lang) {
        Prism.plugins.autoloader.loadLanguages(
          lang,
          () => actions.status.loadLanguages.success(lang),
          actions.status.loadLanguages.error
        )
      }
    },
    status: {
      loadLanguages: {
        success: (lang: string) => {
          if (Prism.languages[lang]) {
            setStatus(STATUS.grammarLoaded)
          } else {
            setStatus(STATUS.languageNotFound)
          }
          setLoading(false)
        },
        error: () => {
          setStatus(STATUS.grammarNotFound)
          setLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    setStatus(undefined)
    setLoading(true)
    actions.loadLanguages(challengeData.language)
  }, [challengeData])

  if (isLoading) {
    return (
      <Box sx={{ position: 'fixed', top: '50%', left: '50%', translate: '-50% 0' }}>
        <SpinnerWave />
      </Box>
    )
  }

  if (!isLoading && status && status === STATUS.grammarLoaded) {
    return (
      <Challenger
        {...challengeData}
        showNextButton={showNextButton}
      />
    )
  }

  return null
}
