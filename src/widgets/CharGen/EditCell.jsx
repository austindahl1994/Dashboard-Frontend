import PropTypes from "prop-types";
import { useState } from "react";

const EditCell = ({ trait, percent, finishFunc }) => {
  const [text, setText] = useState(
    trait === null ? "" : percent ? `${trait}, ${percent}` : `${trait}`
  );

  const handleChange = (event) => {
    setText(event.target.value);
  };

  //checks if return was hit, do same as blur, exit cell, if tabbed then go to next cell
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      finishFunc(text, false);
    } else if (event.key === "Tab") {
      event.preventDefault();
      finishFunc(text, true);
    }
  };

  return (
    <td>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => finishFunc(text, false)}
        placeholder={text}
        autoFocus
      />
    </td>
  );
};

EditCell.propTypes = {
  trait: PropTypes.string,
  percent: PropTypes.number,
  finishFunc: PropTypes.func,
};

export default EditCell;
