import $auth from '@/store/auth/store'
import { useStore } from 'effector-react'

export default function RequireAuthentication<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  displayOnAuthenticated = true
) {
  const isAuthenticated = useStore($auth)

  return function (props: P) {
    if (displayOnAuthenticated && isAuthenticated) {
      return <WrappedComponent {...props} />
    }

    if (!displayOnAuthenticated) {
      return <WrappedComponent {...props} />
    }

    return null
  }
}
