import { auth } from '../config/firebase'
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth'

const signinWithGithubPopup = async () => {
  const githubProvider = new GithubAuthProvider()

  return await signInWithPopup(auth, githubProvider)
}

export default signinWithGithubPopup
