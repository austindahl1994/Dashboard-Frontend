import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import "./styles/expenseTable.css";

//TODO: Add styling component for table
//Remove Ignore from table
const ExpenseTable = ({ categories, totals }) => {
  const [simpleTotals, setSimpleTotals] = useState({});

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

  useEffect(() => {
    if (!totals) return;
    const newTotalsObj = totals.reduce((acc, obj) => {
      acc[obj?.subCategory] = obj.amount || 0;
      return acc;
    }, {});
    setSimpleTotals(newTotalsObj);
  }, [totals]);

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
                    <td>{subCategoriesArray[rowIndex]}</td>
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
    </div>
  );
};
//[{category: "Other", subCategory: Set["Unknown"]}]
ExpenseTable.propTypes = {
  categories: PropTypes.array,
  subcategories: PropTypes.array,
  totals: PropTypes.array,
};

export default ExpenseTable;
