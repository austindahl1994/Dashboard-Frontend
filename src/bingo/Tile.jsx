import PropTypes from "prop-types";
import "./tile.css";
import { FaLock } from "react-icons/fa";

const Tile = ({ tile, selectTile, selectedTile, updateShowInfo, updateUnlock }) => {
  const isEmpty = !tile || Object.keys(tile).length === 0;
  const currentTile = () => {
    return tile.id === selectedTile.id;
  }
  return (
    <div
      className="hexagon"
      onClick={() => {
        //if tile is already unlocked, display its information
        if (tile.unlocked) {
          //console.log(`Tile unlocked, display all`);
          updateUnlock(false);
          updateShowInfo(true);
          selectTile(tile);
          //if tile isnt unlocked but can be, show name? but also unlock button
        } else if (tile.unlockable) {
          //console.log(`Tile unlockable, showing unlock button`);
          selectTile(tile);
          updateUnlock(true);
          updateShowInfo(true);
          //tile cannot be unlocked, don't show anything
        } else {
          //console.log(`Tile locked and far, dont show any`);
          updateShowInfo(false);
          updateUnlock(true);
        }
      }}
    >
      {isEmpty ? (
        <div className="hexagon-front">
          <FaLock style={{ width: "25px", height: "25px", color: "black" }} />
        </div>
      ) : (
        <div
          className={
            currentTile() && !tile.unlocked
              ? "hexagon-inner fake-hover"
              : tile.unlockable
              ? "hexagon-inner"
              : ""
          }
        >
          {/* Tile is not empty, either display front or back */}
          <div
            className="hexagon-front"
            style={{
              backgroundImage:
                tile.unlocked && !tile.unlockable
                  ? `url(${tile.url})`
                  : `https://oldschool.runescape.wiki/images/Cabbage_detail.png?08f34`,
              backgroundColor: tile.completed
                ? "green"
                : tile.unlocked
                ? "yellow"
                : "black",
              backgroundSize: tile.unlocked ? "60%" : "100%",
            }}
          >
            {/* Display the lock symbol */}
            {!tile.unlockable && !tile.unlocked && (
              <FaLock
                style={{ width: "25px", height: "25px", color: "black" }}
              />
            )}
          </div>
          {/* Display back information */}
          <div
            className="hexagon-back"
            style={{
              backgroundImage: `url(${tile.url})`,
              backgroundColor: `darkGreen`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

Tile.propTypes = {
  tile: PropTypes.object,
  selectTile: PropTypes.func,
  selectedTile: PropTypes.object,
  updateShowInfo: PropTypes.func,
  updateUnlock: PropTypes.func
};

export default Tile;

/*
<div className={tile.unlockable ? "hexagon-inner" : ""}>
          {console.log(tile.unlockable)}
          <div
            className={tile.unlocked ? "hexagon-back" : "hexagon-front"}
            style={{
              transform: tile.unlocked ? "rotateY(360deg)" : "",
              backfaceVisibility: "visible",
              backgroundColor: tile.unlocked ? "green" : "black",
              backgroundImage: tile.unlocked
                ? "url(https://oldschool.runescape.wiki/images/Chest_%28Barrows%29.png?9aff2)"
                : "",
            }}
          >
            {!tile.unlocked && (
              <FaLock
                style={{ width: "25px", height: "25px", color: "black" }}
              />
            )}
          </div>
          <div className="hexagon-back"></div>
        </div>
*/

/**
 * <div className="hexagon" onClick={updateInfoState}>
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
 */
