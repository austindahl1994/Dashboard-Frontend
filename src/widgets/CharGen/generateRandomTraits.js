//TODO: make sure values cannot exceed 100 for percentages (in the edit and original component?)

const generateRandomTraits = (updateTraitsFunc, traitsObj) => {
  const newTraitObj = {};
  for (const [key, arr] of Object.entries(traitsObj)) {
    if (arr.length === 0) continue;
    let totalPercent = arr.reduce((acc, obj) => obj.percent + acc, 0);
    if (totalPercent > 0) {
      let adjustedTraits = arr.map((obj) => ({ ...obj }));
      const numZeros = adjustedTraits.filter((obj) => obj.percent === 0);
      const amountZeros = numZeros.length;
      const allocatedPercent =
        amountZeros > 0 ? (100 - totalPercent) / amountZeros : 0;
      adjustedTraits = adjustedTraits.map((obj) => ({
        ...obj,
        percent: obj.percent > 0 ? obj.percent : allocatedPercent,
      }));
      //console.log(allocatedPercent);
      const randomValue = Math.random() * 100;
      let cumulativePercent = 0;
      for (const obj of adjustedTraits) {
        cumulativePercent += obj.percent;
        if (randomValue < cumulativePercent) {
          newTraitObj[key] = obj.trait;
          break;
        }
      }
    } else {
      const randomIndex = Math.floor(Math.random() * arr.length);
      newTraitObj[key] = arr[randomIndex].trait;
    }
  }
  updateTraitsFunc(newTraitObj);
};

export default generateRandomTraits;
