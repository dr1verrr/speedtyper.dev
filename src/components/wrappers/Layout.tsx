import { useEvent, useStore } from 'effector-react'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeProvider } from 'react-jss'
import { ToastContainer } from 'react-toastify'

import FetchLoader from '../loaders/FetchLoader'

import useMediaQuery from '@/hooks/useMediaQuery'
import NavBar from '@/layout/NavBar'
import { darkTheme, lightTheme } from '@/services/theme/themes'
import { LocalStorageKeys } from '@/store/theme/constants'
import { themeChanged } from '@/store/theme/events'
import $theme, { ThemeStore } from '@/store/theme/store'
import { loadState } from '@/utils/localStorage'
import 'react-toastify/dist/ReactToastify.min.css'

type LayoutProps = {
  children?: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const localTheme: ThemeStore = loadState(LocalStorageKeys.theme || 'light')
  const themeMode = useStore($theme)
  const updateTheme = useEvent(themeChanged)

  const isPrefersModeChecked = useRef(false)
  const isFirstRender = useRef(true)

  const memoizedLayoutInner = useMemo(
    () => (
      <>
        <NavBar />
        <main style={{ position: 'relative', minHeight: 'inherit' }}>{children}</main>
        <FetchLoader />
      </>
    ),
    [children]
  )

  const getTheme = (mode: ThemeStore) => {
    switch (mode) {
      case 'dark':
        return darkTheme
      case 'light':
        return lightTheme
    }
  }

  const [currentTheme, setCurrentTheme] = useState(getTheme(localTheme || 'light'))

  const toastContainerTheme = useMemo(() => {
    if (currentTheme.mode === 'light') {
      return 'dark'
    }
    return 'light'
  }, [currentTheme])

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', currentTheme.mode)
  }, [currentTheme])

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
      <div
        style={{
          background: currentTheme.common.bg,
          color: currentTheme.common.text,
          minHeight: '100vh'
        }}
      >
        {memoizedLayoutInner}
      </div>
      <ToastContainer
        position='bottom-center'
        style={{ fontWeight: 'bold' }}
        theme={toastContainerTheme}
      />
    </ThemeProvider>
  )
}
