import { signinWithGithubPopup, signinWithGooglePopup } from '@/app/auth'
import requestWithToastify from '@/handlers/requestWithToastify'

import Github from '../icons/Github'
import Google from '../icons/Google'
import { Button } from '../shared'

export default function AuthButtons() {
  return (
    <>
      <Button
        onClick={() =>
          requestWithToastify(signinWithGithubPopup, {
            showProgress: true,
            messages: {
              pending: 'Authenticating via Github...',
              success: 'Authenticated via Github.'
            }
          })
        }
      >
        <Github />
      </Button>
      <Button
        onClick={() =>
          requestWithToastify(signinWithGooglePopup, {
            showProgress: true,
            messages: {
              pending: 'Authenticating via Google...',
              success: 'Authenticated via Google.'
            }
          })
        }
      >
        <Google />
      </Button>
    </>
  )
}
