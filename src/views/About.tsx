import { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import SpinnerWave from '@/components/loaders/SpinnerWave'
import { Box, Container, Typography } from '@/components/shared'
import { useTheme } from '@/services/theme/actions'
import { Theme } from '@/services/theme/types'

const useStyles = createUseStyles<'markdown', unknown, Theme>({
  markdown: ({ theme }) => ({
    '& video': {
      maxWidth: '100%',
      border: `1px solid ${theme.divider}`
    }
  })
})

export default function About() {
  const [readme, setReadme] = useState<string>()
  const [isLoading, setLoading] = useState(true)
  const theme = useTheme()
  const classes = useStyles({ theme })

  useEffect(() => {
    const getReadme = async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/dr1verrr/keyboard-trainer.dev/dev/README.md'
      )
      const md = await response.text()
      console.log('readme', md)
      return md
    }

    getReadme()
      .then(md => {
        setReadme(md)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <Box
        sx={{
          paddingTop: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SpinnerWave />
      </Box>
    )
  }

  if (readme) {
    return (
      <Container
        className={classes.markdown}
        sx={{ maxWidth: 700 }}
      >
        <a
          href='https://github.com/dr1verrr/speedtyper.dev'
          rel='noreferrer'
          target='_blank'
        >
          <Box sx={{ margin: '20px 0' }}>
            <Typography
              highlighted
              sx={{ cursor: 'pointer', maxWidth: 'fit-content' }}
            >
              Github repo
            </Typography>
          </Box>
        </a>

        <Box sx={{ paddingBottom: 50 }}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{readme}</ReactMarkdown>
        </Box>
      </Container>
    )
  }

  return null
}
