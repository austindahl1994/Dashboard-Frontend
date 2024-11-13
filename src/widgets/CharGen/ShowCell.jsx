import PropTypes from "prop-types";
import { useState } from "react";

export const ShowCell = ({
  xArrElement, //{trait, percent} object
  index, //[x, y] array
  editFunc, //fn that updates trait state of CG
  dimensions, //maxDimensions possible to see if needing to update initial column
  newHeaderFunc, //fn to update header
  sameColumn, //bool if it is the same column as selected trait
}) => {
  const [isHovering, setIsHovering] = useState(sameColumn || false);
  const [xIndex, yIndex] = index;

  const handleTDClick = (event, index) => {
    const [x, y] = index;
    //console.log(`Clicked at [${x},${y}] with maxDim of ${dimensions}`);
    if (y === dimensions[1] - 1) {
      //console.log("Trying to update cell that has no header!");
      newHeaderFunc();
    } else {
      editFunc([x, y]);
    }
  };

  const handleEnter = () => {
    setIsHovering(true);
  };

  const handleExit = () => {
    setIsHovering(false);
  };

  const getSize = () => {
    let returnValue = 1;
    if (sameColumn) {
      returnValue = 1;
    } else if (isHovering && typeof xArrElement !== "string") {
      returnValue = 2;
    } else {
      returnValue = 1;
    }
    return returnValue;
  };

  return (
    <>
      <td
        colSpan={getSize()}
        onClick={(event) => {
          handleTDClick(event, [xIndex, yIndex]);
        }}
        onMouseOver={handleEnter}
        onMouseLeave={handleExit}
      >
        {typeof xArrElement === "string"
          ? xArrElement
          : xArrElement.trait
          ? `${xArrElement.trait}${
              xArrElement.percent && (isHovering || sameColumn)
                ? `, ${xArrElement.percent}`
                : ""
            }`
          : " "}
      </td>
      {typeof xArrElement !== "string" && (!isHovering && !sameColumn) && (
        <td
          colSpan={1}
          onClick={(event) => {
            handleTDClick(event, [xIndex, yIndex]);
          }}
          onMouseOver={handleEnter}
          onMouseLeave={handleExit}
        >
          {xArrElement.trait ? xArrElement.percent : " "}
        </td>
      )}
    </>
  );
};

ShowCell.propTypes = {
  xArrElement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      trait: PropTypes.string,
      percent: PropTypes.number,
    }),
  ]),
  index: PropTypes.arrayOf(PropTypes.number).isRequired,
  editFunc: PropTypes.func,
  dimensions: PropTypes.arrayOf(PropTypes.number),
  newHeaderFunc: PropTypes.func,
  sameColumn: PropTypes.bool,
};

export default ShowCell;
