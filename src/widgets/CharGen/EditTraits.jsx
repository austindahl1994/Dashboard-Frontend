import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ShowCell from "./ShowCell";
import EditCell from "./EditCell";

const EditTraits = ({
  traits,
  addTraitFunc,
  deleteTraitFunc,
  saveButtonFunc,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState([]);
  const [newTraits, setNewTraits] = useState([]);
  const [maxDimensions, setMaxDimensions] = useState([-1, -1]);

  useEffect(() => {
    setNewTraits(generateNewTable(traits));
  }, [traits]);

  const generateNewTable = (traits) => {
    const traitKeys = Object.keys(traits);
    const maxHeight = traitKeys.length;
    let maxWidth = 0;

    for (const key of traitKeys) {
      //console.log(traits[key]);
      const arrAmount = traits[key].length;
      if (arrAmount > maxWidth) {
        maxWidth = arrAmount;
      }
    }
    setMaxDimensions([maxWidth + 1, maxHeight + 1]);
    //console.log(`Width of ${maxWidth} and height of ${maxHeight}`);

    //Creates a 2D array as an array of arrays containing strings if first element (what the trait is) or objects if it's a trait.
    //If the rowIndex is 0, it means that the trait name should be along the left side of the table
    //If index is not 0, checks to see if something exists at that location in the traits, if null (nothing there), then it returns empty string
    const generatedTable = Array.from(
      { length: maxHeight + 1 },
      (_, colIndex) =>
        //reason for +2 is that the first element is the name of traits, +1 so it goes to end, +1 so it has an empty last column
        Array.from({ length: maxWidth + 2 }, (_, rowIndex) => {
          if (rowIndex === 0) {
            return traitKeys[colIndex] || " ";
          } else {
            return (
              traits[traitKeys[colIndex]]?.[rowIndex - 1] || {
                trait: null,
                percent: null,
              }
            );
          }
        })
    );

    //console.log(generatedTable); //Shows the entire table
    return generatedTable;
  };

  const changeEditState = (pos) => {
    setIsEditing(true);
    setPosition(pos);
    console.log(pos);
  };

  //called from child component when editing is completed
  //tabbed only needs to be checked here to move onto next value
  const finishUpdating = (value, tabbed) => {
    let text = value.trim();
    let newTraitObj = {};
    if (text.length === 0) {
      //console.log(`position of ${position}`);
      //do a check if there is any object at that location already
      if (position[0] === 0 && position[1] < maxDimensions[1]) {
        deleteTraitFunc(position[0], position[1]);
      } else if (traits[Object.keys(traits)[position[1]]][position[0] - 1] && position[0] !== 0) {
        // console.log("There was something here but nothing was typed");
        // console.log(traits[Object.keys(traits)[position[1]]][position[0] - 1]);
        deleteTraitFunc(position[0], position[1]);
      } else {
        //console.log("Nothing was typed!");
      }
      setIsEditing(false);
      setPosition(null);
      return;
    }

    if (text.includes(",")) {
      //TODO: need to add a check to see if it's a number
      // console.log("Has a comma");
      const trait = text.split(",")[0];
      const percent = parseInt(text.split(",")[1]);
      newTraitObj = {
        trait: trait,
        percent: isNaN(percent) ? 0 : percent,
      };
    } else {
      newTraitObj = {
        trait: text,
        percent: 0,
      };
    }
    //tab check here
    //console.log(`Tabbed: ${tabbed}`);
    addTraitFunc(newTraitObj, position);

    if (tabbed) {
      if (position[0] + 1 <= maxDimensions[0] + 1) {
        console.log("Should tab over");
        setPosition([position[0] + 1, position[1]]);
      }
    } else {
      setIsEditing(false);
      setPosition(null);
    }
  };

  const newHeader = () => {
    console.log("Creating new header");
    setPosition([0, maxDimensions[1] - 1]);
    setIsEditing(true);
  };

  return (
    <>
      <h1>Edit Table</h1>
      <table>
        <tbody>
          {newTraits.map((yArr, yIndex) => (
            <tr key={yIndex}>
              {yArr.map((xArrElement, xIndex) => (
                <React.Fragment key={xIndex}>
                  {/*Add a check here if editing, show the td as a single td (span of 2) and have state "text" as trait, percent (if not null) at index [xpos, ypos]*/}
                  {/*EDGE CASE: if clicking first element of array, should update it to just be a string, no percent. So same edit but don't look for comma with split or add a percent value after, keep as string */}
                  {/*On unfocus/return key, update and generate new table with updated data (check previous object in array if null, move it to front)*/}
                  {/*On tab, as if clicking on next cell, check if exists lengthwise, if not then create it/edit it (push new obj onto array of null, null, then as if clicking on it)*/}
                  {/*Along the lines of isEditing ? <EditingTD /> : CURRENT FRAGMENTS*/}
                  {isEditing &&
                  position[0] === xIndex &&
                  position[1] === yIndex ? (
                    <EditCell
                      trait={
                        typeof xArrElement === "object"
                          ? xArrElement.trait
                          : xArrElement
                      }
                      percent={xArrElement.percent}
                      finishFunc={finishUpdating}
                    />
                  ) : (
                    <ShowCell
                      xArrElement={xArrElement}
                      index={[xIndex, yIndex]}
                      editFunc={changeEditState}
                      dimensions={maxDimensions}
                      newHeaderFunc={newHeader}
                    />
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => saveButtonFunc(false)}>Save</button>
    </>
  );
};
/*
  3x5 arr
  [[1, 2, 3, 4, 5], 
   [1, 2, 3, 4, 5], 
   [1, 2, 3, 4, 5]]
  */

EditTraits.propTypes = {
  traits: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.shape({
          trait: PropTypes.string,
          percent: PropTypes.number,
        })
      ),
    ])
  ),
  addTraitFunc: PropTypes.func,
  deleteTraitFunc: PropTypes.func,
  saveButtonFunc: PropTypes.func,
};

export default EditTraits;
