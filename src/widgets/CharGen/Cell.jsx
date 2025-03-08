import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
// import { capitalizeFirstLetter } from "./utilityFunctions";
import { Button } from "react-bootstrap";
import "./cell.css";
//Once either trait is edited or propertys updated/added, update array object at index
const Cell = ({ profileObject, index, modifyTable, keyDown }) => {
  const [editingTrait, setEditingTrait] = useState(false);
  const [editingProperty, setEditingProperty] = useState(false);
  const [editingPercent, setEditingPercent] = useState(false);
  const [creatingProperty, setCreatingProperty] = useState(false);

  const [tempTrait, setTempTrait] = useState("");

  const [tempProperty, setTempProperty] = useState("");
  const [tempPercent, setTempPercent] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [createdProperty, setCreatedProperty] = useState("");

  const [allocatedPercent, setAllocatedPercent] = useState(0);

  const generatePercents = useCallback(() => {
    const totalPercent = profileObject.properties.reduce(
      (acc, obj) => acc + obj.percent,
      0
    );
    const totalZeros = profileObject.properties.filter(
      (obj) => obj.percent === 0
    ).length;
    const availablePercent =
      (100 - totalPercent) / (totalZeros > 0 ? totalZeros : 1);

    setAllocatedPercent(availablePercent);
  }, [profileObject]);

  useEffect(() => {
    generatePercents();
  }, [generatePercents]);

  const modifyTrait = (input) => {
    if (profileObject.trait === input) {
      console.log(`Same trait passed in`);
      return;
    }
    const newObj = {
      trait: input,
      properties: profileObject.properties,
    };
    finalize(newObj);
  };

  const modifyProperty = (input, propIndex) => {
    //checks if passed in percent is a valid number
    if (isNaN(Number(input.percent))) {
      console.log(`Not a number for percent`);
      return;
    }

    //check if object is same as before
    if (
      input.property === profileObject.properties[propIndex].property &&
      input.percent === profileObject.properties[propIndex].percent
    ) {
      console.log(`Same property passed in`);
      return;
    }
    const newArr = structuredClone(profileObject.properties);
    newArr[propIndex] = {
      property: input.property,
      percent: parseInt(input.percent) || 0,
    };
    const newObj = {
      trait: profileObject.trait,
      properties: newArr,
    };
    finalize(newObj);
  };

  const addProperty = (input) => {
    //check for apostrophe
    if (input.length === 0) {
      console.log(`Nothing passed in`);
      return;
    }
    const newObj = {};
    if (input.includes(",")) {
      const newProperty = input.split(",")[0];
      const newPercent = input.split(",")[1];
      newObj.property = newProperty;
      newObj.percent = parseInt(newPercent);
    } else {
      newObj.property = input;
      newObj.percent = 0;
    }
    const newArr = structuredClone(profileObject.properties);
    newArr.push(newObj);
    const finalObj = {
      trait: profileObject.trait,
      properties: newArr,
    };
    finalize(finalObj);
  };
  //Pass index with updated object
  const finalize = (newObj) => {
    modifyTable(index, newObj);
  };

  return (
    <>
      {/* Editing the trait of the row */}
      {editingTrait ? (
        <td>
          <input
            autoFocus
            value={tempTrait}
            onBlur={() => {
              setEditingTrait(false);
              modifyTrait(tempTrait);
              setTempTrait("");
            }}
            onChange={(e) => {
              setTempTrait(e.target.value);
            }}
            onKeyDown={keyDown}
          />
        </td>
      ) : (
        <td
          onClick={() => {
            setEditingTrait(true);
            setTempTrait(profileObject.trait);
          }}
        >
          {profileObject.trait}
        </td>
      )}
      {profileObject.properties.map((propertyObject, arrIndex) => (
        <React.Fragment key={arrIndex}>
          {/* Change table property if clicked on */}
          {arrIndex === selectedIndex && editingProperty ? (
            <td>
              <input
                autoCapitalize="true"
                autoFocus
                type="text"
                value={tempProperty}
                onChange={(e) => {
                  setTempProperty(e.target.value);
                }}
                onKeyDown={keyDown}
                onBlur={() => {
                  setEditingProperty(false);
                  modifyProperty(
                    { property: tempProperty, percent: propertyObject.percent },
                    selectedIndex
                  );
                  setTempProperty("");
                  setSelectedIndex(-1);
                }}
              />
            </td>
          ) : (
            <td
              onClick={() => {
                setTempProperty(propertyObject.property);
                setSelectedIndex(arrIndex);
                setEditingProperty(true);
              }}
            >
              {propertyObject.property}
            </td>
          )}
          {/*Change the table percent if clicked on  */}
          {selectedIndex === arrIndex && editingPercent ? (
            <td>
              <input
                autoFocus
                type="text"
                value={tempPercent}
                onKeyDown={keyDown}
                onBlur={() => {
                  setEditingPercent(false);
                  modifyProperty(
                    { property: propertyObject.property, percent: tempPercent },
                    selectedIndex
                  );
                  setTempPercent(0);
                  setSelectedIndex(-1);
                }}
                onChange={(e) => {
                  setTempPercent(e.target.value);
                }}
              />
            </td>
          ) : (
            <td
              onClick={() => {
                setEditingPercent(true);
                setTempPercent(propertyObject.percent);
                setSelectedIndex(arrIndex);
              }}
              style={{
                textDecoration: propertyObject.percent === 0 ? "underline" : "",
              }}
            >
              {propertyObject.percent === 0
                ? Math.floor(allocatedPercent)
                : propertyObject.percent}
            </td>
          )}
        </React.Fragment>
      ))}
      {creatingProperty ? (
        <td>
          <input
            autoFocus
            onKeyDown={keyDown}
            onBlur={() => {
              addProperty(createdProperty);
              setCreatingProperty(false);
              setCreatedProperty("");
            }}
            onChange={(e) => {
              setCreatedProperty(e.target.value);
            }}
          />
        </td>
      ) : (
        <td>
          <div className="centered-div">
            <Button
              variant="success"
              className="custom-button"
              onClick={() => {
                setCreatingProperty(true);
              }}
            >
              +
            </Button>
          </div>
        </td>
      )}
    </>
  );
};

Cell.propTypes = {
  profileObject: PropTypes.shape({
    trait: PropTypes.string,
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        property: PropTypes.string,
        percent: PropTypes.number,
      })
    ),
  }),
  index: PropTypes.number,
  modifyTable: PropTypes.func,
  keyDown: PropTypes.func
};

export default Cell;
