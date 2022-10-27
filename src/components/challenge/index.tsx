import Fetch from '@/features/Fetch'
import ForwardBack from '@/features/navigation/ForwardBack'
import Prism from '@/services/highlight/prism'

import FullscreenLoader from '../loaders/FullscreenLoader'
import { Box, Button, Container, Stack, Typography } from '../shared'
import Challenger from './Challenger'
import { E_STATUS, STATUS } from './constants'

type ChallengerWrapperProps = {
  challengeData: {
    id?: string
    language: string
    code: string
  }
  showNextButton?: boolean
}

type LOAD_SUCCESS = E_STATUS.grammarLoaded
type LOAD_ERROR = E_STATUS.grammarNotFound | E_STATUS.languageNotFound

export default function ChallengerWrapper({
  challengeData,
  showNextButton = false
}: ChallengerWrapperProps) {
  const actions = {
    loadLanguages: async (lang: string) => {
      const getLanguages = () => {
        return new Promise<LOAD_SUCCESS | LOAD_ERROR>((resolve, reject) => {
          Prism.plugins.autoloader.loadLanguages(
            lang,
            () => resolve(actions.status.loadLanguages.success(lang)),
            () => resolve(actions.status.loadLanguages.error())
          )
        })
      }

      const response = await getLanguages()
      if (response === E_STATUS.grammarLoaded) {
        return response
      }

      return Promise.reject<E_STATUS.grammarNotFound | E_STATUS.languageNotFound>(
        response
      )
    },
    status: {
      loadLanguages: {
        success: (lang: string) => {
          if (Prism.languages[lang]) {
            return STATUS.grammarLoaded
          } else {
            return STATUS.languageNotFound
          }
        },
        error: () => {
          return STATUS.grammarNotFound
        }
      }
    }
  }

  return (
    <Fetch
      fetch={() => actions.loadLanguages(challengeData.language)}
      loadingElement={FullscreenLoader}
      renderError={err => {
        const error = err as LOAD_ERROR

        return (
          <Container
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Stack
              direction='column'
              spacing={30}
            >
              <Box sx={{ padding: '2em', background: '#222' }}>
                <Typography sx={{ fontSize: '4em', color: 'red' }}>
                  Error: {error === E_STATUS.languageNotFound && 'Language not found.'}
                  {error === E_STATUS.grammarNotFound && 'Grammar not found.'}
                </Typography>
              </Box>
              <ForwardBack>
                <Button
                  sx={{ padding: '1em', fontSize: '1.5em' }}
                  variant='default'
                >
                  Go back
                </Button>
              </ForwardBack>
            </Stack>
          </Container>
        )
      }}
      renderSuccess={() => {
        return (
          <Challenger
            {...challengeData}
            showNextButton={showNextButton}
          />
        )
      }}
    />
  )
}
