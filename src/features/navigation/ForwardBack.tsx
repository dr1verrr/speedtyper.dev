import { cloneElement, ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

type ForwardBackProps = {
  children: ReactElement
}

export default function ForwardBack({ children }: ForwardBackProps) {
  const navigate = useNavigate()
  const actions = {
    navigateBack: () => {
      navigate(-1)
    }
  }

  return cloneElement(children, { onClick: actions.navigateBack })
}
