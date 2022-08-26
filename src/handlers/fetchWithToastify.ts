import { toast } from 'react-toastify'

const fetchWithToastify = async <T extends (...args: any) => any>(
  func: T extends (...args: any) => infer R ? R : any,
  messages?: {
    error?: string
    pending?: string
    success?: string
  }
) => {
  const defaultMessages = {
    error: 'Something went wrong...',
    pending: 'Loading...',
    success: 'Success'
  }

  messages = { ...defaultMessages, ...messages }

  return await toast.promise(func, {
    error: messages.error,
    pending: messages.pending,
    success: messages.success
  })
}

export default fetchWithToastify
