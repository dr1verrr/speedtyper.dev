import 'react-toastify/dist/ReactToastify.min.css'

import { useEvent, useStore } from 'effector-react'
import { ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createUseStyles, ThemeProvider } from 'react-jss'
import { ToastContainer } from 'react-toastify'

import useMediaQuery from '@/hooks/useMediaQuery'
import NavBar from '@/layout/NavBar'
import { darkTheme, lightTheme } from '@/services/theme/themes'
import { Theme } from '@/services/theme/types'
import { LocalStorageKeys } from '@/store/theme/constants'
import { themeChanged } from '@/store/theme/events'
import $theme, { ThemeStore } from '@/store/theme/store'
import { loadState } from '@/utils/localStorage'
import { rgba } from '@/utils/styles'

import FetchLoader from '../loaders/FetchLoader'
import Spinner from '../loaders/Spinner'
import { Box } from '../shared'

type LayoutProps = {
  children?: ReactNode
}

const useStyles = createUseStyles<'layout' | 'layoutInner', unknown, Theme>({
  layout: ({ theme }) => ({
    background: theme.common.bg,
    color: rgba(theme.common.text, 0.9),
    height: '100vh',
    width: '100vw',
    position: 'relative',
    display: 'flex',
    maxHeight: '100vh',
    maxWidth: '100vw',
    flexDirection: 'column',
    overflowX: 'hidden',
    '& *::selection': {
      background: rgba(theme.common.text, 0.9),
      color: theme.common.bg
    },
    '& svg': {
      fill: rgba(theme.common.text, 0.9)
    }
  }),
  layoutInner: ({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    position: 'relative',
    flex: 1
  })
})

export default function Layout({ children }: LayoutProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const localTheme: ThemeStore = loadState(LocalStorageKeys.theme || 'light')
  const themeMode = useStore($theme)
  const updateTheme = useEvent(themeChanged)
  const isPrefersModeChecked = useRef(false)
  const isFirstRender = useRef(true)

  const getTheme = (mode: ThemeStore) => {
    switch (mode) {
      case 'dark':
        return darkTheme
      case 'light':
        return lightTheme
    }
  }

  const [currentTheme, setCurrentTheme] = useState(getTheme(localTheme || 'light'))

  const classes = useStyles({ theme: currentTheme })

  const memoizedNavBar = useMemo(() => <NavBar />, [])
  const memoizedFetchLoader = useMemo(() => <FetchLoader />, [])

  const memoizedLayoutInner = useMemo(
    () => (
      <>
        <main className={classes.layoutInner}>{children}</main>
      </>
    ),
    [children, classes]
  )

  useEffect(() => {
    if (isPrefersModeChecked.current || !localTheme) {
      const mode = prefersDarkMode ? 'dark' : 'light'
      setCurrentTheme(getTheme(mode))
      updateTheme(mode)
    }

    if (!isPrefersModeChecked.current) isPrefersModeChecked.current = true
  }, [prefersDarkMode])

  useEffect(() => {
    if (!isFirstRender.current) {
      setCurrentTheme(getTheme(themeMode))
    } else {
      isFirstRender.current = false
    }
  }, [themeMode])

  return (
    <ThemeProvider theme={currentTheme}>
      <div className={classes.layout}>
        {memoizedNavBar}

        <Suspense
          fallback={
            <Box sx={{ position: 'fixed', bottom: 50, left: 50 }}>
              <Spinner size={35} />
            </Box>
          }
        >
          {memoizedLayoutInner}
        </Suspense>
      </div>
      {memoizedFetchLoader}
      <ToastContainer
        position='bottom-center'
        style={{ fontWeight: 'bold' }}
        theme={currentTheme.mode as 'light'}
      />
    </ThemeProvider>
  )
}
