import { useContext, useEffect, useRef, useState } from "react";
import { Accordion, Button, Modal, Table } from "react-bootstrap";
import { ToastContext } from "../../main-components/ToastContext";
import Cell from "./Cell";
import generateRandomTraits from "./generateRandomTraits";
import "./characterGeneration.css";
import {
  createProfile,
  deleteProfile,
  getProfile,
  getRecentProfiles,
} from "../../api";

const blankProfile = [
  {
    trait: null,
    properties: [],
  },
];

const tempProfile = [
  {
    trait: "eye-color",
    properties: [
      {
        property: "blue",
        percent: 0,
      },
      {
        property: "red",
        percent: 7,
      },
    ],
  },
  {
    trait: "hair-color",
    properties: [
      {
        property: "brown",
        percent: 7,
      },
      {
        property: "pink",
        percent: 12,
      },
      {
        property: "black",
        percent: 15,
      },
      {
        property: "teal",
        percent: 11,
      },
    ],
  },
];

//BETTER UNDERSTANDING OF USEEFFECT DEPENDENCIES and USECALLBACK for no inf renders
const CharacterGeneration = () => {
  const { createToast } = useContext(ToastContext);
  const [loadedProfiles, setLoadedProfiles] = useState([]);
  const [table, setTable] = useState(() => {
    const savedProfile = localStorage.getItem("profile");
    return savedProfile ? JSON.parse(savedProfile) : tempProfile;
  });
  const [title, setTitle] = useState(() => {
    const loadedTitle = localStorage.getItem("title");
    return loadedTitle ? JSON.parse(loadedTitle) : "New Profile";
  });
  const [editingTitle, setEditingTitle] = useState(false);

  const [newTrait, setNewTrait] = useState("");
  const [editingTrait, setEditingTrait] = useState(false);
  const [randomizedTraits, setRandomizedTraits] = useState([]);

  const [saved, setSaved] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const hasRun = useRef(false);

  //When table is updated, generates random traits based on table data
  useEffect(() => generateRandomTraits(updateRandomTraits, table), [table]);

  //API call to get names of profiles in database, used in get requests to load profile data
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const getData = async () => {
      try {
        const response = await getRecentProfiles();
        const arr = response.data.map((obj) => {
          return obj.name;
        });

        if (response.data.length > 0) {
          setLoadedProfiles(arr);
          localStorage.setItem("recentProfiles", JSON.stringify(arr));
        }
      } catch (error) {
        console.log(`Could not get recent profiles`);
        console.error(`Error: ${error}`);
      }
    };
    getData();
  }, []);

  //Helper fn passed into generateRandom to modify randomTraits state
  const updateRandomTraits = (data) => {
    setRandomizedTraits(data);
  };

  //Generates new random traits
  const handleRandomizeClick = () => {
    generateRandomTraits(updateRandomTraits, table);
  };

  //Checks if first table object is empty
  const checkEmptyObject = () => {
    return table[0].trait === null;
  };

  //POST request to backend, if successful updates localstorage
  const handleSave = async () => {
    try {
      const response = await createProfile(title, table);
      if (response?.data) {
        console.log(`Successfully saved profile`);
        createToast(`Successfully saved profile: ${title}`, 1);
        const newTitle =
          JSON.parse(localStorage.getItem("recentProfiles")) || [];
          if (!newTitle.includes(title)) {
            let finalArr = [...newTitle, title];
            localStorage.setItem("recentProfiles", JSON.stringify(finalArr));
            setLoadedProfiles(finalArr);
          }
        setSaved(true);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      createToast("Could not save profile", 0);
    }
  };

  //When clicking on a new profile to start fresh
  const handleNew = async () => {
    setTitle("New Profile");
    setTable(blankProfile);
    setSaved(false);
    localStorage.setItem("profile", JSON.stringify(blankProfile));
    localStorage.setItem("title", JSON.stringify("New Profile"));
  };

  //Button calls to show modals
  const handleLoad = () => {
    !saved && setShowConfirmModal(true);
    setShowLoadModal(true);
  };

  //Profile selected from a button in load modal, gets profile and sets tablestate to [obj]
  const loadProfile = async (profile) => {
    try {
      const response = await getProfile(profile);
      if (response.data) {
        setTitle(response.data.name);
        setTable(response.data.properties);
        setSaved(true);
        localStorage.setItem("title", JSON.stringify(response.data.name));
        localStorage.setItem(
          "profile",
          JSON.stringify(response.data.properties)
        );
      }
    } catch (error) {
      console.log(`Error getting profile: ${error}`);
    }
  };

  //Deletes the profile from database
  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      const response = await deleteProfile(title);
      if (response?.data) {
        console.log(response.data.message);
        const profileArr = JSON.parse(localStorage.getItem("recentProfiles"));
        console.log(`Obtained recentProfiles: ${profileArr}`);
        const newArr = profileArr.filter((str) => {
          return str !== title;
        });
        setLoadedProfiles(newArr);
        console.log(`New Array after filter: ${newArr}`);
        localStorage.setItem("recentProfiles", JSON.stringify(newArr));
        createToast("Successfully deleted profile", 1);
        handleNew();
      }
    } catch (error) {
      createToast("Could not delete profile", 0);
      console.error(`Error: ${error}`);
    }
  };

  //Updates title from input
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  //OnBlur, updates title locally and in title state
  const finalizeTitleChange = () => {
    setEditingTitle(false);
    setSaved(false);
    localStorage.setItem(
      "title",
      JSON.stringify(title.length === 0 ? "New profile" : title)
    );
  };

  //Creates new trait name from input
  const handleTraitChange = (e) => {
    setNewTrait(e.target.value);
  };

  //When a cell is updated, update table with new data
  const modifyTable = (index, newProfileObj) => {
    setTable((prevTable) => {
      const newTable = structuredClone(prevTable);
      setSaved(false);
      newTable[index] = newProfileObj;
      localStorage.setItem("profile", JSON.stringify(newTable));
      return newTable;
    });
  };

  //When trait is created, create new object and add to table array
  const createTrait = () => {
    if (newTrait === "") {
      return;
    }
    setSaved(false);
    //console.log(`New trait is: ${newTrait}`);
    setTable((prevTable) => {
      const newTable = structuredClone(prevTable);
      const newObj = {
        trait: newTrait,
        properties: [],
      };
      if (newTable[0].trait === null) {
        newTable.shift();
      }
      newTable.push(newObj);
      localStorage.setItem("profile", JSON.stringify(newTable));
      return newTable;
    });
    setNewTrait("");
  };

  //checks for enter and tab keys to finalize input
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "tab") {
      e.target.blur();
      e.preventDefault();
    }
  };

  return (
    <div>
      {/*Accordion to show both table and randomizedTraits data */}
      <Accordion defaultActiveKey={["1"]} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{title}</Accordion.Header>
          <Accordion.Body>
            {editingTitle ? (
              <input
                type="text"
                autoFocus
                className="form-control m-2 w-50"
                value={title}
                onBlur={finalizeTitleChange}
                onChange={(e) => {
                  handleTitleChange(e);
                }}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <h1
                onClick={() => {
                  setEditingTitle(true);
                }}
              >
                {title.length === 0 ? "New Profile" : title}
              </h1>
            )}
            <Table striped bordered>
              <tbody>
                {table.map((profileObj, index) => (
                  <tr key={index}>
                    {profileObj.trait === null || profileObj.trait === "" ? (
                      <></>
                    ) : (
                      <Cell
                        profileObject={profileObj}
                        index={index}
                        modifyTable={modifyTable}
                        keyDown={handleKeyDown}
                      />
                    )}
                  </tr>
                ))}
                <tr>
                  {editingTrait ? (
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        autoFocus
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                          setEditingTrait(false);
                          createTrait();
                        }}
                        onChange={(e) => {
                          handleTraitChange(e);
                        }}
                      />
                    </td>
                  ) : (
                    <td
                      onClick={() => {
                        setEditingTrait(true);
                      }}
                    >
                      <Button variant="success" className="w-100">
                        New Trait
                      </Button>
                    </td>
                  )}
                </tr>
              </tbody>
            </Table>
            <div className="d-flex justify-content-center align-items-center">
              <Button className="custom-btn" onClick={handleSave}>
                Save Profile
              </Button>
              <Button
                className="custom-btn"
                variant="success"
                onClick={() => {
                  !checkEmptyObject() ? setShowConfirmModal(true) : handleNew();
                }}
              >
                New Profile
              </Button>
              <Button
                className="custom-btn"
                variant="info"
                onClick={handleLoad}
              >
                Load Profile
              </Button>
              <Button
                className="custom-btn"
                variant="danger"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                Delete Profile
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Randomized Traits</Accordion.Header>
          <Accordion.Body>
            <Table className="w-25" striped bordered>
              <tbody>
                {randomizedTraits.map((obj, index) => (
                  <tr key={index}>
                    <td>{obj.trait}</td>
                    <td>{obj.property}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button onClick={handleRandomizeClick}>Randomize</Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* CONFIRMATION MODAL */}
      <Modal
        show={showConfirmModal}
        onHide={() => {
          setShowConfirmModal(false);
        }}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          You have unsaved work, would you like to continue without saving?
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            variant={saved ? "primary" : "success"}
            disabled={saved}
            onClick={() => {
              setShowConfirmModal(false);
              !showLoadModal && handleNew();
              handleSave();
            }}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirmModal(false);
              setShowLoadModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant={saved ? "success" : "danger"}
            onClick={() => {
              setShowConfirmModal(false);
              !showLoadModal && handleNew();
            }}
          >
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
      {/* LOAD PROFILE MODAL */}
      <Modal
        show={!showConfirmModal && showLoadModal}
        onHide={() => {
          setShowLoadModal(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Load Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-wrap">
          {loadedProfiles.map((element, index) => (
            <Button
              key={index}
              className="m-2"
              onClick={() => {
                setShowLoadModal(false);
                loadProfile(element);
              }}
            >
              {element}
            </Button>
          ))}
        </Modal.Body>
      </Modal>
      {/* DELETE PROFILE MODAL */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
        }}
        centered
      >
        <Modal.Body>Are you sure you want to delete: {title}?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CharacterGeneration;
