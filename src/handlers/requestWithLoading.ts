import { toast } from 'react-toastify'

import { loadingChanged } from '@/store/ui/events'
import convertMessage from '@/utils/convertMessage'

const requestWithLoading = <K>(func: () => K) => {
  const setLoading = loadingChanged

  try {
    setLoading(true)
    return func()
  } catch (err: any) {
    const message = convertMessage(err.message)
    toast.error(message)
    throw err
  } finally {
    setLoading(false)
  }
}

export default requestWithLoading
