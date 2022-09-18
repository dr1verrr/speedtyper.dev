import { useEvent, useStore } from 'effector-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { createSession } from '@/api/firestore/challenge'
import { nextChallenge } from '@/store/challenges/events'
import $preferences from '@/store/preferences/store'

import SpinnerWave from '../loaders/SpinnerWave'
import { Box, Button, Container, Stack } from '../shared'
import ChallengerInput from './ChallengerInput'
import { CHALLENGER_STATS_TIME_INCREMENT } from './constants'
import { challengerWorkStatisticsChanged } from './events'
import useChallenger from './hooks/useChallenger'
import {
  $challengerStatistics,
  $challengerWorkStatistics,
  ChallengerStatisticsStore
} from './store'
import { ChallengerProps, TChallengerResults } from './types.d'

const ChallengerRealtimeStatistics = lazy(() => import('./ChallengerRealtimeStatistics'))
const ChallengerProgressBar = lazy(() => import('./ChallengerProgressBar'))
const ChallengerControls = lazy(() => import('./ChallengerControls'))
const ChallengerResults = lazy(() => import('./ChallengerResults'))

export default function Challenger({
  language,
  code,
  id = '',
  showNextButton = false
}: ChallengerProps) {
  const codeTrimmed = code.trim()
  const { actions: challengerActions, challenger } = useChallenger()
  const [results, setResults] = useState<TChallengerResults>()
  const [resultStats, setResultStats] = useState<ChallengerStatisticsStore>()
  const setNext = useEvent(nextChallenge)

  const preferences = useStore($preferences)

  const timerInterval = useRef<NodeJS.Timer>()
  const timeStartedOrResumed = useRef<Date>()

  const setStatistics = useEvent(challengerWorkStatisticsChanged)

  const isTimedOut = () => {
    const time = $challengerWorkStatistics.getState().time
    if (time >= 1000 && time / 1000 < 350) {
      return false
    } else if (time <= 1000) {
      return false
    }

    return true
  }

  const onTimedOut = () => {
    actions.timer.clear()
    challengerActions.status.set({ finished: false, started: false, paused: false })
    challengerActions.statistics.reset()
    toast('Timed out.', { icon: '⌚' })
  }

  const actions = {
    updateTimer: () => {
      const time = $challengerWorkStatistics.getState().time
      if (!isTimedOut()) {
        setStatistics({ time: time + CHALLENGER_STATS_TIME_INCREMENT })
      } else {
        onTimedOut()
      }
    },
    timer: {
      set: () => {
        timerInterval.current = setInterval(actions.updateTimer, 1000)
      },
      clear: () => {
        clearInterval(timerInterval.current)
      }
    },
    getResults: (resStats: ChallengerStatisticsStore) => {
      const { code, combo, progress, ...rest } = resStats
      const stats = rest
      const accuracy = ((code!.total - stats.errors.length) / code!.total) * 100

      return { ...stats, timeEnded: new Date(), accuracy }
    },
    next: () => {
      setNext()
    }
  }

  useEffect(
    preferences.challenger.collect_stats
      ? () => {
          const { finished, paused, started } = challenger

          actions.timer.clear()

          if (isTimedOut()) {
            return onTimedOut()
          }

          if (finished) {
            const statistics = $challengerStatistics.getState()
            if (statistics.progress === 100) {
              setResultStats(statistics)
            }

            actions.timer.clear()
            challengerActions.statistics.reset()
            timerInterval.current = undefined
            timeStartedOrResumed.current = undefined
            return
          }

          if (started) {
            if (!timerInterval.current || (!paused && timerInterval.current)) {
              if (!timeStartedOrResumed.current) {
                const timeStarted = $challengerWorkStatistics.getState().timeStarted
                timeStartedOrResumed.current = timeStarted!
              } else {
                timeStartedOrResumed.current = new Date()
              }
              actions.timer.set()
            }
          }

          if (paused) {
            const time = $challengerWorkStatistics.getState().time
            const elapsedTime =
              new Date().getMilliseconds() -
              timeStartedOrResumed.current!.getMilliseconds()

            const getElapsedTime = () => {
              if (elapsedTime < 0) {
                return elapsedTime * -1
              }
              if (elapsedTime === 0) return 0
              return elapsedTime
            }

            setStatistics({
              time: time + getElapsedTime()
            })

            actions.timer.clear()
          }
        }
      : () => {},

    [challenger, preferences]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'n') {
        challengerActions.nextChallenge()
      }
    }
    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [])

  useEffect(() => {
    if (resultStats) {
      const results = actions.getResults(resultStats)
      setResults(results)
    }
  }, [resultStats])

  useEffect(() => {
    if (preferences.challenger.collect_stats && results && challenger.id) {
      createSession(challenger.id, results)
    }
  }, [results, preferences])

  useEffect(() => {
    challengerActions.status.set({ id })
  }, [id])

  useEffect(() => {
    const onUnmount = () => {
      challengerActions.onUnmount()
      if (preferences.challenger.collect_stats) {
        actions.timer.clear()
      }
    }

    return () => onUnmount()
  }, [preferences])

  if (results) {
    return (
      <Box
        sx={{
          marginBottom: 25,
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SpinnerWave size={150} />
            </Box>
          }
        >
          <Box
            sx={{
              minHeight: '80vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Stack
              direction='column'
              sx={{
                alignItems: 'center',
                paddingTop: 20
              }}
            >
              <Stack spacing={10}>
                <Button
                  sx={{ padding: '12px 20px' }}
                  variant='primary'
                  onClick={() => {
                    challengerActions.reset()
                    setResultStats(undefined)
                    setResults(undefined)
                  }}
                >
                  Play again
                </Button>
                {showNextButton && <Button onClick={actions.next}>Next</Button>}
              </Stack>

              <ChallengerResults stats={results} />
            </Stack>
          </Box>
        </Suspense>
      </Box>
    )
  }

  return (
    <Container
      sx={{
        padding: 20,
        minHeight: '84vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: preferences.challenger.use_challenger_large_view_width ? 1440 : 1010
      }}
    >
      <Stack
        direction='column'
        spacing={15}
      >
        <Stack
          spacing={15}
          sx={{ flexWrap: 'wrap', alignItems: 'center' }}
        >
          {preferences.challenger.show_controls && (
            <ChallengerControls showNextButton={showNextButton} />
          )}
          {preferences.challenger.show_progressbar && (
            <Box
              sx={{
                minWidth: 250,
                flex: 1,
                height: '100%'
              }}
            >
              <ChallengerProgressBar />
            </Box>
          )}
        </Stack>
        {preferences.challenger.show_stats && preferences.challenger.collect_stats && (
          <ChallengerRealtimeStatistics />
        )}
        <ChallengerInput
          code={codeTrimmed}
          language={language}
        />
      </Stack>
    </Container>
  )
}
