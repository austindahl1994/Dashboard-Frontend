import { createContext, useState } from 'react';

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const createToast = (message, status) => {
    let color;
    switch (status) {
      case 0: color = 'danger';
        break;
      case 1: color = 'success';
        break;
      case 2: color = 'warning'
        break;
      default: color = 'primary'
    }
    
    const newToast = {
      id: Date.now(),
      message: message,
      status: color
    }
    
    setToasts(prevToasts => [...prevToasts, newToast])
  }

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }

  return (
   <ToastContext.Provider value={{toasts, createToast, removeToast}}>
    {children}
   </ToastContext.Provider>
  )
}

export {ToastContext, ToastProvider}
