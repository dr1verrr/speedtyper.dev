import { useStore } from 'effector-react'

import $auth from '@/store/auth/store'

export default function RequireAuthentication<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  displayOnAuthenticated = true
) {
  const uid = useStore($auth)

  return function (props: P) {
    if (displayOnAuthenticated && uid) {
      return <WrappedComponent {...props} />
    }

    if (!displayOnAuthenticated && !uid) {
      return <WrappedComponent {...props} />
    }

    return null
  }
}
