import Papa from 'papaparse'

//Parse csv data, will pass in files one at a time, parses into array of objects, each row is an object with keys Description and Amount || (Debit/Credit)
export const updateFile = (file, updateFileData) => {
  const fileName = file.name;
  if (file) {
    Papa.parse(file, {
      complete: (result) => {
        parseFileData(result.data, fileName, updateFileData);
      },
      header: true,
      dynamicTyping: true,
    });
  }
};
//File is parsed, only store the key: value of Description, Total, Debit, or Credit, store the objects in array of objects (in in an object where the key is a string which is the file name to delete easier or update etc.)
export const parseFileData = (arr, fileName, updateFileData) => {
    //arr is array of objects or array of row data
    //want to have a new array of objects, where the objects only have a description and total (if debit just make total, credit is negative)
    //newArr = [{Description: "someString", Total: someInt}]
    //console.log(`FileName: ${fileName}`)
    const newArr = arr.map((obj) => {
        const newObj = {}
        Object.entries(obj).forEach(([k, v]) => {
            if (k === 'Description') {
                newObj[k] = v.replace(/[^a-zA-Z]/g, "");
            } 
            
            if (k === 'Amount'){
                newObj.Amount = v;
            } else if (k === 'Debit') {
                newObj.Amount = -v;
            } else if (k === 'Credit' && v !== null) {
                newObj.Amount = v;
            }
        })
        //console.log(`Description: ${newObj.Description}, Amount: ${newObj.Amount}`);
        return newObj
    })
    const finalObj = {fileName: fileName, data: newArr}
    //return object of fileName: array[objects]
    updateFileData(finalObj)
}

//After parsing file data, checks if the description string is a part of any subcat set, then add that value to subcat obj if it is, otherwise add the string to unknown set and unknown object total
//Array object (row) is parsed, want Description and Amount/Debit & Credit
//If Description is in subcat array of objects, add total to that subcat
//Description is not in any subcat, add that string to unknown subcat set, and add that amount to unknown total
export const modifyData = (fileObj) => {
  //Iterate through every object in the array
  let unknown = []
  let unknownTotal = 0 //unneeded?
  Object.values(fileObj).forEach((obj) => {
    //If the value exists in one of the subCategories, add its total to totals[subCategory]
    //If value doesn't exist then add it to unknown and total to unknown
    console.log(obj)
    //each obj has obj.description and obj.total, maybe doesnt matter since could add data in above? or not in order to separate the logic for when subcats are changed
  });
}
//[{subcat: [strings]}]
const checkString = (str, subCategory) => {
  if (!subCategory || !Array.isArray(subCategory) || subCategory.length === 0) {
    console.log(`SubCat issue`)
    return false
  }
  subCategory.map((obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key].has(str)) {
        return key
      } else {
        return false
      }
    })
  })
}

//Passed in a string, subcat, and array of subcat objects, updates subcat object set with stringthat matches subcat
const addStringToSubCat = (str, subString, subCatArr) => {

}

//For each row, will check if string is in subcat, if so add the total/debit to subcat object in the totalCatArr
const addValueToSubCat = (value, subcategory, totalCatArr) => {

}


//After file is parsed with header files, data we want is Description and Amount. Amount might be replaced with Debit/Credit
//Want to save data two(?) separate places, string without numbers with str.replace(/[^a-zA-Z]/g, '') added to a new object {}
//New object is an object {subcat: set of strings}

//Takes in array of objects [{subCategory: array[strings]}] to change array into a set, from DB to show on client
const generateStringComparisons = (subCategories) => {
  //new array of objects
  const newArr = [];
  //categories is an array of objects
  subCategories.forEach((obj) => {
    const newObj = {};
    //each object is { category: array[strings] }, change to {category: set(strings)}
    Object.keys(obj).forEach((key) => {
      newObj[key] = new Set([...obj[key]]);
    });
    newArr.push(newObj);
  });
  return newArr;
};

//Converts the categories back from sets into arrays to store in db
const convertComparisons = (subCategories) => {
  //have an array of objects, each object is {subCategory: set()}, change to {subCategory: array[]}
  const newArr = [];
  subCategories.forEach((obj) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      newObj[key] = [...obj[key]];
    });
    newArr.push(newObj);
  });
  return newArr; //replace comparison array in state
};

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