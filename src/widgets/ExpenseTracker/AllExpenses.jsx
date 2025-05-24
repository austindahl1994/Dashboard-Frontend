import { useContext, useMemo } from "react";
import { months } from "./utils/initialData";
import { ExpenseContext } from "./ExpenseContext";
import { generateRandomColor } from "./utils/graphUtils";

const AllExpenses = () => {
  const { expenses: monthlyData } = useContext(ExpenseContext);
  const sortedData = monthlyData?.sort((m1, m2) => {
    //if years arent the same, can easily sort, if not have to go by month
    if (m1.year !== m2.year) {
      return m1.year - m2.year;
    } else {
      return months.indexOf(m1.month) - months.indexOf(m2.month);
    }
  });
  console.log(sortedData);
  //passed in array of subcategories and totals [{HOA: 10}, {Gas: 15}]
  const generateTotal = (subCatArr) => {
    return subCatArr.reduce((acc, obj) => {
      return acc + Object.values(obj)[0];
    }, 0);
  };

  // {Food: [0, 7, 10, 0]} based on data from multiple months
  //MEMOIZE THIS DATA based on monthlyData
  const allCategories = sortedData?.reduce((acc, monthObj, index) => {
    Object.keys(monthObj.data).forEach((category) => {
      const newCatTotal = generateTotal(monthObj.data[category]);
      //if data exists in acc object already, add new total to the category
      if (acc[category]) {
        acc[category].push(newCatTotal);
        //category is new, add it to allCategories, check what index it is to add 0's to it
      } else {
        //first month object, just add category and amount to allCategories
        if (index === 0) {
          acc[category] = newCatTotal;
          //category was added later on, need to add zeros for previous years
        } else {
          acc[category] = Array.from({ length: index }, () => 0);
          acc[category].push(newCatTotal);
        }
      }
    });
    //iterate over each category of the acc object, if the arr length is less than the index + 1, append 0 to the end of it, since nothing added in for the current month but need chart value
    for (const category in acc) {
      if (acc[category].length < index + 1) {
        acc[category].push(0);
      }
    }
    return acc;
  }, {});
  const monthlyTotals = useMemo(() => {
    return sortedData?.map((obj) => {
      const newObj = {
        label: obj.month + " '" + obj.year.toString().slice(-2),
        amount: 0,
      };
      //iterate over data, getting sum of all subcategory objects in category value
      for (const categories in obj.data) {
        newObj.amount = obj.data[categories].reduce((acc, subCatObj) => {
          return acc + Object.values(subCatObj)[0];
        }, 0);
      }
      return newObj;
    });
  }, [sortedData]);

  const datasets = useMemo(() => {
    if (!allCategories) return;
    Object.keys(allCategories)?.map((category) => {
      return {
        label: category,
        data: allCategories[category],
        backgroundColor: generateRandomColor(), // user choose own colors?
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

  if (!monthlyData) {
    return <div>Loading...</div>;
  }
  return <div>AllExpenses</div>;
};

export default AllExpenses;
