import Papa from "papaparse";

//Parse csv data, will pass in one file, parses into array of objects, each parsed row is an object with keys description and amount/debit/credit, returns arr of objects [{description, amount}]
export const updateFile = (file, updateFileData) => {
  const fileName = file.name;
  if (file) {
    Papa.parse(file, {
      complete: (result) => {
        const newArr = [];
        result.data.map((obj) => {
          const newObj = {};
          Object.keys(obj).map((key) => {
            const v = obj[key];
            if (key === "Description" && v) {
              newObj.description = v.replace(/[^a-zA-Z\s]/g, "").trim();
            }
            if (key === "Amount" && v.length > 0) {
              const newValue = Number(v.replace(/[^\d.-]/g, ""));
              //console.log(`Amount: ${newValue}`)
              newObj.amount = newValue;
            }
            if (key === "Credit" && v?.length > 0) {
              //console.log(`Credit: ${v}`);
              newObj.amount = v;
            }
            if (key === "Debit" && v?.length > 0) {
              //console.log(`Debit: ${-v}`)
              newObj.amount = -v;
            }
            if (key === "Date" || key === "Posted Date") {
              const d = new Date(v)
              newObj.date = d.toDateString()
            }
          });
          if (Object.keys(newObj).length > 0 && newObj?.amount) {
            //console.log(`description: ${newObj.description}, amount: ${newObj.amount}, date: ${newObj.date}`)
            newArr.push(newObj);
          }
        });
        console.log(newArr)
        const finalObj = { fileName: fileName, data: newArr };
        updateFileData(finalObj);
      },
      header: true,
    });
  }
};

//returns array of objects based on number of subCategories [{subCategory, amount}]
export const setInitialTotals = (subCategories) => {
  const newTotals = subCategories?.map((subCatObj) => {
    //console.log(`Initial subCat: ${subCatObj.subCategory}`)
    return { subCategory: subCatObj.subCategory, amount: 0 };
  });
  //console.log(newTotals.map((obj) => obj.subCategory))
  return newTotals || null;
};

//Taking in the previous totals array, the newFileData obj to parse through, and subcategories array of objects [subCategory: name, descriptions: Set()]
//Want to take the previous table and for each object in newFileData add it's values to totals, then return an array with all the totals of prevArray with newFileData obj that matches subCategories
export const addTotals = (prevTotals, newFileData, subCategories) => {
  if (!subCategories) return;
  const copiedTotals = structuredClone(prevTotals);
  const unknownIndex = copiedTotals.findIndex(
    (obj) => obj.subCategory === "Unknown"
  );
  newFileData.forEach((fileObj) => {
    let subCatHasString = false;
    let newAmount;
    subCategories.forEach((subCatObj) => {
      Object.entries(subCatObj).forEach(([k, v]) => {
        if (k === "descriptions" && v.has(fileObj.description)) {
          const subCatIndex = copiedTotals.findIndex(
            (obj) => obj.subCategory === subCatObj.subCategory
          );
          newAmount = Number(fileObj.amount) + Number(copiedTotals[subCatIndex].amount)
          copiedTotals[subCatIndex].amount = newAmount.toFixed(2)
          subCatHasString = true;
        }
      });
    });
    //*if totals doesnt have key with that string, add it in
    //if not found in subcat, then add its value to totals unknown
    if (!subCatHasString) {
      newAmount =
        Number(copiedTotals[unknownIndex].amount) + Number(fileObj.amount);
      copiedTotals[unknownIndex].amount = newAmount.toFixed(2);
    }
  });
  return copiedTotals;
};

//Every time fileData is changed, want to update subCats Unknown with the new strings
//Want to have the subCats change from either file being changed or user moving strings from one subcat desc to another
export const getUnknown = (fileData, subCats) => {
  let unknownArr = [];
  fileData.map((obj) => {
    let hasStr = false;
    Object.values(subCats).forEach((subCatObj) => {
      if (subCatObj.descriptions.has(obj.description)) {
        hasStr = true;
        //console.log(`ALREADY A PART OF UNKNOWN`)
        return;
      }
    });
    if (!hasStr) {
      //console.log(`Subcat does not have fileData desc, adding to unknown: ${obj.description}`)
      unknownArr.push(obj.description);
    }
  });
  return unknownArr;
};

  //returns array of years
 export const getYears = (range = 10) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return Array.from(
      { length: range * 2 + 1 },
      (_, i) => currentYear - range + i
    );
  };

