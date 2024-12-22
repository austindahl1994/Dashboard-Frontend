import { Toast, ToastContainer } from 'react-bootstrap'
//blue - 'primary', green - 'success', red - 'danger', yellow - 'warning'
const GeneralToast = ({ id, status, message, closeToastFn }) => {
  return (
    <>
      <ToastContainer position='top-right'>
        <Toast bg={status} animation={false} delay={3000} onClose(() => closeToastFn(id))>
          <Toast.body>
            {message}
          </Toast.body>
        </Toast>
      </ToastContainer>
    </>
  )
}

export default GeneralToast
