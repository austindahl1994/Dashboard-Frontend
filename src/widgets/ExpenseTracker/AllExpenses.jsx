import { useContext, useMemo, useState } from "react";
import { months } from "./utils/initialData";
import { ExpenseContext } from "./ExpenseContext";
import * as gu from "./utils/graphUtils.js";

  // TODO: Allow user input for which datasets to use/look at (which months/years/categories)

const AllExpenses = () => {
  const { expenses: monthlyData } = useContext(ExpenseContext);
  const [unusedDates, setUnusedDates] = useState([]) //{month, year} object for what not to show for bar and line charts
  const [unselectedCategories, setUnselectedCategories] = useState([]) //{category} to not show for bar and line charts
  
  const sortedData = monthlyData ? gu.sortArrayByDate(monthlyData) || []
  console.log(sortedData);
  
  // Create an object with a kv of {category: [totals (INT)]} needed for bar (and line?) chart
  // Checks if the category has always existed, added later on, or has been removed
  // Ex. {Food: [0, 7, 10, 0]} based on sortedData from multiple months
  const allCategories = useMemo(() => {
    if (!sortedData) return []
    return sortedData?.reduce((acc, monthObj, index) => {
      for (const categories in monthObj.data) {
        const newCatTotal = gu.generateTotal(monthObj.data[category])
        //if data exists in acc object already, add new total to the category
        if (acc[category]) {
          acc[category].push(newCatTotal)
        } else {
          //First sortedData month object, just add category and amount to allCategories
          if (index === 0) {
            acc[category] = newCatTotal;
          } else {
            //Category is new, add it to allCategories, check what index it is to add 0's for previous months
            acc[category] = Array.from({ length: index }, () => 0);
            acc[category].push(newCatTotal);
          }
        }
      }
      //Check to see if the category has been removed, add Os for following months data
      for (const category in acc) {
        if (acc[category].length < index + 1) {
          acc[category].push(0);
        }
      }
      return acc;
    }, {})
  }, [sortedData])

  // Gets the monthly labels for X axis along with the values for them, returns array of objects [{label: "May '25", amount: 75}...]
  const monthlyTotals = useMemo(() => {
    if (!sortedData) return []
    return sortedData?.map((obj) => {
      // Gets the last 2 digits of year, makes label of Ex. "May '25" 
      const monthStr = obj.year.toString().slice(-2)
      const newObj = {
        label: obj.month + " '" + monthStr,
        amount: 0,
      };
      //iterate over data, getting sum of all subcategory objects in category value
      newObj.amount = generateTotal(obj.data)
      return newObj;
    });
  }, [sortedData]);

  // Returns an object {label, data, backgroundColor} for charts to use
  const datasets = useMemo(() => {
    if (!allCategories) return [];
    Object.keys(allCategories)?.map((category) => {
      return {
        label: category,
        data: allCategories[category],
        backgroundColor: gu.generateRandomColor(), // user choose own colors?
      };
    });
  }, [allCategories]);

  const monthLabels = sortedData?.map((monthObj) => {
    const str = monthObj.year.toString();
    console.log(str);
    return monthObj + " '" + str;
  });

  //array of objects with month, year, and total for that month
  const categoryAverages = useMemo(() => {
    if (!allCategories) return;
    Object?.keys(allCategories)?.reduce((acc, category) => {
      const values = allCategories[category];
      console.log(values)
      const catAvg = values.reduce((catAcc, amount) => {
        return catAcc + amount;
      }, 0);
      acc[category] = values.length ? catAvg / values.length : 0;
      return acc;
    }, {});
  }, [allCategories]);
  
  return <div>AllExpenses</div>;
};

export default AllExpenses;
