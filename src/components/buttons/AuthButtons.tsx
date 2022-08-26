import Github from '../icons/Github'
import Google from '../icons/Google'
import { Button } from '../shared'
import { signinWithGithubPopup, signinWithGooglePopup } from '@/app/auth'
import fetchWithToastify from '@/handlers/fetchWithToastify'

export default function AuthButtons() {
  return (
    <>
      <Button
        onClick={() =>
          fetchWithToastify(signinWithGithubPopup, {
            pending: 'Authenticating via Github...',
            success: 'Authenticated via Github.'
          })
        }
      >
        <Github />
      </Button>
      <Button
        onClick={() =>
          fetchWithToastify(signinWithGooglePopup, {
            pending: 'Authenticating via Google...',
            success: 'Authenticated via Google.'
          })
        }
      >
        <Google />
      </Button>
    </>
  )
}
