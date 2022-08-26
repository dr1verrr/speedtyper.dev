import { signup } from '@/app/auth'
import AuthButtons from '@/components/buttons/AuthButtons'
import { Button } from '@/components/shared'
import Container from '@/components/shared/Container'
import Stack from '@/components/shared/Stack/Stack'
import TextField from '@/components/shared/TextField'
import fetchWithToastify from '@/handlers/fetchWithToastify'
import { reload, updateProfile } from 'firebase/auth'
import { FormEvent, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function SignIn() {
  const formData = useRef({ email: '', password: '', nickname: '' })

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const { email, password, nickname } = formData.current

    const submit = async () => {
      const user = await signup(email, password)
      await updateProfile(user, { displayName: nickname })
      await reload(user)
    }

    if (email && password && nickname) {
      fetchWithToastify(submit, {
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
        onSubmit={onSubmit}
        style={{ padding: 15 }}
      >
        <Stack
          sx={{ fontSize: 20 }}
          direction='column'
          spacing={10}
        >
          <Stack
            direction='column'
            spacing={5}
          >
            <label htmlFor='email'>Nickname:</label>
            <TextField
              name='nickname'
              id='nickname'
              type='text'
              minLength={3}
              maxLength={30}
              onChange={onChange}
            />
          </Stack>
          <Stack
            direction='column'
            spacing={5}
          >
            <label htmlFor='email'>Email:</label>
            <TextField
              name='email'
              id='email'
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
              name='password'
              id='password'
              type='password'
              minLength={6}
              onChange={onChange}
            />
          </Stack>
        </Stack>

        <Stack
          style={{ marginTop: 15, justifyContent: 'space-between' }}
          spacing={10}
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
          sx={{ marginTop: 15 }}
          spacing={3}
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
