import { useState, useEffect, useContext } from "react";
import EditTraits from "./EditTraits";
import generateRandomTraits from "./generateRandomTraits";
import { Accordion, Button, Table } from "react-bootstrap";
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
import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from "./charGenApi";
import { ToastContext } from "../../main-components/ToastContext";

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

  const importTraits = (newTraits) => {
    transformTraits(newTraits, updateTraitsfn);
  };

  const handleRandomizeClick = () => {
    generateRandomTraits(updateRandomTraitsFunc, traits);
  };

  const updateRandomTraitsFunc = (traitsObj) => {
    setRandomTraits(traitsObj);
  };

  const updateTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleAPI = async (reqType, profile) => {
    let resType = "";
    try {
      let response;
      switch (reqType) {
        case "get":
          response = await getProfile(1, profile.name);
          resType = "get";
          break;
        case "post":
          response = await createProfile(profile.name, profile.properties);
          resType = "create";
          break;
        case "put":
          response = await updateProfile(
            profile.id,
            profile.name,
            profile.properties
          );
          resType = "update";
          break;
        case "delete":
          response = await deleteProfile(profile.id, profile.name);
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
        return response
      } else {
        console.log(`No Toast Success for ${resType}!`);
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
  return (
    <>
      <div>
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
        <br />
        <Button
          onClick={async () => {
            console.log(`Testing get`);
            const tester = await handleAPI("get", { name: "testProfile" });
            if (tester.success && tester.data.properties !== undefined) {
              console.log(`Test name: ${tester.data.name}`);
              setTitle(tester.data.name);
              setTraits(tester.data.properties);
            }
          }}
        >
          Get Profile
        </Button>
      </div>
    </>
  );
};

export default CharacterGeneration;
