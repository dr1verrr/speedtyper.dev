import { ActionCodeSettings } from 'firebase/auth'

export const actionCodeSettings: ActionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for
  // this URL must be whitelisted in the Firebase Console.
  url: process.env.REACT_APP_URL || '',
  // This must be true for email link sign-in.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  // FDL custom domain.
  dynamicLinkDomain: 'coolapp.page.link'
}
