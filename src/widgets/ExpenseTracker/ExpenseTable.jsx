import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
const ExpenseTable = ({categories, totals}) => {
  const [simpleTotals, setSimpleTotals] = useState({})
  useEffect(() => {
    const newTotalsObj = totals.reduce((acc, obj) => {
      acc[obj?.subCategory] = obj.amount || 0
      return acc
    }, {})
    setSimpleTotals(newTotalsObj)
  }, [totals])

  const categorySum = (subCatSet) => {
    return Array.from(subCatSet.subCategory).reduce((acc, subCatStr) => {
      return acc + simpleTotals[subCatStr]
    }, 0)
  }
  
  return (
    <div>
      <h1>ExpenseTable</h1>
      <table>
        <thead>
          <tr>
            {categories.map((catObj, catIndex) => (
              <th key={catIndex} colSpan="2">{catObj.category}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {categories.map((catObj, catIndex) => (
          <tr key={catIndex}>
          {Array.from(catObj.subCategory).map((setStr, strIndex) => (
            <React.Fragment key={strIndex}>
              <td>{setStr}</td>
              <td>{simpleTotals[setStr] || 0}</td>
            </React.Fragment>
          ))}
          </tr>
        ))}
        </tbody>
        <tfoot>
          <tr>
            {/*In a single row, iterate through categories, for every category have a td of the sum*/}
            {categories.map((catObj, catIndex) => (
              <td colSpan="2" key={catIndex}>{categorySum(catObj.subCategory)}</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
//[{category: "Other", subCategory: Set["Unknown"]}]
ExpenseTable.propTypes = {
    categories: PropTypes.array,
    subcategories: PropTypes.array,
    totals: PropTypes.array
}

export default ExpenseTable
