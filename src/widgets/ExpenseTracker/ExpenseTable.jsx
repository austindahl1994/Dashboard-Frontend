import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

//TODO: Add styling component for table

const ExpenseTable = ({ categories, totals }) => {
  const [simpleTotals, setSimpleTotals] = useState({});
  useEffect(() => {
    if (!totals) return;
    // console.log(totals)
    // totals.map((obj) => {
    //   console.log(
    //     `Totals subCats ${obj.subCategory} with amount: ${obj.amount}`
    //   );
    // });
    const newTotalsObj = totals.reduce((acc, obj) => {
      acc[obj?.subCategory] = obj.amount || 0;
      return acc;
    }, {});
    setSimpleTotals(newTotalsObj);
  }, [totals]);

  const maxSubcategories = categories.reduce((acc, obj) => {
    return Math.max(obj.subCategory.size, acc);
  }, 0);

  const categorySum = (subCatSet) => {
    return Array.from(subCatSet)?.reduce((acc, subCatStr) => {
      if (subCatStr in simpleTotals) {
        return Number(acc) + Number(simpleTotals[subCatStr]);
      } else {
        return Number(acc);
      }
    }, 0);
  };

  return (
    <div>
      <h1>ExpenseTable</h1>
      <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {categories.map((catObj, catIndex) => (
              <th
                key={catIndex}
                colSpan="2"
                style={{ border: "1px solid black", textAlign: "center" }}
              >
                {catObj.category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxSubcategories }).map(
              (_, rowIndex) => (
                <tr key={rowIndex}>
                  {categories.map((catObj, catIndex) => {
                    const subCategoriesArray = Array.from(catObj.subCategory);
                    return (
                      <React.Fragment key={catIndex}>
                        <td style={{ border: "1px solid black" }}>
                          {subCategoriesArray[rowIndex] || ""}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {subCategoriesArray[rowIndex]
                            ? simpleTotals[subCategoriesArray[rowIndex]] || 0
                            : ""}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              )
            )}
        </tbody>
        <tfoot>
          <tr>
            {categories.map((catObj, catIndex) => (
              <td
                colSpan="2"
                key={catIndex}
                style={{ border: "1px solid black", textAlign: "center" }}
              >
                {categorySum(catObj.subCategory)}
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
