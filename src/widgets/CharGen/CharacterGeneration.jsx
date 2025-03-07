import { useContext, useEffect, useState } from "react";
import { Accordion, Button, Table } from "react-bootstrap";
import { ToastContext } from "../../main-components/ToastContext";
import Cell from "./Cell";
import generateRandomTraits from "./generateRandomTraits";
import "./characterGeneration.css";
import { createProfile, deleteProfile } from "../../api";

const defaultProfile = [
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

//on creation of a new property, if percent === zero, show it as remaining percent / zeros

//EditCell displays as 2 tds when not hovered, when hovered/clicked is a single td colspan2
//When hovered, if zero, then just show trait, same with when clicked, put at end of trait

const CharacterGeneration = () => {
  //Table - Array of objects
  const { createToast } = useContext(ToastContext);
  const [table, setTable] = useState(defaultProfile); //Get locally, if nothing set as default
  const [title, setTitle] = useState("New Profile");
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTrait, setNewTrait] = useState("");
  const [editingTrait, setEditingTrait] = useState(false);
  const [randomizedTraits, setRandomizedTraits] = useState([]);

  useEffect(() => generateRandomTraits(updateRandomTraits, table), [table]);

  const updateRandomTraits = (data) => {
    setRandomizedTraits(data);
  };

  const handleRandomizeClick = () => {
    generateRandomTraits(updateRandomTraits, table);
  };

  const handleSave = async () => {
    try {
      const response = await createProfile(title, table);
      if (response?.data) {
        console.log(`Successfully created profile`)
        createToast(`Successfully saved profile: ${title}`, 1)
      }
    } catch (error) {
      console.error(`Error: ${error}`)
      createToast("Could not save profile", 0)
    }
  }

  // const handleLoad = async () => {
    
  // };

  const handleDelete = async () => {
    try {
      const response = await deleteProfile(title)
      if (response?.data) {
        console.log(response.data.message)
        createToast("Successfully deleted profile", 1)
      }
    } catch (error) {
      createToast("Could not delete profile", 0);
      console.error(`Error: ${error}`)
    }
  }

  //Updates title from input
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  //Creates new trait name from input
  const handleTraitChange = (e) => {
    setNewTrait(e.target.value);
  };

  //When a cell is updated, update table with new data
  const modifyTable = (index, newProfileObj) => {
    setTable((prevTable) => {
      const newTable = structuredClone(prevTable);
      newTable[index] = newProfileObj;
      return newTable;
    });
  };

  //When trait is done being made in input, create new object and add to table array
  const createTrait = () => {
    if (newTrait === "") {
      return;
    }
    setTable((prevTable) => {
      const newTable = structuredClone(prevTable);
      const newObj = {
        trait: newTrait,
        properties: [],
        saved: false,
      };
      newTable.push(newObj);
      return newTable;
    });
    setNewTrait("");
  };

  return (
    <div>
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
                onBlur={() => {
                  setEditingTitle(false);
                }}
                onChange={(e) => {
                  handleTitleChange(e);
                }}
              />
            ) : (
              <h1
                onClick={() => {
                  setEditingTitle(true);
                }}
              >
                {title}
              </h1>
            )}
            <Table striped bordered>
              <tbody>
                {table.map((profileObj, index) => (
                  <tr key={index}>
                    <Cell
                      profileObject={profileObj}
                      index={index}
                      modifyTable={modifyTable}
                    />
                  </tr>
                ))}
                <tr>
                  {editingTrait ? (
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        autoFocus
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
              <Button className="custom-btn" onClick={handleSave}>Save Profile</Button>
              <Button className="custom-btn" variant="success">New Profile</Button>
              <Button className="custom-btn" variant="info">
                Load Profile
              </Button>
              <Button className="custom-btn" variant="danger" onClick={handleDelete}>
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
    </div>
  );
};

export default CharacterGeneration;

