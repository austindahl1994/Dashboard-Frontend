import { useEffect, useRef, useState } from "react";
// import { Button } from "react-bootstrap";
import { updateFile, unlock, complete, startFile } from "./boardUtils";
import Tile from "./Tile";

import "./board.css";
import { Button, Offcanvas } from "react-bootstrap";

//Show highscores on the page

//TODO: Leaving off on complete and unlock in boardUtils, on first completion should unlock surrounding tiles to be viewed and completed, maybe add new function unlockSurrounding or just modify existing if tile.id === 0 since that's the only middle tile. 

//TODO: Need to have corrent color implementations, green on complete, yellow on unlocked, black for rest, remove unlockable from object? Seeing as its either complete, unlocked (can be seen), or black (tile hasnt been completed near it)

//Change to free for all, only unlocked once, each has points, have a table of highscores, once drop has been obtained, something discord bot to have mod verify, once verified, backend updates database and updates everyones tables with websocket usage

const Board = () => {
  // const [boardData, setBoardData] = useState({});
  // const [groupName, setGroupName] = useState();
  // const [groupMembers, setGroupMembers] = useState([]);
  const hexTotal = [5, 6, 7, 8, 9, 8, 7, 6, 5];
  const [selectedTile, setSelectedTile] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const [unlocksAvailable, setUnlocksAvailable] = useState(10);
  const [tiles, setTiles] = useState([]);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // const loadCSV = async () => {
    //   try {
    //     const data = await startFile();
    //     setTiles(data || []);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // if (isFirstLoad.current) {
    //   loadCSV();
    //   isFirstLoad.current = false;
    // }
  }, []);

  const updateTiles = (data) => {
    setTiles(data);
  };

  const completions = (value) => {
    setUnlocksAvailable(unlocksAvailable + value);
  };

  const selectTile = (data) => {
    setSelectedTile(data);
  };

  const updateShowInfo = (v) => {
    setShowInfo(v);
  };

  const updateUnlock = (v) => {
    setNeedsUnlock(v);
  };

  const completeTask = () => {
    const boardData = complete(selectedTile, tiles);
    setTiles(boardData[0]);
    setSelectedTile(boardData[1]);
  };

  const getTile = (x, y) => {
    const tile = tiles.find(
      (obj) => obj.location[0] === x && obj.location[1] === y
    );
    return tile || { location: "Empty" };
  };

  return (
    <div className="d-flex w-100 h-100">
      <div className="holder m-0 p-0 w-100 h-100">
        {hexTotal.map((hexCount, yIndex) => (
          <div className="hex-row" key={yIndex}>
            {Array(hexCount)
              .fill()
              .map((_, xIndex) => {
                const tileData =
                  tiles.length > 0 ? getTile(xIndex, yIndex) : {};
                return (
                  <div key={xIndex}>
                    <Tile
                      tile={tileData}
                      selectTile={selectTile}
                      selectedTile={selectedTile}
                      updateShowInfo={updateShowInfo}
                      updateUnlock={updateUnlock}
                    />
                  </div>
                );
              })}
          </div>
        ))}
        <div className="">
          <label htmlFor="excelDoc"></label>
          <input
            type="file"
            id="excelDoc"
            name="excelDoc"
            onChange={(e) => updateFile(e, updateTiles)}
          />
        </div>
        {/* If the tile is already unlocked, show all details */}
        {showInfo && (
          <Offcanvas
            show={showInfo}
            placement="end"
            onHide={() => {
              setShowInfo(false);
              setSelectedTile({});
            }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>{selectedTile.task}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="m-3">
                <img src={selectedTile.url} width="150" />
              </div>
              <p>{selectedTile.description}</p>
              <p>{selectedTile.conditions}</p>
              <p>{selectedTile.rules}</p>
              Completed: {selectedTile.completed ? "Yes" : "No"}
              <p>Point value: {selectedTile.tier}</p>
              {/* On click, increase amount of unlocks available, reduce amount of completions */}
              {/* available for the task */}
              <Button
                onClick={() => {
                  completions(1);
                  completeTask();
                  setShowInfo(false)
                }}
                disabled={selectedTile.completed}
              >
                Complete Task!
              </Button>
            </Offcanvas.Body>
          </Offcanvas>
        )}
      </div>
    </div>
  );
};

export default Board;
