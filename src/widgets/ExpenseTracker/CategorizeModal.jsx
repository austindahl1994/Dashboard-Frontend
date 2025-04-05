import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import PropTypes from "prop-types";
import ModalGrid from "./ModalGrid";
import './modalStyle.css'
import { useState } from "react";

const CategorizeModal = ({
  showModal,
  setShowModal,
  categories,
  setCategories,
  subCategories,
  setSubCategories,
}) => {
  //add for updates to cats and subcats: , modifyCatFn, modifySubCatFn
  const [settings, setSettings] = useState({ badgeSize: 1, mode: "add", spacing: "centered" }); //badge sizes, add/edit/delete mode, spacing of start, center, end
  return (
    <div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        fullscreen
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="subCategories" fill>
            <Tab eventKey="subCategories" title="subCategories">
              <ModalGrid
                title="subCategories"
                category={categories}
                subCategory={subCategories}
                setCategories={setCategories}
                setSubCategories={setSubCategories}
              />
            </Tab>
            <Tab eventKey="categories" title="Categories">
              <ModalGrid
                title="cats"
                category={categories}
                subCategory={subCategories}
                setCategories={setCategories}
                setSubCategories={setSubCategories}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <div>Settings</div>
          <Button onClick={() => setShowModal(false)}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

CategorizeModal.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  categories: PropTypes.array,
  subCategories: PropTypes.array,
  setCategories: PropTypes.func,
  setSubCategories: PropTypes.func,
};

export default CategorizeModal;

/*
Ideas:
1. Have tabs, one for assigning strings to subcats (including income?), one for subcats to cats
2. Can drag and drop subcats into cats, strings into subcats, on save will save array of objects name: Set(strings), and update database array objs [{string: array[strings]}]
*/
