import { Id, toast } from 'react-toastify'

import convertMessage from '@/utils/convertMessage'

const requestWithToastify = async <T extends (...args: any) => any>(
  func: T extends (...args: any) => infer R ? R : any,
  options: {
    showProgress?: boolean
    messages?: {
      error?: string
      pending?: string
      success?: string
    }
  }
) => {
  const defaultMessages = {
    error: 'Something went wrong...',
    pending: 'Loading...',
    success: 'Success'
  }

  const messages = { ...defaultMessages, ...options.messages }
  let toastId: Id | null = null

  try {
    if (options.showProgress) {
      toastId = toast.loading(messages.pending)
      //toast.update(toastId, { type: 'default', isLoading: true, data: messages.pending })
    }
    const resolved = await func()
    if (options.showProgress) {
      toast.update(toastId!, {
        type: 'success',
        isLoading: false,
        render: messages.success,
        autoClose: 2500
      })
    }
    return resolved
  } catch (err: any) {
    const message = convertMessage(err.message)
    if (toastId) {
      toast.update(toastId!, {
        type: 'error',
        isLoading: false,
        render: message || messages.error,
        autoClose: 2500
      })
    } else {
      toast.error(message || messages.error, { autoClose: 2500 })
    }
  }
}

export default requestWithToastify
