import Papa from "papaparse";
import { HexTile } from "./HexTile";

const ringLocations = [
  //center
  [[4, 4]],
  // Ring 1
  [
    [3, 3],
    [4, 3],
    [3, 4],
    [5, 4],
    [3, 5],
    [4, 5],
  ],
  // Ring 2
  [
    [2, 2],
    [3, 2],
    [4, 2],
    [2, 3],
    [5, 3],
    [2, 4],
    [6, 4],
    [2, 5],
    [5, 5],
    [2, 6],
    [3, 6],
    [4, 6],
  ],
  // Ring 3
  [
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [1, 2],
    [5, 2],
    [1, 3],
    [6, 3],
    [1, 4],
    [7, 4],
    [1, 5],
    [6, 5],
    [1, 6],
    [5, 6],
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
  ],
  // Ring 4
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [0, 1],
    [5, 1],
    [0, 2],
    [6, 2],
    [0, 3],
    [7, 3],
    [0, 4],
    [8, 4],
    [0, 5],
    [7, 5],
    [0, 6],
    [6, 6],
    [0, 7],
    [5, 7],
    [0, 8],
    [1, 8],
    [2, 8],
    [3, 8],
    [4, 8],
  ],
];

const updateFile = (e, updateTiles) => {
  const file = e.target.files[0];
  if (file) {
    Papa.parse(file, {
      complete: (result) => {
        updateTiles(generateTiles(result.data));
      },
      header: true,
      dynamicTyping: true,
    });
  }
};

const startFile = async () => {
  try {
    const response = await fetch("./tempBingo.csv");
    const textData = await response.text();
    const result = await new Promise((resolve) => {
      Papa.parse(textData, {
        complete: (result) => {
          resolve(result);
        },
        header: true,
        dynamicTyping: true,
      });
    });
    const tiles = generateTiles(result.data);
    return tiles;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const generateTiles = (data) => {
  //console.log(`Updating csv file`);
  const hexArray = [];
  data.forEach((rowData, index) => {
    const newTile = new HexTile(
      index,
      rowData.task,
      rowData.description,
      rowData.conditions,
      rowData.rules,
      rowData.tier,
      rowData.url
    );
    hexArray.push(newTile);
  });
  //console.log(hexArray);
  return randomizeTasks(hexArray);
};

const randomizeTasks = (table) => {
  let ringsCopy = JSON.parse(JSON.stringify(ringLocations));
  //iterates through the array of objects (tiles)
  //console.log(`Table length parsed: ${table.length}`)
  const newTable = table.map((obj) => {
    if (!obj.task) return;
    //console.log(index)
    //Generates the length of the array based on object tier
    if (obj.tier === 1) {
      obj.location = [4, 4];
      obj.unlocked = true;
      return obj;
    }
    //console.log(ringsCopy[obj?.tier-1]?.length - 1);
    let arrLength = ringsCopy[obj?.tier - 1]?.length - 1;

    //Generates a random index based on the array length
    let randomIndex = Math.floor(Math.random() * arrLength);

    //Generates a new [x, y] position
    obj.location = ringsCopy[obj.tier - 1][randomIndex];

    //If center tile, make it unlocked, then if first ring make them available to be unlocked
    // if (obj.tier === 2) {
    //   obj.unlockable = true;
    // }

    //Removes [x, y] position from the copied array
    ringsCopy[obj.tier - 1] = ringsCopy[obj.tier - 1].filter(
      (_, index) => index !== randomIndex
    );
    return obj;
  });
  return newTable;
};

//Called when unlocking, tile is an object
const unlock = (tile, boardData) => {
  //for center row
  let directions;
  const center = [
    [-1, 0], //left one tile
    [-1, -1], //diag up-left
    [0, -1], //diag up-right
    [1, 0], //right one tile
    [0, 1], //diag down-right
    [-1, 1], //diag down-left
  ];
  //above center Y-Based (including center row?)
  const aboveCenter = [
    [-1, 0], //left one tile
    [-1, -1], //diag up-left
    [0, -1], //diag up-right
    [1, 0], //right one tile
    [1, 1], //diag down-right
    [0, 1], //diag down-left
  ];
  //below center Y-Based
  const belowCenter = [
    [-1, 0], //left one tile
    [0, -1], //diag up-left
    [1, -1], //diag up-right
    [1, 0], //right one tile
    [0, 1], //diag down-right
    [-1, 1], //diag down-left
  ];

  if (tile.location[1] === 4) {
    directions = center;
  } else if (tile.location[1] < 4) {
    directions = aboveCenter;
  } else {
    directions = belowCenter;
  }

  //creates an array of [x,y] that need to have possible completions -1 and unlockable
  const surroundingTiles = directions.map((pos) => {
    const x = tile.location[0] + pos[0];
    const y = tile.location[1] + pos[1];
    return [x, y];
  });


  const updatedBoard = boardData.map((obj) => ({ ...obj }));

  surroundingTiles.forEach((pos) => {
    const updatedTile = updatedBoard.find(
      (obj) => obj.location[0] === pos[0] && obj.location[1] === pos[1]
    );

    if (updatedTile) {
      updatedTile.unlocked = true
    }
  });
  //console.log(updatedBoard);
  return updatedBoard;
};

const complete = (tile, boardData) => {
  const updatedBoard = boardData.map((obj) => {
    if (tile.id === obj.id) {
      return {
        ...obj,
        completed: true
      };
    }
    return { ...obj };
  });

  if (tile.id === 0) {
    const newBoard = unlock(tile, updatedBoard);
    const newSelectedTile = newBoard[0]
    return [newBoard, newSelectedTile]
  } else {
    return [updatedBoard, updatedBoard[tile.id]]; //also return the new selectedTile
  }

  //console.log(updatedBoard)
};

export { updateFile, startFile, unlock, complete };
