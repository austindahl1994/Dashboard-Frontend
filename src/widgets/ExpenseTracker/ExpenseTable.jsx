import PropTypes from "prop-types";
import React, { useState } from "react";
import "./styles/expenseTable.css";
import { Modal, Table } from "react-bootstrap";
import { capitalizeFirstLetter } from "../CharGen/utilityFunctions";

//TODO: Add styling component for table
//Remove Ignore from table
const ExpenseTable = ({ categories, totals, subCategories, fileData }) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const simpleTotals = !totals
    ? {}
    : totals.reduce((acc, obj) => {
        acc[obj?.subCategory] = obj.amount || 0;
        return acc;
      }, {});

  const createModifiedCategories = () => {
    const copy = categories.filter((obj) => obj.category !== "Income");
    copy.forEach((obj) => {
      const arr = Array.from(obj.subCategory);
      if (arr.includes("Ignore")) {
        obj.subCategory.delete("Ignore");
      }
    });
    return copy;
  };

  const modifiedCat = createModifiedCategories();

  const getIncomeCat = () => {
    const copy = categories.filter((obj) => obj.category === "Income");
    //console.log(copy[0].subCategory.size);
    return copy;
  };

  const incomeCat = getIncomeCat();

  const maxSubcategories = modifiedCat.reduce((acc, obj) => {
    return Math.max(obj.subCategory.size, acc);
  }, 0);

  const categorySum = (subCatSet) => {
    return Array.from(subCatSet)?.reduce((acc, subCatStr) => {
      if (subCatStr in simpleTotals && subCatStr !== "Ignore") {
        return Number(acc) + Number(simpleTotals[subCatStr]);
      } else {
        return Number(acc);
      }
    }, 0);
  };

  const handleClick = (v) => {
    //console.log(v);
    setSelectedSubCategory(v);
    setShowModal(true);
    getMatchingDescriptions(v);
  };

  const getMatchingDescriptions = (v) => {
    //console.log(v);
    let descArr = [];
    subCategories.forEach((subCatObj) => {
      if (subCatObj.subCategory === v) {
        //console.log(subCatObj.subCategory);
        descArr = [...subCatObj.descriptions];
      }
    });
    //console.log(descArr);
    matchDescWithFileData(descArr);
  };

  const matchDescWithFileData = (descArr) => {
    // console.log(`File data:`);
    // console.log(fileData);
    let finalArr = [];
    fileData.map((file) => {
      descArr.forEach((descString) => {
        file.data.forEach((fileObj) => {
          if (fileObj.description === descString) {
            finalArr.push(fileObj);
          }
        });
      });
    });
    //console.log(finalArr);
    sortDescriptions(finalArr);
  };

  const sortDescriptions = (arrToSort) => {
    const sortedArr = arrToSort.sort((obj1, obj2) => {
      return new Date(obj1.date) - new Date(obj2.date);
    });
    //console.log(sortedArr)
    setSelectedSubCategory(sortedArr);
  };

  const calcTotal = () => {
    const total = selectedSubCategory.reduce((acc, obj) => {
      const value = parseFloat(acc + obj.amount);
      return value;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <div className="d-flex overflow-auto">
      <table>
        <thead>
          <tr>
            {modifiedCat.map((catObj, catIndex) => (
              <th key={catIndex} colSpan="2">
                {catObj.category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxSubcategories }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {modifiedCat.map((catObj, catIndex) => {
                const subCategoriesArray = Array.from(catObj.subCategory);
                return (
                  <React.Fragment key={catIndex}>
                    <td
                      onClick={() => handleClick(subCategoriesArray[rowIndex])}
                    >
                      {subCategoriesArray[rowIndex]}
                    </td>
                    <td>
                      {subCategoriesArray[rowIndex]
                        ? simpleTotals[subCategoriesArray[rowIndex]] || 0
                        : null}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            {modifiedCat.map((catObj, catIndex) => (
              <td colSpan="2" key={catIndex}>
                {categorySum(catObj.subCategory).toFixed(2)}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
      {/*Separate income table from expenses*/}
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Income</th>
          </tr>
        </thead>
        <tbody>
          {incomeCat[0].subCategory.size > 0 ? (
            Array.from(incomeCat[0].subCategory).map((str, index) => (
              <tr key={index}>
                <td>{str || ""}</td>
                <td>{simpleTotals[str]}</td>
              </tr>
            ))
          ) : (
            <tr></tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            {incomeCat.map((catObj, catIndex) => (
              <td colSpan="2" key={catIndex}>
                {categorySum(incomeCat[0].subCategory).toFixed(2)}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
      <Modal
        show={showModal}
        fullscreen
        onHide={() => {
          setShowModal(false);
          setSelectedSubCategory([]);
        }}
      >
        <Modal.Header closeButton />
        <Modal.Body className="d-flex flex-column justify-content-center">
          <table>
            <thead>
              <tr>
                {selectedSubCategory.length > 0 &&
                  Object.keys(selectedSubCategory[0]).map((key, index) => {
                    return <th key={index}>{capitalizeFirstLetter(key)}</th>;
                  })}
              </tr>
            </thead>
            <tbody>
              {selectedSubCategory.length > 0 &&
                selectedSubCategory.map((descObj, index) => (
                  <tr key={index}>
                    <td>{descObj.date || null}</td>
                    <td>{descObj.description || null}</td>
                    <td>{descObj.amount.toFixed(2) || null}</td>
                  </tr>
                ))}
            </tbody>
            {selectedSubCategory.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2}>Total</td>
                  <td>{calcTotal()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </Modal.Body>
      </Modal>
    </div>
  );
};
//[{category: "Other", subCategory: Set["Unknown"]}]
ExpenseTable.propTypes = {
  categories: PropTypes.array,
  subCategories: PropTypes.array,
  totals: PropTypes.array,
  fileData: PropTypes.array,
};

export default ExpenseTable;
