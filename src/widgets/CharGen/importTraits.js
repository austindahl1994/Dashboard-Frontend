const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const updateTraits = (fileData) => {
  const uniqueTraits = {};
  let lastElement;

  fileData.forEach((arr) => {
    if (arr.length === 0) return;
    arr.forEach((element, index) => {
      if (index === 0) {
        let kn = capitalizeFirstLetter(element);
        if (!uniqueTraits[element]) {
          uniqueTraits[kn] = new Set();
        }
      } else {
        const category = capitalizeFirstLetter(arr[0]);
        if (arr.length > 1 && element) {
          if (typeof element === "number" && !isNaN(element)) {
            uniqueTraits[category].delete(lastElement);
            uniqueTraits[category].add([lastElement, element]);
            lastElement = null;
          } else if (typeof element === "string") {
            uniqueTraits[category].add(element);
            lastElement = element;
          }
        }
      }
    });
  });

  const newArrObj = {};
  Object.entries(uniqueTraits).forEach(([k, v]) => {
    newArrObj[k] = Array.from(v).map((trait) => ({
      trait: Array.isArray(trait)
        ? capitalizeFirstLetter(trait[0])
        : capitalizeFirstLetter(trait),
      percent: Array.isArray(trait) ? trait[1] : 0,
    }));
  });

  return newArrObj;
};

export default updateTraits;
