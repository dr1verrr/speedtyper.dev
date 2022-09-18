import { useEvent, useStore } from 'effector-react'
import { ChangeEvent } from 'react'

import { useTheme } from '@/services/theme/actions'
import { preferencesChanged } from '@/store/preferences/events'
import $preferences, { preferencesNames } from '@/store/preferences/store'

import { Box, Stack, TextField, Typography } from '../shared'
import CheckBox from '../shared/CheckBox'

export default function Preferences() {
  const preferences = useStore($preferences)
  const setPreferences = useEvent(preferencesChanged)
  const theme = useTheme()

  const actions = {
    updatePreferences: (e: ChangeEvent<HTMLInputElement>) => {
      setPreferences({
        challenger: {
          ...preferences.challenger,
          [e.target.name]:
            !preferences.challenger[
              e.target.name as keyof typeof preferences.challenger.show_progressbar
            ]
        }
      })
    }
  }

  return (
    <Box>
      <Typography
        highlighted
        sx={{ fontWeight: 600 }}
      >
        Preferences
      </Typography>

      <Stack
        direction='column'
        sx={{ marginTop: 10 }}
      >
        <Stack
          spacing={10}
          sx={{ alignItems: 'center' }}
        >
          <CheckBox
            checked={preferences.challenger.show_progressbar}
            name={preferencesNames.challenger.show_progressbar}
            onChange={actions.updatePreferences}
          >
            🚀 Display progress bar in typing process
          </CheckBox>
        </Stack>
        <Stack
          spacing={10}
          sx={{ alignItems: 'center' }}
        >
          <CheckBox
            checked={preferences.challenger.show_controls}
            name={preferencesNames.challenger.show_controls}
            onChange={actions.updatePreferences}
          >
            ⚙️ Display controls
          </CheckBox>
        </Stack>
        <Box
          sx={{
            borderTop: `1px solid ${theme.common.border}`,
            borderBottom: `1px solid ${theme.common.border}`,
            padding: '10px 0',
            margin: '10px 0'
          }}
        >
          <Stack
            spacing={10}
            sx={{ alignItems: 'center' }}
          >
            <CheckBox
              checked={
                preferences.challenger.show_stats && preferences.challenger.collect_stats
              }
              disabled={!preferences.challenger.collect_stats}
              name={preferencesNames.challenger.show_stats}
              style={{ padding: 10 }}
              onChange={actions.updatePreferences}
            >
              📊 Display statistics in typing process
            </CheckBox>
          </Stack>
          <Stack
            spacing={10}
            sx={{ alignItems: 'center' }}
          >
            <CheckBox
              checked={preferences.challenger.collect_stats}
              name={preferencesNames.challenger.collect_stats}
              onChange={actions.updatePreferences}
            >
              📊📮 Collect stats
            </CheckBox>
          </Stack>
        </Box>
        <Stack
          spacing={10}
          sx={{ alignItems: 'center' }}
        >
          <CheckBox
            checked={preferences.challenger.use_challenger_large_view_width}
            name={preferencesNames.challenger.use_challenger_large_view_width}
            onChange={actions.updatePreferences}
          >
            Use challenger large view width
          </CheckBox>
        </Stack>
        <Stack
          direction='column'
          spacing={5}
          sx={{ marginBottom: 15, marginTop: 15 }}
        >
          <Typography>Font family:</Typography>
          <TextField
            spellCheck={false}
            type='text'
            value={preferences.challenger.fontFamily}
            onChange={e => {
              setPreferences({
                challenger: {
                  ...preferences.challenger,
                  fontFamily: e.currentTarget.value
                }
              })
            }}
          />
        </Stack>
        <Stack
          direction='column'
          spacing={5}
        >
          <Typography>Font size: </Typography>
          <TextField
            pattern='\d*'
            spellCheck={false}
            value={preferences.challenger.fontSize}
            onChange={e => {
              const value = e.currentTarget.value
              if (!isNaN(Number(value))) {
                setPreferences({
                  challenger: {
                    ...preferences.challenger,
                    fontSize: Number(value)
                  }
                })
              }
            }}
          />
        </Stack>
      </Stack>
    </Box>
  )
}
