import { useContext } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "react-bootstrap/Toast";
import "../main-styles/toasts.css";
const Toasts = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          bg={toast.status}
          position={"top-end"}
          onClose={() => {
            removeToast(toast.id);
          }}
          autohide
          delay={3000}
          animation={true}
        >
          <Toast.Header>
            <strong className="w-100">Notification:</strong>
          </Toast.Header>
          <Toast.Body style={{ color: "white" }}>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </div>
  );
};

export default Toasts;
