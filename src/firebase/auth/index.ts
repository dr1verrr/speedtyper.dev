import signAsGuest from './auth_anon_sign_in'
import getCurrentUser from './auth_get_current_user'
import signinWithGithubPopup from './auth_github_signin_popup'
import signinWithGooglePopup from './auth_google_signin_popup'
import { getAuthData } from './auth_helpers'
import signout from './auth_sign_out'
import signin from './auth_signin_password'
import signup from './auth_signup_password'

export {
  signin,
  signup,
  signout,
  signinWithGooglePopup,
  signinWithGithubPopup,
  getAuthData,
  signAsGuest,
  getCurrentUser
}
