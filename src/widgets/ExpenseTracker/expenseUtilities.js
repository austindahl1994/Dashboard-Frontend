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
          });
          if (Object.keys(newObj).length > 0 && newObj?.amount) {
            // console.log(`description: ${newObj.description}, amount: ${newObj.amount}`)
            newArr.push(newObj);
          }
        });
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
    return { subCategory: subCatObj.subCategory, amount: 0 };
  });
  //console.log(newTotals.map((obj) => obj.subCategory))
  return newTotals || null;
};

//Taking in the previous totals array, the newFileData obj to parse through, and subcategories array of objects [subCategory: name, descriptions: Set()]
//Want to take the previous table and for each object in newFileData add it's values to totals, then return an array with all the totals of prevArray with newFileData obj that matches subCategories
export const addTotals = (prevTotals, newFileData, subCategories) => {
  if (!subCategories) return 
  const copiedTotals = structuredClone(prevTotals);
  const unknownIndex = copiedTotals.findIndex(
    (obj) => obj.subCategory === "Unknown"
  );
  newFileData.forEach((fileObj) => {
    let subCatHasString = false;
    let newAmount;
    //{description, amount}
    //iterate through the fileData object, checking if it's in subCategories descriptions
    Object.entries(subCategories).forEach(([subCat, descriptions]) => {
      //*if obj.description is in that subcat, add it to totals
      if (descriptions instanceof Set && descriptions.has(fileObj.description)) {
        newAmount =
          Number(fileObj.amount) + Number(copiedTotals[subCat].amount | 0);
        copiedTotals.subCategory[subCat] = parseFloat(newAmount).toFixed(2);
        subCatHasString = true;
      }
    });
    //*if totals doesnt have key with that string, add it in
    //if not found in subcat, then add its value to totals unknown
    if (!subCatHasString) {
      newAmount =
        Number(copiedTotals[unknownIndex].amount) + Number(fileObj.amount);
      copiedTotals[unknownIndex].amount = parseFloat(newAmount).toFixed(2);
    }
  });
  return copiedTotals;
};

//Every time fileData is changed, want to update subCats Unknown with the new strings
//Want to have the subCats change from either file being changed or user moving strings from one subcat desc to another
export const getUnknown = (fileData, subCats) => {
  let unknownArr = []
  fileData.map((obj) => {
    let hasStr = false
    Object.values(subCats).forEach((subCatObj) => {
      if (subCatObj.descriptions.has(obj.description)) {
        hasStr = true
        //console.log(`ALREADY A PART OF UNKNOWN`)
        return
      }
    })
    if (!hasStr) {
      //console.log(`Subcat does not have fileData desc, adding to unknown: ${obj.description}`)
      unknownArr.push(obj.description)
    }
  })
  return unknownArr
}

//After file is parsed with header files, data we want is Description and Amount. Amount might be replaced with Debit/Credit
//Want to save data two(?) separate places, string without numbers with str.replace(/[^a-zA-Z]/g, '') added to a new object {}
//New object is an object {subcat: set of strings}

//Takes in array of objects [{subCategory: array[strings]}] to change array into a set, from DB to show on client
// const generateStringComparisons = (subCategories) => {
//   //new array of objects
//   const newArr = [];
//   //categories is an array of objects
//   subCategories.forEach((obj) => {
//     const newObj = {};
//     //each object is { category: array[strings] }, change to {category: set(strings)}
//     Object.keys(obj).forEach((key) => {
//       newObj[key] = new Set([...obj[key]]);
//     });
//     newArr.push(newObj);
//   });
//   return newArr;
// };

//Converts the categories back from sets into arrays to store in db
// const convertComparisons = (subCategories) => {
//   //have an array of objects, each object is {subCategory: set()}, change to {subCategory: array[]}
//   const newArr = [];
//   subCategories.forEach((obj) => {
//     const newObj = {};
//     Object.keys(obj).forEach((key) => {
//       newObj[key] = [...obj[key]];
//     });
//     newArr.push(newObj);
//   });
//   return newArr; //replace comparison array in state
// };

//function to get the correct category that the new string will be put into
// const newString = "test";
// const category = "HOA";
// const catObject = comparisonArray.find((obj) => category in obj);
// if (catObject) {
//   if (catObject[category] instanceof Set) {
//     catObject[category].add(newString);
//   } else {
//     // If it's not a Set, initialize as a Set
//     catObject[category] = new Set([newString]);
//   }
// }

/*
//USER DEFINED ARRAY FOR STRING COMPARISONS AGAINST CSV DATA
//create new array of objects that have sets instead of arrays, can then add new values with
// .add(), and check for string with .has() from csv

regex to test string for numbers or symbols, ie anything other than characters?
str.replace(/[^a-zA-Z]/g, '');

Exclude field for what shouldnt be considered (charges from one acc to another), income table as well

Should match exact string minus numbers? Should match using string method of .match() or .matchAll()

function validateDateWithDateObject(dateStr) { 
const date = new Date(dateStr); 
return date
}

DRAGGING INFO
field you want to allow to be dragged: dragging="true", onDragStart={handleDragStart}
field you want to allow it to be dragged to: onDragOver={handleDragOver /prevent default only?/}, onDragDrop={(e) => {handleDragDrop(e) /*Also get the category that it's being dropped on/}}
On drop, remove it from list of unknown, add it to the key set that matches the category

Fullscren Modal that would have 2 tabs (expenses and income): Unknown Col on left, known Cols on right, each with user defined columns, allow user to add more columns



QUESTIONS FOR RACHEL
How to add data, override it? Yes, just override the data in DB
Match parts of strings? Matching whole strings is fine

*/
