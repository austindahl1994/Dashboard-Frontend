const generateRandomTraits = (updateTraitsFunc, table) => {
  const newTraitsArray = []
  table.forEach((profile) => {
    if (profile.properties.length === 0) return
    const trait = profile.trait
    let totalPercent = 0
    profile.properties.forEach((property) => {
      totalPercent += property.percent
    })
    //console.log(`Total percent: ${totalPercent}`)
    let randomProperty = ""
    if (totalPercent === 0) {
      randomProperty = totalZero(profile.properties);
    } else if (totalPercent > 0 && totalPercent <= 100) {
      randomProperty = totalBetween(totalPercent, profile.properties);
    } else {
      randomProperty = totalOver(totalPercent, profile.properties);
    }
    newTraitsArray.push({trait: trait, property: randomProperty})
  })
  updateTraitsFunc(newTraitsArray);
};

//generate a random number from 0 to arr.length
const totalZero = (arr) => {
  //console.log("Total is 0");
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex].property;
};

//since between 0-100 for totalPercent, if one item is 50%, still needs other values
const totalBetween = (tp, arr) => {
  //console.log("Total is between 0-100")
  let numZeros = arr.filter((obj) => obj.percent === 0).length;
  
  const allocatedPercent = numZeros > 0 ? (100 - tp) / numZeros : 0; 
  //console.log(`Allocated percent: ${allocatedPercent}`)
  const updatedArray = arr.map((obj) => {
    return {
      ...obj,
      percent: obj.percent > 0 ? obj.percent : allocatedPercent,
    };
  });
  const newPercent = updatedArray.reduce((acc, property) => {return property.percent + acc}, 0)
  return returnTrait(newPercent, updatedArray);
};

//totalPercent is over 100%, have to calculate probabilities for all non-zero traits
const totalOver = (tp, arr) => {
  const finalArray = arr.filter((obj) => {
    return obj.percent > 0;
  });
  
  return returnTrait(tp, finalArray);
};

//cumu percent is zero, each time an element is added, adds percent to cumu
//if cumu is greater than the random value, is selected trait
//random value should be between 0-total percent

const returnTrait = (tp, arr) => {
  //0-1 for random, if adds up to 100, gives 0-100, 7 is 0-7
  let randomValue = Math.random() * tp;
  let cumulativePercent = 0;
  for (const element of arr) {
    //console.log(`${element.property}: ${element.percent}`)
    cumulativePercent += element.percent;
    if (cumulativePercent >= randomValue) {
      return element.property;
    }
  }
  console.log("Invalid math, returning null")
  return null;
};

export default generateRandomTraits;

  // const newTraits = []; //array of objects {header: randomizedTrait}
  // for (const header in traitObj) {
  //   let arr = traitObj[header];
  //   if (arr.length === 0) continue;
  //   const totalPercent = arr.reduce((acc, valueArray) => {
  //     return valueArray.percent + acc;
  //   }, 0);
  //   let randomTrait = { trait: null, percent: null };
  //   if (totalPercent === 0) {
  //     randomTrait = totalZero(arr);
  //   } else if (totalPercent > 0 && totalPercent <= 100) {
  //     randomTrait = totalBetween(totalPercent, arr);
  //   } else {
  //     randomTrait = totalOver(totalPercent, arr);
  //   }
  //   newTraits.push({ header, randomTrait });
  // }

  // updateTraitsFunc(newTraits);