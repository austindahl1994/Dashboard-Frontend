import { useContext, useEffect } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "react-bootstrap/Toast";
import './toasts.css'
const Toasts = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  useEffect(() => {
    const timeoutIds = toasts.map((toast) => {
      setTimeout(() => {
        removeToast(toast.id);
      }, 5000);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [toasts, removeToast]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} bg={toast.status} position={"top-end"} onClose={() => {removeToast(toast.id)}}>
          <Toast.Header>
            <strong className='w-100'>Notification:</strong>
          </Toast.Header>
          <Toast.Body style={{color: 'white'}}>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </div>
  );
};

export default Toasts;
