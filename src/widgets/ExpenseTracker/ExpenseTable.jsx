import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
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
    return Array.from(subCatSet)?.reduce((acc, subCatStr) => {
      return Number(acc) + Number(simpleTotals[subCatStr])
    }, 0)
  }

  const style = {
    border: "1px solid black"
  }
  
  return (
    <div>
      <h1>ExpenseTable</h1>
      <table style={style}>
        <thead>
          <tr>
            {categories.map((catObj, catIndex) => (
              <th key={catIndex} colSpan="2" style={style}>{catObj.category}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {categories.map((catObj, catIndex) => (
          {Array.from(catObj.subCategory).map((setStr, strIndex) => (
            <tr key={strIndex}>
              <td style={style}>{setStr}</td>
              <td style={style}>{simpleTotals[setStr] || 0}</td>
            </tr>
          ))}
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
