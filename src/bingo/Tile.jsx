import PropTypes from "prop-types";
import "./tile.css";
import { FaLock } from "react-icons/fa";

const Tile = ({ xIndex, yIndex, updateInfoState }) => {
  const firstRing = [
    [3, 3],
    [4, 3],
    [3, 4],
    [5, 4],
    [3, 5],
    [4, 5],
  ];

  //if tile is able to be unlocked, should show it being able to be flipped
  const unlockCheck = () => {
    return firstRing.some(([x, y]) => x === xIndex && y === yIndex);
  };
  //tile is unlocked so should start flipped over
  const completeCheck = () => {
    if (xIndex === 4 && yIndex === 4) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="hexagon" onClick={updateInfoState}>
      <div className={unlockCheck() ? "hexagon-inner" : ""}>
        <div
          className={completeCheck() ? "hexagon-back" : "hexagon-front"}
          style={{
            transform: completeCheck() ? "rotateY(360deg)" : "",
            backfaceVisibility: "visible",
            backgroundColor: completeCheck() ? "green" : "black",
            backgroundImage: completeCheck()
              ? "url(https://oldschool.runescape.wiki/images/Chest_%28Barrows%29.png?9aff2)"
              : "",
          }}
        >
          {!completeCheck() && (
            <FaLock style={{ width: "25px", height: "25px", color: "black" }} />
          )}
        </div>
        <div className="hexagon-back"></div>
      </div>
    </div>
  );
};

Tile.propTypes = {
  xIndex: PropTypes.number,
  yIndex: PropTypes.number,
};

export default Tile;
