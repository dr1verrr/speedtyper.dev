import { useEvent } from 'effector-react'
import {
  createContext,
  lazy,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { toast } from 'react-toastify'

import { createSession } from '@/api/firestore/challenge'
import FullscreenLoader from '@/components/loaders/FullscreenLoader'
import { Box, Button, Stack } from '@/components/shared'
import { useChallenger } from '@/features/challenge.features/hooks'
import {
  $challengerStatistics,
  $challengerWorkStatistics
} from '@/features/challenge.features/store'
import { ChallengerStatisticsStore } from '@/features/challenge.features/store/store'
import { CHALLENGER_STATS_TIME_INCREMENT } from '@/features/challenge.features/store/store.constants'
import { challengerWorkStatisticsChanged } from '@/features/challenge.features/store/store.events'
import {
  ChallengerOptions,
  TChallengerResults
} from '@/features/challenge.features/types'
const ChallengerResults = lazy(() => import('../../../views/ChallengerResults.views'))

type TChallengerContextActions = {
  setResults: (results: TChallengerResults) => unknown
  resetResults: () => void
}

type TChallengerContext = {
  results: TChallengerResults | null
  actions: TChallengerContextActions
  options: ChallengerOptions
}

const ChallengerContext = createContext<TChallengerContext>({
  results: null
} as TChallengerContext)

const useChallengerContext = () => useContext(ChallengerContext)

type ChallengerProviderProps = {
  children?: ReactNode
  next?: () => void
  options: ChallengerOptions
  multiple?: boolean
  challengeId: string | undefined
}

type ChallengerResultProps = {
  results: TChallengerResults
  repeat: () => void
  options?: ChallengerOptions
  next?: () => void
}

const ChallengerResult = ({ options, next, results, repeat }: ChallengerResultProps) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        marginBottom: 25
      }}
    >
      <Suspense fallback={<FullscreenLoader />}>
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
              onClick={repeat}
            >
              Play again
            </Button>
            {next && <Button onClick={next}>Next</Button>}
          </Stack>

          <ChallengerResults stats={results} />
        </Stack>
      </Suspense>
    </Box>
  )
}

const ChallengerCollectStats = () => {
  const { actions: contextActions, results } = useChallengerContext()
  const [resultStats, setResultStats] = useState<ChallengerStatisticsStore>()
  const getWpm = (pressed: number) => {
    return pressed / 5 / (1 / 60)
  }

  const getElapsedTime = (elapsedTime: number) => {
    if (elapsedTime < 0) {
      return elapsedTime * -1
    }
    if (elapsedTime === 0) return 0
    return elapsedTime
  }

  const { actions: challengerActions, challenger } = useChallenger()

  const timerInterval = useRef<NodeJS.Timer>()
  const timeStartedOrResumed = useRef<Date>()
  const pressed = useRef(0)

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
    updateTimeAndWpm: () => {
      const { time, keyboard } = $challengerWorkStatistics.getState()
      if (!isTimedOut()) {
        const wpm = actions.getUpdatedWpm(keyboard.pressed)
        setStatistics({
          time: time + CHALLENGER_STATS_TIME_INCREMENT,
          wpm
        })
      } else {
        onTimedOut()
      }
    },
    timer: {
      set: () => {
        timerInterval.current = setInterval(actions.updateTimeAndWpm, 1000)
      },
      clear: () => {
        clearInterval(timerInterval.current)
      }
    },
    getResults: (resStats: ChallengerStatisticsStore) => {
      const { code, combo, progress, ...rest } = resStats
      const stats = rest
      const accuracy = ((code!.total - stats.errors.length) / code!.total) * 100

      return {
        ...stats,
        timeEnded: new Date(),
        accuracy,
        wpm: stats.timeline.reduce((p, n) => p + n.wpm, 0) / stats.timeline.length
      }
    },
    getUpdatedWpm: (rightPressed: number) => {
      const wpm = getWpm(rightPressed - pressed.current)
      pressed.current = rightPressed

      return wpm
    }
  }

  useEffect(() => {
    const { finished, paused, started } = challenger

    actions.timer.clear()

    if (isTimedOut()) {
      return onTimedOut()
    }

    if (finished) {
      pressed.current = 0
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
      const { keyboard, time } = $challengerWorkStatistics.getState()
      const elapsedTime =
        new Date().getMilliseconds() - timeStartedOrResumed.current!.getMilliseconds()
      const wpm = actions.getUpdatedWpm(keyboard.pressed)

      setStatistics({
        time: time + getElapsedTime(elapsedTime),
        wpm
      })

      actions.timer.clear()
    }
  }, [challenger])

  useEffect(() => {
    if (resultStats) {
      contextActions.setResults(actions.getResults(resultStats))
    }
  }, [resultStats])

  useEffect(() => {
    if (results && challenger.id) {
      createSession(challenger.id, results)
    }
  }, [results])

  useEffect(() => {
    return () => {
      actions.timer.clear()
    }
  }, [])

  return null
}

const ChallengerProvider = ({
  children,
  next,
  options,
  multiple
}: ChallengerProviderProps) => {
  const { actions: challengerActions, challenger } = useChallenger()
  const [results, setResults] = useState<TChallengerResults | null>(null)

  useEffect(() => {
    if (multiple) {
      const handler = (e: KeyboardEvent) => {
        if (e.altKey && e.key === 'n') {
          challengerActions.nextChallenge()
        }
      }

      document.addEventListener('keydown', handler)

      return () => {
        document.removeEventListener('keydown', handler)
      }
    }
  }, [multiple])

  useEffect(() => {
    return () => {
      challengerActions.onUnmount()
    }
  }, [])

  const actions: TChallengerContextActions = {
    setResults: results => {
      setResults(results)
    },
    resetResults: () => {
      setResults(null)
    }
  }

  const providerActions = {
    repeat: () => {
      actions.resetResults()
    }
  }

  return (
    <ChallengerContext.Provider value={{ results, actions, options }}>
      {options.collectStats && challenger.started && <ChallengerCollectStats />}
      {results ? (
        <ChallengerResult
          next={next}
          options={options}
          repeat={providerActions.repeat}
          results={results}
        />
      ) : (
        children
      )}
    </ChallengerContext.Provider>
  )
}

export default ChallengerProvider

export { ChallengerContext, ChallengerProvider, useChallengerContext }
