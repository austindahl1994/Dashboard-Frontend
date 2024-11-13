const generateRandomTraits = (updateTraitsFunc, traitObj) => {
  const newTraits = []; //array of objects {header: randomizedTrait}
  for (const header in traitObj) {
    let arr = traitObj[header];
    if (arr.length === 0) continue;
    const totalPercent = arr.reduce((acc, valueArray) => {
      return valueArray.percent + acc;
    }, 0);
    let randomTrait = { trait: null, percent: null };
    if (totalPercent === 0) {
      randomTrait = totalZero(arr);
    } else if (totalPercent > 0 && totalPercent <= 100) {
      randomTrait = totalBetween(totalPercent, arr);
    } else {
      randomTrait = totalOver(totalPercent, arr);
    }
    newTraits.push({ header, randomTrait });
  }

  updateTraitsFunc(newTraits);
};

//generate a random number from 0 to arr.length
const totalZero = (arr) => {
  //console.log("Total is 0");
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex].trait;
};

//since between 0-100 for totalPercent, if one item is 50%, still needs other values
const totalBetween = (tp, arr) => {
  //console.log("Total is between 0-100")
  let numZeros = 0
  for (const obj of arr) {
    if (obj.percent === 0) {
      numZeros++
    }
  }
  const allocatedPercent = numZeros > 0 ? (100 - tp) / numZeros : 0; 
  const updatedArray = arr.map((obj) => {
    return {
      ...obj,
      percent: obj.percent > 0 ? obj.percent : allocatedPercent,
    };
  });
  return returnTrait(tp, updatedArray);
};

//totalPercent is over 100%, have to calculate probabilities for all non-zero traits
const totalOver = (tp, arr) => {
  const finalArray = arr.filter((obj) => {
    return obj.percent > 0;
  });
  
  return returnTrait(tp, finalArray);
};

const returnTrait = (tp, arr) => {
  let randomValue = Math.random() * tp;
  let cumulativePercent = 0;
  for (const element of arr) {
    //console.log(`${element.trait}: ${element.percent}`)
    cumulativePercent += element.percent;
    if (cumulativePercent >= randomValue) {
      return element.trait;
    }
  }
  console.log("Returning null")
  return null;
};

export default generateRandomTraits;
