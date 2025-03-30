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
    const d = new Date()
    console.log(`Time updated: ${d.getMinutes()}`)
  }, [totals])

  const categorySum = (subCatSet) => {
    return Array.from(subCatSet)?.reduce((acc, subCatStr) => {
      if (simpleTotals.hasOwnProperty(subCatStr)) {
        return Number(acc) + Number(simpleTotals[subCatStr])
      } else {
        return Number(acc)
      }
    }, 0)
  }

  const style = {
    border: "1px solid black"
  }
  
  return (
    <div>
      <h1>ExpenseTable</h1>
      <table style={{border: "1px solid black"}}>
        <thead>
          <tr>
            {categories.map((catObj, catIndex) => (
              <th key={catIndex} colSpan="2">{catObj.category}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {categories.map((catObj, catIndex) => (
          <React.Fragment key={catIndex}>
            {Array.from(catObj.subCategory).map((setStr, strIndex) => (
              <tr key={strIndex}>
                <td>{setStr}</td>
                <td>{simpleTotals[setStr] || 0}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
        </tbody>
        <tfoot>
          <tr>
            {/*In a single row, iterate through categories, for every category have a td of the sum*/}
            {categories.map((catObj, catIndex) => (
              <td colSpan="2" key={catIndex} style={style}>{categorySum(catObj.subCategory)}</td>
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
