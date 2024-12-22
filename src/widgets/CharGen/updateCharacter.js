import { capitalizeFirstLetter } from "./utilityFunctions";

export const addTrait = (data, traits, updateTraitsFn) => {
  let newObj = { ...traits };
  const header = data.header;
  const traitObj = data.trait;
  header.push(traitObj);
  updateTraitsFn(newObj);
};

export const updateTrait = (data, traits, updateTraitsFn) => {
  let newObj = { ...traits };
  const traitObj = data.object;
  const [x, y] = data.index;
  newObj[Object.keys(newObj)[y]][x - 1] = traitObj;
  updateTraitsFn(newObj);
};

export const deleteTrait = (index, oldTraits, updateTraitsFn) => {
  const [x, y] = index;
  let afterRemoval = { ...oldTraits };
  afterRemoval[Object.keys(oldTraits)[y]].splice(x - 1, 1);
  updateTraitsFn(afterRemoval);
};

export const addHeader = (header, oldTraits, updateTraitsFn) => {
  const newObj = { ...oldTraits };
  newObj[header] = new Array();
  updateTraitsFn(newObj);
};

export const updateHeader = (data, oldTraits, updateTraitsFn) => {
  const header = data.header;
  const yPos = data.yPos;
  const newObj = { ...oldTraits };
  newObj[Object.keys(newObj)[yPos]] = header;
  updateTraitsFn(newObj);
};

export const deleteHeader = (index, oldTraits, updateTraitsFn) => {
  let newObj = { ...oldTraits };
  delete newObj[Object.keys(oldTraits)[index]];
  updateTraitsFn(newObj);
};

//Changes Object of arrays {k: [v]} {traitName: [traits]} into an array of sets so it cannot have duplicates [traitName: Set(traits)], then into an array of arrays for use [traitName: [traits]]
export const transformTraits = (data, updateTraitsFn) => {
  const uniqueTraits = {};
  let lastElement; //keeps track of the last element, so when there is a percentage after it can delete the last set string and add as an array of [trait, percent]
  data.forEach((arr) => {
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

  updateTraitsFn(newArrObj);
};
