import { useState } from "react";
import CategorizeModal from "./CategorizeModal";
import { addTotals, setInitialTotals, getUnknown } from "./expenseUtilities";
import { Button } from "react-bootstrap";
import UploadExpenseData from "./UploadExpenseData";
import ExpenseTable from "./ExpenseTable";
//TODO: If removing a file, do we care about removing unknown strings from the Unknown descriptions set?
//If so, descriptions.clear() for "Unknown" before going through and updating the totals data
//Need to add a check if there is unknown or ignore in subcategories when iteration for other data, if not add them
const freshCats = [
  { category: "Other", subCategory: new Set(["Unknown", "Ignore"]) },
  { category: "Income", subCategory: new Set()},
];
const freshSubCats = [
  { subCategory: "Test", descriptions: new Set() },
  { subCategory: "Unknown", descriptions: new Set() },
  { subCategory: "Ignore", descriptions: new Set() },
];
const freshTotals = [
  { subCategory: "Unknown", amount: 0 },
  { subCategory: "Ignore", amount: 0 },
];
const ExpenseTracker = () => {
  const [fileData, setFileData] = useState([]); //Arr of objects, each obj is {fileName: {parsedData}}
  //Categories is what is iterated over for table data, subcategories array is just for what strings should be in that subcat, total is for the totals of the subcat
  const [categories, setCategories] = useState(freshCats); //Arr objects [{category: ['subcategories']}, ...]
  const [subCategories, setSubCategories] = useState(freshSubCats); //Arr objects [{subcategory: Set['strings']}, ...]
  //Want to add every subCat to totals
  const [showModal, setShowModal] = useState(false);
  const initialTotals = setInitialTotals(subCategories) || freshTotals;
  const totals =
    fileData.length === 0
      ? initialTotals
      : fileData.reduce((acc, nextFileObj) => {
          return addTotals(acc, nextFileObj.data, subCategories);
        }, initialTotals); //Arr objects [{subcategory: total}, ...]

  //#region fileUpdate
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

    setSubCategories((prev) => {
      const newUnknowns = getUnknown(data.data, prev);
      if (newUnknowns?.length > 0) {
        const copy = structuredClone(prev);
        const uIndex = copy?.findIndex((obj) => obj?.subCategory === "Unknown");
        newUnknowns.forEach((str) => {
          copy[uIndex].descriptions.add(str);
        });
        return copy;
      } else {
        return prev
      }
    });

  };

  const removeFileData = (name) => {
    setFileData((prev) => {
      return prev.filter((obj) => obj?.fileName !== name);
    });
  };

  //#endregion
  return (
    <div className="w-100 h-100">
      <UploadExpenseData
        fileData={fileData}
        updateFn={updateFileData}
        deleteFn={removeFileData}
      />
      {fileData && fileData.length > 0 && (
        <ExpenseTable categories={categories} totals={totals || freshTotals} />
      )}
      <Button onClick={() => setShowModal(true)}>Show Modal</Button>
      <CategorizeModal showModal={showModal} setShowModal={setShowModal} categories={categories} subCategories={subCategories} setCategories={setCategories} setSubCategories={setSubCategories}/>
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
