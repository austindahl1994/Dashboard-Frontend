import React, { useEffect, useState } from "react";
import CategorizeModal from "./CategorizeModal";
import { modifyData } from "./expenseUtilities";
import { Button, Card } from "react-bootstrap";
import UploadExpenseData from "./UploadExpenseData";
import ExpenseTable from "./ExpenseTable";

// const tempCategories = [
//   {
//     Necessities: ["HOA", "Mortgage", "Electric"],
//   },
//   {
//     "Car Expenses": ["Gas", "Auto Insurance"],
//   },
//   {
//     Other: ["Unknown"],
//   },
// ];

// const tempSubCategories = [
//   // { Mortgage: new Set() },
//   // { HOA: new Set() },
//   // { Electric: new Set() },
//   // { "Gas for house": new Set() },
//   // { Gas: new Set() },
//   { Unknown: new Set() },
// ];

// const tempTotals = [
//   {Other: 0}
// ]

const ExpenseTracker = () => {
  //Categories is what is iterated over for table data, subcategories array is just for what strings should be in that subcat, total is for the totals of the subcat
  const [categories, setCategories] = useState([]); //Arr objects [{category: ['subcategories']}, ...]
  const [subCategories, setSubCategories] = useState([]); //Arr objects [{subcategory: Set['strings']}, ...] for string matches parsed file data vs personalized strings
  const [unknown, setUnkown] = useState([])
  const [totals, setTotals] = useState([]); //Arr objects [{subcategory: total}, ...]
  const [fileData, setFileData] = useState([]); //Arr of objects, each obj is {fileName: {parsedData}}
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (fileData && fileData.length > 0) {
      fileData.map((obj) => {
        //console.log(obj.fileName);
        //When a new file is uploaded, need to modify subcategories and totals
        modifyData(obj.data)
      });
    }
  }, [fileData]);

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

  //#region totals
  const updateTotals = () => {};
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
