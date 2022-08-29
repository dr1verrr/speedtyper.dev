import { reload, updateProfile } from 'firebase/auth'
import { FormEvent, useRef } from 'react'
import { Link } from 'react-router-dom'

import { signup } from '@/app/auth'
import AuthButtons from '@/components/buttons/AuthButtons'
import { Button } from '@/components/shared'
import Container from '@/components/shared/Container'
import Stack from '@/components/shared/Stack/Stack'
import TextField from '@/components/shared/TextField'
import fetchWithToastify from '@/handlers/fetchWithToastify'

export default function SignIn() {
  const formData = useRef({ email: '', password: '', nickname: '' })

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const { email, password, nickname } = formData.current

    const register = async () => {
      const user = await signup(email, password)
      await updateProfile(user, { displayName: nickname })
      reload(user)
    }

    if (email && password && nickname) {
      fetchWithToastify(register, {
        pending: 'Signing up...',
        success: 'Successfully signed up.'
      })
    }
  }

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    const data = formData.current
    formData.current = { ...data, [e.currentTarget.name]: e.currentTarget.value }
  }

  return (
    <Container maxWidth='sm'>
      <form
        autoComplete='on'
        style={{ padding: 15 }}
        onSubmit={onSubmit}
      >
        <Stack
          direction='column'
          spacing={10}
          sx={{ fontSize: 20 }}
        >
          <Stack
            direction='column'
            spacing={5}
          >
            <label htmlFor='email'>Nickname:</label>
            <TextField
              id='nickname'
              maxLength={30}
              minLength={3}
              name='nickname'
              type='text'
              onChange={onChange}
            />
          </Stack>
          <Stack
            direction='column'
            spacing={5}
          >
            <label htmlFor='email'>Email:</label>
            <TextField
              id='email'
              name='email'
              type='email'
              onChange={onChange}
            />
          </Stack>
          <Stack
            direction='column'
            spacing={5}
          >
            <label htmlFor='password'>Password:</label>
            <TextField
              id='password'
              minLength={6}
              name='password'
              type='password'
              onChange={onChange}
            />
          </Stack>
        </Stack>

        <Stack
          spacing={10}
          style={{ marginTop: 15, justifyContent: 'space-between' }}
        >
          <Button
            style={{ fontSize: 20, padding: '10px 20px' }}
            type='submit'
          >
            Register
          </Button>
          <Stack spacing={10}>
            <AuthButtons />
          </Stack>
        </Stack>

        <Stack
          spacing={3}
          sx={{ marginTop: 15 }}
        >
          <div>Not registered yet ?</div>
          <Link to='/sign-in'>
            <span style={{ textDecoration: 'underline' }}>Sign In</span>
          </Link>
        </Stack>
      </form>
    </Container>
  )
}
