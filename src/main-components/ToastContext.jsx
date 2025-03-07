import { createContext, useState } from "react";
import { v4 as uuid4 } from 'uuid'
import PropTypes from "prop-types";

const ToastContext = createContext();

// //blue - 'primary', green - 'success', red - 'danger', yellow - 'warning'
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const createToast = (message, status) => {
    //console.log(
    //  `Attempting to create toast with message: ${message} and status: ${status}`
    //);
    let color;
    switch (status) {
      case 0:
        color = "danger";
        break;
      case 1:
        color = "success";
        break;
      case 2:
        color = "warning";
        break;
      default:
        color = "primary";
    }

    const newToast = {
      id: uuid4(),
      message: message,
      status: color,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, createToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ToastContext, ToastProvider };
