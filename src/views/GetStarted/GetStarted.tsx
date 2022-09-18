import hljs, { AutoHighlightResult } from 'highlight.js'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createChallenge } from '@/api/firestore/challenge'
import Spinner from '@/components/loaders/Spinner'
import { Box, Button, Container, Stack, TextField, Typography } from '@/components/shared'
import CheckBox from '@/components/shared/CheckBox'
import requestWithLoading from '@/handlers/requestWithLoading'
import useDebouncedFunction from '@/hooks/useDebouncedFunction'
import $auth from '@/store/auth/store'

import { codeSamples } from '../ChallengePage/constants'

const DEBOUNCED_DETECT_LANG_DELAY = 300

type Detected = AutoHighlightResult

type ChallengeData = {
  language: string
  code: string
}

export default function GetStarted() {
  const [options, setOptions] = useState({ autodetect: true })
  const [inputValues, setInputValues] = useState({ language: '', text: '' })
  const [detectedLanguages, setDetectedLanguages] = useState<Detected>()
  const [languageLoaded, setLanguageLoaded] = useState<{
    status: 'none' | 'error' | 'success'
    challengeData: ChallengeData
  }>({
    status: 'none',
    challengeData: {
      language: '',
      code: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const actions = {
    detectLanguage: (code?: string) => {
      const highlighted = hljs.highlightAuto(code || inputValues.language)
      setDetectedLanguages(highlighted)
      setLoading(false)
    }
  }

  const debouncedDetectLanguage = useDebouncedFunction(
    actions.detectLanguage,
    DEBOUNCED_DETECT_LANG_DELAY
  )

  const changeHandlers = {
    option: (e: ChangeEvent<HTMLInputElement>) => {
      setOptions({ ...options, [e.target.name]: e.target.checked })
    },
    text: (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.name) {
        changeHandlers.input(e)
      }
      if (options.autodetect) {
        setLoading(true)
        debouncedDetectLanguage(e.target.value)
      }
    },
    input: (e: ChangeEvent<HTMLInputElement>) => {
      setInputValues({ ...inputValues, [e.target.name]: e.target.value })
    }
  }

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault()
    const toastId = 'get-started-submit'
    if (inputValues.text.length >= 25 && inputValues.text.length <= 3000) {
      const lang = inputValues.language || 'plain'
      if ($auth.getState()) {
        const prismModule = await requestWithLoading(
          () => import('@/services/highlight/prism')
        )
        const Prism = prismModule!.default
        Prism.plugins.autoloader.loadLanguages(
          lang,
          () => {
            setLanguageLoaded(prev => ({
              ...prev,
              status: 'success',
              challengeData: { code: inputValues.text, language: lang }
            }))
          },
          () => {
            setLanguageLoaded(prev => ({ ...prev, status: 'error' }))
          }
        )
      } else {
        navigate('/challenge', {
          state: {
            language: lang,
            code: inputValues.text
          }
        })
      }
    } else {
      toast(
        inputValues.text.length > 3000
          ? 'Text must be at most 3000 characters.'
          : 'Text should be at least 25 characters.',
        {
          toastId,
          type: 'error',
          autoClose: 2500,
          style: { fontWeight: 400 }
        }
      )
    }
  }

  useEffect(() => {
    if (!options.autodetect) {
      setInputValues(prev => ({ ...prev, language: '' }))
      setDetectedLanguages(undefined)
    } else {
      if (inputValues.text) {
        actions.detectLanguage(inputValues.text)
      }
    }
  }, [options])

  useEffect(() => {
    if (detectedLanguages && detectedLanguages.language) {
      const lang = detectedLanguages.language
      setInputValues(prev => ({ ...prev, language: lang }))
    }
  }, [detectedLanguages])

  useEffect(() => {
    switch (languageLoaded.status) {
      case 'error': {
        toast('Language not found', { type: 'error' })
        break
      }

      case 'success': {
        requestWithLoading(() => {
          return createChallenge(inputValues.text, languageLoaded.challengeData.language)
        }).then(id => {
          navigate(`/challenge/${id}`, {
            state: {
              language: languageLoaded.challengeData.language,
              code: languageLoaded.challengeData.code,
              id
            }
          })
        })
      }
    }
  }, [languageLoaded])

  return (
    <Container maxWidth='sm'>
      <Box sx={{ padding: '30px 15px' }}>
        <Stack direction='column'>
          <Typography
            sx={{ maxWidth: 'fit-content' }}
            variant='h1'
          >
            Get Started
          </Typography>
          <Box sx={{ marginBottom: 20 }}>
            <Stack
              direction='column'
              spacing={15}
            >
              <Typography>Try some samples</Typography>
              <Stack
                spacing={5}
                sx={{ flexWrap: 'wrap' }}
              >
                {Object.keys(codeSamples).map((sample, idx) => {
                  return (
                    <Button
                      key={idx}
                      sx={{ padding: '5px 15px', borderWidth: 1 }}
                      variant='primary'
                      onClick={() => {
                        navigate('/challenge', {
                          state: {
                            language: sample,
                            code: codeSamples[sample as keyof typeof codeSamples]
                          }
                        })
                      }}
                    >
                      {sample}
                    </Button>
                  )
                })}
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Stack
              direction='column'
              spacing={15}
            >
              <Typography
                highlighted
                sx={{ maxWidth: 'fit-content', margin: 0 }}
                variant='h3'
              >
                Create challenge
              </Typography>
              <form onSubmit={onSubmit}>
                <Stack
                  direction='column'
                  spacing={10}
                >
                  <TextField
                    multiline
                    name='text'
                    spellCheck={false}
                    sx={{ resize: 'none', padding: '20px 50px 50px 20px' }}
                    value={inputValues.text}
                    onChange={changeHandlers.text}
                  />
                  <Stack>
                    <CheckBox
                      checked={options.autodetect}
                      name='autodetect'
                      onChange={changeHandlers.option}
                    >
                      <Typography>Autodetect language</Typography>
                    </CheckBox>
                    <Box sx={{ minWidth: 0, display: 'flex', position: 'relative' }}>
                      <TextField
                        disabled={options.autodetect}
                        name='language'
                        readOnly={options.autodetect}
                        sx={{ minWidth: 0, maxWidth: 'fit-content' }}
                        value={inputValues.language}
                        onChange={changeHandlers.input}
                      />
                      {loading && (
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0
                          }}
                        >
                          <Spinner size={15} />
                        </Box>
                      )}
                    </Box>
                  </Stack>
                  {!loading &&
                    detectedLanguages &&
                    detectedLanguages?.secondBest?.language && (
                      <Button
                        variant='primary'
                        onClick={() => {
                          setInputValues(prev => ({
                            ...prev,
                            language: detectedLanguages.secondBest?.language!
                          }))
                          setDetectedLanguages(prev => ({
                            ...prev!,
                            ...detectedLanguages.secondBest,
                            secondBest: undefined
                          }))
                        }}
                      >
                        {detectedLanguages.secondBest.language}
                      </Button>
                    )}
                  <Stack direction='column'>
                    <Button
                      disabled={loading}
                      sx={{ fontSize: 20, fontWeight: 600, letterSpacing: 1 }}
                      type='submit'
                      variant={
                        inputValues.language && inputValues.text ? 'primary' : 'default'
                      }
                    >
                      Start
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  )
}