/*

const [traits, setTraits] = useState({}); //just holds initial traits object without changes
  const [title, setTitle] = useState("New Template"); //character title, have in separate component
  const [randomTraits, setRandomTraits] = useState([]); //array of objects [{header, randomTrait}...]
  const [profileTitle, setProfileTitle] = useState("");
  const [deleteTitle, setDeleteTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { createToast } = useContext(ToastContext);

  //update later to be a function and take in data to parse
  useEffect(() => {
    transformTraits(fileData, updateTraitsfn);
  }, []);

  useEffect(() => {
    generateRandomTraits(updateRandomTraitsFunc, traits);
    //console.log("Traits changed in CG")
  }, [traits]);

  const updateTraitsfn = (newTraits) => {
    setTraits(newTraits);
  };

  // const importTraits = (newTraits) => {
  //   transformTraits(newTraits, updateTraitsfn);
  // };

  const handleRandomizeClick = () => {
    generateRandomTraits(updateRandomTraitsFunc, traits);
  };

  const updateRandomTraitsFunc = (traitsObj) => {
    setRandomTraits(traitsObj);
  };

  const updateTitle = (event) => {
    setTitle(event.target.value);
  };

  const updateProfileTitle = (e) => {
    setProfileTitle(e.target.value);
  };

  const updateDeleteTitle = (e) => {
    setDeleteTitle(e.target.value);
  };

  const updateModal = (v) => {
    setShowModal(v);
  };

  const handleAPI = async (reqType, profile) => {
    let resType = "";
    try {
      let response;
      switch (reqType) {
        case "get":
          response = await getProfile(profile.name);
          resType = "get";
          break;
        case "post":
          response = await createProfile(profile.name, profile.properties);
          resType = "create";
          break;
        case "put":
          response = await updateProfile(profile.name, profile.properties);
          resType = "update";
          break;
        case "delete":
          response = await deleteProfile(profile.name);
          resType = "delete";
          break;
        default:
          console.error("A correct api type was not passed in");
          throw new Error("Invalid request type");
      }

      if (response.success) {
        createToast(
          `Successfully ${reqType === "get" ? "got" : resType + "d"} profile`,
          1
        );
        return response;
      } else {
        console.log(`Operation was not successful: ${resType}!`);
        createToast(`Could not ${resType} profile`, 0);
        throw new Error(response.error);
      }
    } catch (error) {
      createToast(
        `There was an error for request: ${resType} profile, error: ${error}`
      );
      console.error(error);
    }
  };

  //position is array for [x, y], newTrait is an object of {trait, percent}

  //---------------MODIFY TRAITS ----------------------
  const modifyTraits = (operation, cellType, data) => {
    switch (operation) {
      case "create":
        if (cellType === "header") {
          addHeader(data, traits, updateTraitsfn);
        } else {
          addTrait(data, traits, updateTraitsfn);
        }
        break;
      case "update":
        if (cellType === "header") {
          updateHeader(data, traits, updateTraitsfn);
        } else {
          updateTrait(data, traits, updateTraitsfn);
        }
        break;
      case "delete":
        if (cellType === "header") {
          deleteHeader(data, traits, updateTraitsfn);
        } else {
          deleteTrait(data, traits, updateTraitsfn);
        }
        break;
      default:
        console.log("Invalid operation or entity");
    }
  };

  //Add title component, remove showTable, only use EditTraits as accordian
  //Add RandomizedTraits component to render the table of traits
  //Add component that holds buttons - create (modal with tabs), save, clear, settings (modal)
  //Move and import modify traits to separate utility file
  //Comments for each portion of the code for readability (JSDoc?), eventual testing

<div>
        <Modal
          show={showModal}
          onHide={() => updateModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Variable modal setting</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs defaultActiveKey="first" justify fill>
              <Tab eventKey="first" title="First">
                First tab
              </Tab>
              <Tab eventKey="second" title="Second">
                Second tab
              </Tab>
              <Tab eventKey="third" title="Third">
                Third tab
              </Tab>
              <Tab eventKey="fourth" title="Fourth">
                Fourth tab
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>Test</Modal.Footer>
        </Modal>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{title}</Accordion.Header>
            <Accordion.Body>
              <EditTraits
                traits={traits}
                title={title}
                updateTitleFunc={updateTitle}
                modifyTraitsFunc={modifyTraits}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {/* <div>
          <label htmlFor="csvFile">Select a CSV file</label>
          <input
            type="file"
            allow="csv"
            id="csvFile"
            name="csvFile"
            onChange={(e) => importCSV(importTraits, e.target.files[0])}
          />
        </div> }
        <h2>Randomized Traits</h2>
        <Table striped bordered hover responsive>
          <tbody>
            {randomTraits.map((arrayObj, i) => (
              <tr key={i}>
                <td>
                  {arrayObj.header}: {arrayObj.randomTrait}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={handleRandomizeClick}>Randomize</Button>
        <br />
        <br />
        <div className="w-25">
          <label htmlFor="profileTitle"></label>
          <input
            id="profileTitle"
            name="profileTitle"
            type="text"
            onChange={(e) => updateProfileTitle(e)}
          />
        </div>
        <Button
          onClick={async () => {
            console.log(`Testing get`);
            const profileData = await handleAPI("get", { name: profileTitle });
            console.log(`New Test`);
            if (
              profileData.success &&
              profileData.data.properties !== undefined
            ) {
              console.log(`Profile name: ${profileData.data.name}`);
              // Object.entries(profileData).forEach(([k,v], i) => {
              //   console.log(`Key is: ${k}`)
              //   let tempArr = v.map((e) => {return e})
              //   console.log(`Values: ${tempArr}`)
              // })
              let ta = Object.entries(profileData.data);
              console.log(ta);
              setTitle(profileData.data.name);
              // setTraits(profileData.data.properties);
              transformTraits(profileData.properties, updateTraitsfn);
            }
          }}
        >
          Get Profile
        </Button>
        <div>
          <Button
            onClick={async () => {
              console.log(`Testing create`);
              const profileData = await handleAPI("post", {
                name: title,
                properties: traits,
              });
              if (profileData.success) {
                console.log(`Profile created successfully`);
              }
            }}
          >
            Create Profile
          </Button>
        </div>
        <div className="w-25">
          <label htmlFor="deleteTitle"></label>
          <input
            id="deleteTitle"
            name="deleteTitle"
            type="text"
            onChange={(e) => updateDeleteTitle(e)}
          />
        </div>
        <Button
          onClick={async () => {
            console.log(`Testing delete`);
            const profileData = await handleAPI("delete", {
              name: deleteTitle,
            });
            if (profileData.success) {
              console.log(`Profile deleted successfully`);
            }
          }}
        >
          Delete Profile
        </Button>
        <Button onClick={() => updateModal(true)}>Modal Test</Button>
      </div>

*/
