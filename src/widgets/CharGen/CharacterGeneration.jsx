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
  const [title, setTitle] = useState(""); //character title
  const [randomTraits, setRandomTraits] = useState([]); //array of objects {header, randomTrait}
  const [isEditing, setIsEditing] = useState(false);

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

  // const deleteTrait = (x, y) => {
  //   let afterRemoval = { ...traits };
  //   if (x === 0) {
  //     delete afterRemoval[Object.keys(traits)[y]];
  //   } else {
  //     afterRemoval[Object.keys(traits)[y]].splice(x - 1, 1);
  //   }
  //   setTraits(afterRemoval);
  // };

  //update later on to have buttons along with the components as a whole
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
      </div>
    </>
  );
};

export default CharacterGeneration;
