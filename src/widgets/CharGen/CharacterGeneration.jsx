import { useState, useEffect } from "react";
import EditTraits from "./EditTraits";
import ShowTable from "./ShowTable";
import generateRandomTraits from "./generateRandomTraits";
import { Button, Table } from "react-bootstrap";
import {
  addHeader,
  addTrait,
  deleteHeader,
  deleteTrait,
  transformTraits,
  updateHeader,
  updateTrait,
} from "./updateCharacter";
import importCSV from "./importCSV";
import "./characterGeneration.css";
import { getProfile } from "./charGenApi";
import { ToastContext } from '../ToastContext'

const fileData = [
  ["Traits"],
  ["eye-color", "blue", 50, "red", "orange", 7],
  ["height", "tall", "short", "medium", 25, "very tall", 15],
];

// templates /favorite settings
// You could have different %s set up. Like one 'template' has a higher % of
//tall people with blue eyes and one template has a higher percent of short people with red eyes.
//that way if I need a character from a certain region, I can switch templates and not have to mess
//with the individual traits%s and just hit randomize and get what I need

const CharacterGeneration = () => {
  const [traits, setTraits] = useState({}); //just holds initial traits object without changes
  const [title, setTitle] = useState("New Template"); //character title, have in separate component
  const [randomTraits, setRandomTraits] = useState([]); //array of objects [{header, randomTrait}...]
  const [isEditing, setIsEditing] = useState(false); //Won't need this after Title is separate component, both table and title will have their own editing states
  const {createToast} = useContext(ToastContext)
  
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

  const importTraits = (newTraits) => {
    transformTraits(newTraits, updateTraitsfn);
  };

  const handleRandomizeClick = () => {
    generateRandomTraits(updateRandomTraitsFunc, traits);
  };

  const updateRandomTraitsFunc = (traitsObj) => {
    setRandomTraits(traitsObj);
  };

  const changeEditState = (value) => {
    setIsEditing(value);
  };

  const updateTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleAPI = async (reqType, data) => {
    try {
      let response;
      let resType = '';
      switch (reqType) {
        case 'get':
          response = await getProfile(data.id, data.name)
          resType = 'get'
          break;
        case: 'post':
          response = await createProfile(data.name, data.properties)
          resType = 'create'
          break;
        case 'put':
          response = await updateProfile(data.id, data.name, data.properties)
          resType = 'update'
          break;
        case 'delete':
          response = await deleteProfile(data.id, data.name)
          resType = 'delete'
          break;
        default: 
          console.error('A correct api type was not passed in')
          throw new Error('Invalid request type')
      }

      if (response.success) {
        createToast(`Successfully ${reqType === 'get' ? 'got' : resType + 'd'} profile`, 1)
      } else {
        createToast(`Could not ${resType} profile`)
      }
    } catch (error) {
      createToast(`There was an error for request: ${resType} profile, error: ${error}`)
      console.error(error)
    }
  }

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
  return (
    <>
      <h1>{!isEditing && (title || "New Template")}</h1>
      <div>
        {!isEditing ? (
          <ShowTable traits={traits} editButtonFunc={changeEditState} />
        ) : (
          <EditTraits
            traits={traits}
            saveButtonFunc={changeEditState}
            title={title}
            updateTitleFunc={updateTitle}
            modifyTraitsFunc={modifyTraits}
          />
        )}
        <div>
          <label htmlFor="csvFile">Select a CSV file</label>
          <input
            type="file"
            allow="csv"
            id="csvFile"
            name="csvFile"
            onChange={(e) => importCSV(importTraits, e.target.files[0])}
          />
        </div>
        <div style={{ display: "flex" }}>
          <Button>Import from google sheets</Button>
          <Button>Export to sheets</Button>
        </div>
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
        <div>
          <label htmlFor="checkPercent">Show Percents?</label>
          <input type="checkbox" id="checkPercent" name="checkPercent" />
        </div>
        <Button
          onClick={async () => {
            const tester = await getProfile(2, "testProfile");
            console.log(`Test name: ${tester.name}`);
            if (tester.success && tester.data.properties !== undefined) {
              setTitle(tester.data.name)
              setTraits(tester.data.properties)
            }
          }}
        >
          Get Profile
        </Button>
        <Button onClick(() => {handleAPI('get', 'testProfile')})>
          Test Handle API
        </Button>
      </div>
    </>
  );
};

export default CharacterGeneration;
