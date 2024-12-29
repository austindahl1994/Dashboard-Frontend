import { useContext, useState } from 'react'
import Toast from 'react-bootstrap/Toast';
import { ToastContext } from './ToastContext'

const Toasts = () => {
  const {toasts, removeToast} = useContext(ToastContext)

  useEffect(() => {
    const timeoutIds = toasts.map((toast) => {
      setTimeout(() => {
        removeToast(toast.id)
      }, 5000)
    })

    return () => {
      timeoutIds.forEach(clearTimeout)
    }
  }, [toasts, removeToast])

  return (
    <div className='toast-container'>
      {toasts.map((toast, index) => (
        <Toast key={toast.id} bg={toast.status}>
            <Toast.Header>
              Notification:
            </Toast.Header>
          <Toast.body>
            {toast.message}
          </Toast.body>
        </Toast>
      ))}
    </div>
  )
}

export default Toasts
