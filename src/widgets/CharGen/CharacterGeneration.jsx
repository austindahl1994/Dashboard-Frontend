import { useState, useEffect } from "react";
import EditTraits from "./EditTraits";
import ShowTable from "./ShowTable";
import generateRandomTraits from "./generateRandomTraits";
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
  const [randomTraits, setRandomTraits] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  //update later to be a function and take in data to parse
  useEffect(() => {
    const uniqueTraits = {};
    let lastElement; //keeps track of the last element, so when there is a percentage after it can delete the last set string and add as an array of [trait, percent]
    fileData.forEach((arr) => {
      //goes through each array from file, each line is an array
      if (arr.length === 0) return;
      arr.forEach((element, index) => {
        if (index === 0) {
          //first trait in array
          let kn = capitalizeFirstLetter(element);
          if (!uniqueTraits[element]) {
            uniqueTraits[kn] = new Set(); //create a new key kn with value of a set
          }
        } else {
          const category = capitalizeFirstLetter(arr[0]); //gets the first value of array, which was made when index is 0
          if (arr.length > 1 && element) {
            //for when there's more than just one string, like the Traits top left index
            if (typeof element === "number" && !isNaN(element)) {
              //checks if it is a number, if so, delete last entry into the set, and add an array of [trait, percent]
              uniqueTraits[category].delete(lastElement);
              uniqueTraits[category].add([lastElement, element]);
              lastElement = null; //since it was updated, lastElement shouldnt hold a value now that purpose was served
            } else if (typeof element === "string") {
              //since it wasn't a number, means that there is no percent, just the trait
              uniqueTraits[category].add(element);
              lastElement = element;
            }
          }
        }
      });
    });

    //now that the traits are made of [k,v] : [traitName, set()], change to [traitName: array[]] for use
    const newArrObj = {};
    Object.entries(uniqueTraits).forEach(([k, v]) => {
      //iterate through all keys of object
      newArrObj[k] = Array.from(v).map((trait) => ({
        //iterate through set, making it into an array
        trait: Array.isArray(trait) //checks if its just a string for traitName, or if its an array for [trait, percent] pair
          ? capitalizeFirstLetter(trait[0]) //is a pair, so should be the first element of list
          : capitalizeFirstLetter(trait), //is just a string for traitName or title, capitalize and move on
        percent: Array.isArray(trait) ? trait[1] : 0, //auto assigns value of 0 for any trait that doesnt have a percent
      }));
    });

    setTraits(newArrObj);
  }, []);

  useEffect(() => {
    generateRandomTraits(updateRandomTraitsFunc, traits);
  }, [traits]);

  const handleRandomizeClick = () => {
    generateRandomTraits(updateRandomTraitsFunc, traits);
  };

  const updateRandomTraitsFunc = (traitsObj) => {
    setRandomTraits(traitsObj);
  };

  const changeEditState = (value) => {
    setIsEditing(value);
  };

  //do check if position.y is zero, or should be a traitName header
  //need to add a check if there is no trait header, set it to none
  //add a check if there is no object at that position of array, push new object on
  const addNewTrait = (newTrait, position) => {
    let traitAtLocation = {};
    const newTraits = { ...traits };
    const keys = Object.keys(traits);

    if (position[0] === 0) {
      //check if there is a trait header there, if not then create one
      //console.log("Tried updating a trait header, other logic here");
      if (keys[position[1]]) {
        console.log("There is a key here of:", keys[position[1]]);
        keys[position[1]] = newTrait.trait;
      } else {
        newTraits[newTrait.trait] = new Array();
      }
      setTraits(newTraits);
      return;
    }

    let traitHeader = keys[position[1]];
    // console.log(traitHeader);
    if (traitHeader === undefined) {
      console.log("No trait header!"); //no header, so create a new trait header, then push it onto the array for it
      return;
    }
    // console.log(traits[traitHeader]);
    // console.log(traits[traitHeader][position[0] - 1]); //-1 due to the header, should
    //do a check to see if there is no header, to force them to add one? Or just set it to none
    if (traits[traitHeader][position[0] - 1] !== undefined) {
      traitAtLocation = traits[traitHeader][position[0] - 1];
    } else {
      traitAtLocation = { trait: null, percent: null };
    }

    if (
      traitAtLocation.trait === newTrait.trait &&
      traitAtLocation.percent === newTrait.percent
    ) {
      console.log("They are the same!");
      return;
    } else if (traitAtLocation.trait === newTrait.trait) {
      //update trait at location with new percentage
      console.log("updating with new percent");
      traits[traitHeader][position[0] - 1] = newTrait;
    } else {
      //push object onto the array
      //console.log("pushing onto array instead since nothing there");
      traits[traitHeader].push(newTrait);
    }
    setTraits(traits);
  };

  const deleteTrait = (x, y) => {
    let afterRemoval = { ...traits };
    if (x === 0) {
      delete afterRemoval[Object.keys(traits)[y]];
    } else {
      afterRemoval[Object.keys(traits)[y]].splice(x - 1, 1);
    }
    setTraits(afterRemoval);
  };

  //update later on to have buttons along with the components as a whole
  return (
    <div>
      {!isEditing ? (
        <ShowTable traits={traits} editButtonFunc={changeEditState} />
      ) : (
        <EditTraits
          traits={traits}
          addTraitFunc={addNewTrait}
          deleteTraitFunc={deleteTrait}
          saveButtonFunc={changeEditState}
        />
      )}
      <br />
      <h2>Randomized Traits</h2>
      <table>
        <tbody>
          {Object.entries(randomTraits).map(([k, v], i) => (
            <tr key={i}>
              <td>
                {k}: {v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleRandomizeClick}>Randomize</button>
    </div>
  );
};

//Add this later to the function that parses data, or its own utility function
const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default CharacterGeneration;
