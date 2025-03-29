import React, { useEffect, useState } from "react";
import CategorizeModal from "./CategorizeModal";
import { modifyData } from "./expenseUtilities";
import { Button, Card } from "react-bootstrap";
import UploadExpenseData from "./UploadExpenseData";
import ExpenseTable from "./ExpenseTable";

const ExpenseTracker = () => {
  //Categories is what is iterated over for table data, subcategories array is just for what strings should be in that subcat, total is for the totals of the subcat
  const [categories, setCategories] = useState([{category: "Other", subCategory: new Set(["Unknown"])}]); //Arr objects [{category: ['subcategories']}, ...]
  const [subCategories, setSubCategories] = useState([{subCategory: "Unknown", descriptions: new Set()}]); //Arr objects [{subcategory: Set['strings']}, ...] for string matches parsed file data vs personalized strings, pull from Database instead of just having it be unknown
  const [totals, setTotals] = useState([{subCat: "Unknown", amount: 0}]); //Arr objects [{subcategory: total}, ...]
  const [fileData, setFileData] = useState([]); //Arr of objects, each obj is {fileName: {parsedData}}
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    //Do a check, if greater then zero should modify, however if greater than one should add the new file? Or just dont care, get it done, make it re-render every file change
    if (fileData && fileData.length > 0) {
      fileData.map((obj) => {
        //console.log(obj.fileName);
        //When a new file is uploaded, need to modify subcategories and totals
        modifyData(obj.data, subCategories, totals, updateSubCat, updateTotals)
      });
    }
  }, [fileData]);

  const resetTotals = () => {
    setTotals([{subCategories: "Unknown", amount: 0}])
  }

  const updateSubCat = (data) => {
    setSubCategories(data)
  }

  const updateTotals = (newData) => {
    setTotals((prev) => {
      if (prev) { //If there was other data, add new totals to old
        const oldTotals = structuredClone(prev)
        //iterate through copy of old totals array
        newData.forEach((newTotalsObj) => {
          let oldTotalsHasSubCat = false
          //For every new total, check if there is an old total that matches it, then add amount to it
          oldTotals.forEach((oldTotalsObj) => {
            if (oldTotalsObj.subCategory === newTotalsObj.subCategory) {
              newTotalsObj.amount += oldTotalsObj.amount
              oldTotalHasSubCat = true
            }
          })
          //If previous totals does not have the subcategory, push it into the copy array
          if (!oldTotalHasSubCat) {
            newData.push(newTotalsObj)
          }
        })
        return newTotals
      } else {
        //No previous data, just set totals to the new data
        return newData
      }
    })
  }

  //#region fileData
  const updateFileData = (data) => {
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
  };

  const removeFileData = (name) => {
    resetTotals()
    setFileData((prev) => {
      const finalArr = prev.filter((obj) => obj?.fileName !== name);
      return finalArr;
    });
  };

  //#endregion
  //#region categories
  const updateCategories = () => {};
  //#endregion

  //#region subcategories
  const updateSubCategories = () => {};
  //#endregion
  return (
    <div className="w-100 h-100">
      <UploadExpenseData fileData={fileData} updateFn={updateFileData} deleteFn={removeFileData}/>
      <ExpenseTable />
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
