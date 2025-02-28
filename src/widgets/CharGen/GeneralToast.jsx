import { Toast, ToastContainer } from 'react-bootstrap'
import PropTypes from "prop-types";

//blue - 'primary', green - 'success', red - 'danger', yellow - 'warning'
const GeneralToast = ({ id, status, message, closeToastFn }) => {
  return (
    <>
      <ToastContainer position='top-right'>
        <Toast bg={status} animation={false} delay={5000} onClose={() => closeToastFn(id)}>
          <Toast.body>
            {message}
          </Toast.body>
        </Toast>
      </ToastContainer>
    </>
  )
}

GeneralToast.propTypes = {
  id: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  closeToastFn: PropTypes.func.isRequired
}

export default GeneralToast
