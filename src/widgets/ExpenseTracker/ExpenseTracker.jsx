import React, { useEffect, useState } from "react";
import CategorizeModal from "./CategorizeModal";
import { Button } from "react-bootstrap";
import UploadExpenseData from "./UploadExpenseData";
import ExpenseTable from "./ExpenseTable";
//TODO: If removing a file, do we care about removing unknown strings from the Unknown descriptions set?
//If so, descriptions.clear() for "Unknown" before going through and updating the totals data
const freshSubCat = [
  { subCategory: "Unknown", descriptions: new Set() },
  { subCategory: "Ignore", descriptions: new Set() }
]
const freshTotals = [
  { subCategory: "Unknown", amount: 0 },
  { subCategory: "Ignore", amount: 0 }
]
const freshCats = [
  { category: "Other", subCategory: new Set(["Unknown", "Ignore"])},
]
const ExpenseTracker = () => {
  //Categories is what is iterated over for table data, subcategories array is just for what strings should be in that subcat, total is for the totals of the subcat
  const [categories, setCategories] = useState(freshCats); //Arr objects [{category: ['subcategories']}, ...]
  const [subCategories, setSubCategories] = useState(freshSubCat); //Arr objects [{subcategory: Set['strings']}, ...] for string matches parsed file data vs personalized strings, pull from Database instead of just having it be unknown
  const [totals, setTotals] = useState(freshTotals); //Arr objects [{subcategory: total}, ...]
  const [fileData, setFileData] = useState([]); //Arr of objects, each obj is {fileName: {parsedData}}
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSubCategories((prev) => {
      let newSubCat = structuredClone(prev)
      if (subCategories.some((obj) => obj.subCategory === "Unknown") && subCategories.some((obj) => obj.subCategory === "Ignore")) {
        //console.log(`Subcat has unknown and ignore`)
        return prev;
      } 
      if (!subCategories.some((obj) => obj.subCategory === "Unknown")) {
        console.log(`subcat does not have unknown`);
        newSubCat = [...prev, freshSubCat[0]]
      } 
      if (!subCategories.some((obj) => obj.subCategory === "Ignore")) {
        console.log(`subcat does not have ignore`);
        newSubCat = [...prev, freshSubCat[1]]
      }
      console.log("SubCategory was changed in useEffect, updating now to ${newSubCat}")
      return newSubCat;
    });
    
    console.log("Subcategory changed")
    subCategories.map((subCatObj) => { //iterates through array of objects
      Object.values(subCatObj).map((value, index) => {
        if (typeof value === String) {
          console.log(`subCategory: ${value || "No subCategoies!"}`)
        } else {
          Array.from(value).map(e => console.log(`description: ${e || "No descriptions!"}`))
        }
      })
      
    })
  }, [subCategories]);

  useEffect(() => {
    totals.map((obj) => {
      console.log(
        `Totals subCats ${obj.subCategory} with amount: ${obj.amount}`
      );
    });
  }, [totals]);

  useEffect(() => {
    if (fileData && fileData.length > 0) {
      fileData.map((obj) => {
        //console.log(obj.fileName);
        updateTotals(obj.data)
      });
    } else {
      //console.log(`No file data!`);
    }
  }, [fileData]);

  //Whenever a file is added/removed, should update old totals with new totals
  const updateTotals = (newData) => {
    console.log("Calling updateTotals Function with data: ")
    console.log(newData);
    const oldTotals = fileData.length <= 1 ? freshTotals : structuredClone(totals || freshTotals);
    const unknownIndex = subCategories.indexOf((obj) => obj.subCategory === "Unknown")
    const unknownSet = new Set()
    if (!newData && !Array.isArray(newData)) return;
    newData.map((newObj) => {
      //Check if string is part of subcat index, if so then will need to update total
      const index = subCategories.findIndex((obj) =>
        obj.descriptions.has(newObj.description)
      );
      //string is a part of the subCat, add amount to that subCat total
      if (index !== -1) {
        //subCatObj is the object at the specified index
        const subCatObj = subCategories[index];
        //using the object at that index, we get the actual subCategory string
        const subCatStr = subCatObj.subCategory;
        //Check if the subCatStr is in the old totals array of [{subCat, amount}], if so add to previous value
        if (oldTotals.some((obj) => obj.subCategory === subCatStr)) {
          oldTotals.forEach((subCatObj) => {
            if (subCatObj.subCategory === subCatStr) {
              const newAmount =
                Number(subCatObj.amount) + Number(newObj.amount);
              subCatObj.amount = newAmount.toFixed(2);
            }
          });
        } else {
          //subCat is not in old Totals, need to add it and its value
          const newSubCatObj = {
            subCategory: newObj.subCategory,
            amount: Number(newObj.amount).toFixed(2),
          };
          oldTotals.push(newSubCatObj);
        }
      } else {
        //string is not a part of the subCat array, add it to subCat object Unknown and amount
        let unknownExists = false;
        unknownSet.add(newObj.description)
        oldTotals.map((oldObj) => {
          if (oldObj.subCategory === "Unknown") {
            unknownExists = true;
            const newAmount = Number(oldObj.amount) + Number(newObj.amount);
            oldObj.amount = newAmount.toFixed(2);
          }
        });
        if (!unknownExists) {
          const unknownObj = {
            subCategory: "Unknown",
            amount: Number(newObj.amount).toFixed(2),
          };
          oldTotals.push(unknownObj);
        }
      }
    });
    //console.log(oldTotals);
    setTotals(oldTotals);
    if (unknownSet && unknownSet.size > 0) {
      setSubCategories((prev) => {
      const newSubCatArr = structuredClone(prev)
      unknownSet?.forEach(str => newSubCatArr[unknownIndex]?.descriptions?.add(str)) //subCategory: "Unknown"
      return newSubCatArr
    })
    }
  };
  //#region fileUpdate
  const updateFileData = (data) => {
    console.log(`Adding file data to state`);
    setFileData((prev) => {
      let newArr = structuredClone(prev);
      const index = prev.findIndex((obj) => obj?.fileName === data?.fileName);
      if (index !== -1) {
        newArr[index] = data;
      } else {
        newArr.push(data);
      }
      return newArr;
    });
  }

  const removeFileData = (name) => {
    setFileData((prev) => {
      return prev.filter((obj) => obj?.fileName !== name);
    });
  };

  //#endregion
  //#region categories
  //When totals are being run for the file changes, should update categories with the strings parsed from updateTotals
  const updateCategories = (obj) => {
    
  };
  //#endregion

  //#region subcategories
  const updateSubCategories = () => {};
  //#endregion
  return (
    <div className="w-100 h-100">
      <UploadExpenseData
        fileData={fileData}
        updateFn={updateFileData}
        deleteFn={removeFileData}
      />
      {(fileData && fileData.length > 0) && <ExpenseTable categories={categories} totals={totals} />}
      <Button onClick={() => setShowModal(true)}>Show Modal</Button>
      <CategorizeModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default ExpenseTracker;

/*
What are the parts of the application:
1. Section to enter in CSV files (store them in state)
2. Section to show the total values Table; Categories as header row, cols containing subcategories with totals of those subcategories
3. Modal to drag each string to subcats, or subcats to categories. Allows user to make their own categories and subcategories, allows them to modify/delete them as well
4. Charts later on for each to have comparisons
5. Way to save all the data once it's input for categories/subcats, also can save the obj that holds the object: set kv pairs as widget setting for personalization, save in modal?

Process:
1. User adds 1+ csv files, each csv file updates page
2. CSV file is parsed, updates multiple states with data (only adds string with no numbers, (trim?), array of objects {string: value})
3. Custom object to personalize the subcategories, array of objects, string: Set(strings), Custom object with Categories: [subcats]
4. For each row of the CSV file, checks if it exists in subcat object set, if not add it to unknown subcat
*/
