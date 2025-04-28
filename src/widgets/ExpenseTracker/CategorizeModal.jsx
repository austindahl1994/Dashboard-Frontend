import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import PropTypes from "prop-types";
import ModalGrid from "./ModalGrid";
import { useState } from "react";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";
import "./styles/modalStyle.css";

const CategorizeModal = ({
  showModal,
  setShowModal,
  categories,
  setCategories,
  subCategories,
  setSubCategories,
}) => {
  //add for updates to cats and subcats: , modifyCatFn, modifySubCatFn
  const [settings, setSettings] = useState({
    Size: "Medium",
    Spacing: "Evenly",
  }); //badge sizes, add/edit/delete mode(?), spacing of start, center, end
  const [showSettings, setShowSettings] = useState(false);

  const settingsObj = {
    Size: ["Small", "Medium", "Large"],
    Spacing: ["Left", "Evenly", "Right"],
  };

  const changeSettings = (name, value) => {
    setSettings((prev) => {
      const copy = structuredClone(prev);
      copy[name] = value;
      //console.log(copy[name])
      return copy;
    });
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        fullscreen
      >
        <Modal.Body>
          <Tabs defaultActiveKey="subCategories" fill>
            {["subCategories", "categories"].map((str, i) => (
              <Tab
                eventKey={str}
                title={str === "subCategories" ? "Subcategories" : "Categories"}
                key={i}
              >
                <ModalGrid
                  title={str}
                  category={categories}
                  subCategory={subCategories}
                  setCategories={setCategories}
                  setSubCategories={setSubCategories}
                  settings={settings}
                />
              </Tab>
            ))}
          </Tabs>
        </Modal.Body>
        {/**SETTINGS AND DONE BUTTON */}
        <Modal.Footer className="d-flex justify-content-between w-100">
          {showSettings ? (
            <IoSettings
              size={25}
              onClick={() => setShowSettings(!showSettings)}
            />
          ) : (
            <IoSettingsOutline
              size={25}
              onClick={() => setShowSettings(!showSettings)}
            />
          )}
          <div className="d-flex align-items-stretch">
            {showSettings &&
              Object.keys(settingsObj).map((objKey, index) => (
                <form
                  key={index}
                  name={objKey}
                  onSubmit={(e) => e.preventDefault()}
                  className="d-flex align-items-center mx-4"
                >
                  {objKey}:
                  {settingsObj[objKey].map((str, arrIndex) => (
                    <Button
                      className="mx-1"
                      key={arrIndex}
                      disabled={settings[objKey] === str}
                      onClick={() => changeSettings(objKey, str)}
                    >
                      {str}
                    </Button>
                  ))}
                </form>
              ))}
          </div>
          <Button onClick={() => setShowModal(false)}>Done</Button>
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
