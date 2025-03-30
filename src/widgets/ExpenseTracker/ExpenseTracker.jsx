import React, { useEffect, useState } from "react";
import CategorizeModal from "./CategorizeModal";
import { Button } from "react-bootstrap";
import UploadExpenseData from "./UploadExpenseData";
import ExpenseTable from "./ExpenseTable";

const ExpenseTracker = () => {
  //Categories is what is iterated over for table data, subcategories array is just for what strings should be in that subcat, total is for the totals of the subcat
  const [categories, setCategories] = useState([
    { category: "Other", subCategory: new Set(["Unknown", "Ignore"])},
  ]); //Arr objects [{category: ['subcategories']}, ...]
  const [subCategories, setSubCategories] = useState([
    { subCategory: "Unknown", descriptions: new Set() },
  ]); //Arr objects [{subcategory: Set['strings']}, ...] for string matches parsed file data vs personalized strings, pull from Database instead of just having it be unknown
  const [totals, setTotals] = useState([{ subCategory: "Unknown", amount: 0 }]); //Arr objects [{subcategory: total}, ...]
  const [fileData, setFileData] = useState([]); //Arr of objects, each obj is {fileName: {parsedData}}
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSubCategories((prev) => {
      if (subCategories.some((obj) => obj.subCategory === "Unknown")) {
        //console.log(`Subcat has unknown`)
        return prev;
      }
      console.log(`subcat does not have unknown`);
      const newSubCat = [
        ...prev,
        {
          subCategory: "Unknown",
          descriptions: new Set(),
        },
      ];
      return newSubCat;
    });
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

  const resetTotals = () => {
    setTotals([{ subCategory: "Unknown", amount: 0 }]);
  };

  const updateSubCat = (data) => {
    setSubCategories(data);
  };

  //#region fileUpdate
  //Whenever a new file is added, should update old totals with new totals
  const updateTotals = (newData) => {
    //console.log(newData);
    const oldTotals = structuredClone(totals);
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
        //string is not a part of the subCat, add it to subCat Unknown and amount to unknown
        let unknownExists = false;
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
  };

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
    //updateTotals(data.data); //data is arr of objects [{description, amount}]
  };

  const removeFileData = (name) => {
    resetTotals()
    setFileData((prev) => {
      return prev.filter((obj) => obj?.fileName !== name);
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
      <UploadExpenseData
        fileData={fileData}
        updateFn={updateFileData}
        deleteFn={removeFileData}
      />
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
