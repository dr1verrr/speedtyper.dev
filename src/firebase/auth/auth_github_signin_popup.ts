import { GithubAuthProvider, signInWithPopup } from 'firebase/auth'

import { auth } from '../config/firebase'

const signinWithGithubPopup = async () => {
  const githubProvider = new GithubAuthProvider()

  return await signInWithPopup(auth, githubProvider)
}

export default signinWithGithubPopup
