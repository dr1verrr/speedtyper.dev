import { loadingChanged } from '@/store/ui/events'
import { toast } from 'react-toastify'

const fetchWithLoading = async <T extends (...args: any) => any>(
  func: T extends (...args: any) => infer R ? R : any
) => {
  const setLoading = loadingChanged

  try {
    setLoading(true)
    return await func()
  } catch (err: any) {
    toast.error(err.message)
  } finally {
    setLoading(false)
  }
}

export default fetchWithLoading
