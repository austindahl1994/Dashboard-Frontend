import { useState } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const CategorizeModal = ({ showModal, setShowModal, categories, subCategories }) => {
  const [unknown, setUnknown] = useState([])
  return (
    <div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        fullscreen
      >
        <Modal.Header closeButton>Categorize</Modal.Header>
        <Modal.Body className="w-100 h-100">

        </Modal.Body>
      </Modal>
    </div>
  );
};

CategorizeModal.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  categories: PropTypes.array,
  subCategories: PropTypes.array
};

export default CategorizeModal;

/*
Ideas:
1. Have tabs, one for assigning strings to subcats (including income?), one for subcats to cats
2. Can drag and drop subcats into cats, strings into subcats, on save will save array of objects name: Set(strings), and update database array objs [{string: array[strings]}]
*/
