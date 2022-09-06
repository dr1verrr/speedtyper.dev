import { useEffect, useState } from 'react'

import { useTheme } from '@/services/theme/actions'

const useCodeThemeStyles = () => {
  const theme = useTheme()
  const [codeTheme, setCodeTheme] = useState<string>()

  useEffect(() => {
    const fetchCodeTheme = async () => {
      if (theme.mode === 'light') {
        return await import(`prism-themes/themes/prism-one-light.css`)
      } else {
        return await import(`prism-themes/themes/prism-dracula.css`)
      }
    }

    const fetchedTheme = fetchCodeTheme().then(t => {
      const codeTheme = t.default
      if (codeTheme) {
        const element = document.createElement('style')
        element.setAttribute('type', 'text/css')
        element.innerHTML = codeTheme
        document.head.append(element)
        setCodeTheme(codeTheme)
      }
    })
  }, [theme])

  return { codeTheme }
}

export default useCodeThemeStyles
