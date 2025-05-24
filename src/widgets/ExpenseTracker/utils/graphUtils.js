import { months } from "./initialData";
//-------CATEGORIES---------
//get categories without income and ignore in "Other"
const getCatwithoutIncome = (categories) => {
  //console.log(`Called catwithoutincome`);
  const copy = categories.filter((obj) => obj.category !== "Income");
  const otherIndex = copy.findIndex((obj) => obj.category === "Other");
  if (copy[otherIndex].subCategory.has("Ignore")) {
    copy[otherIndex].subCategory.delete("Ignore");
  }
  //console.log(copy);
  return copy;
};

//match totals subCats with each category subCat for totals [{category, amount}]
const matchTotalsToCats = (catArr, totalsArr) => {
  //console.log(`Called match totals to category`);
  const newArr = catArr.map((catObj) => {
    const total = Array.from(catObj.subCategory).reduce((acc, str) => {
      const catIndex = totalsArr.findIndex(
        (totalsObj) => totalsObj.subCategory === str
      );
      if (catIndex !== -1) {
        //console.log(totalsArr[catIndex].amount);
        return parseFloat(totalsArr[catIndex].amount) + parseFloat(acc);
      } else {
        return Number(acc);
      }
    }, 0);
    //console.log({ category: obj.category, amount: Number(total) });
    return { category: catObj.category, amount: parseFloat(total) };
  });
  //console.log(newArr);
  return newArr;
};

//-------SUBCATEGORIES-------

const checkInCategory = (str, categories) => {
  let existsInIncome = false;
  categories.forEach((obj) => {
    if (obj.category === "Income" && obj.subCategory.has(str)) {
      existsInIncome = true;
    }
  });
  return existsInIncome;
};

//get subcategories besides ignore and any subcategories in Income
const getModifiedSubCats = (totalsArr, categories) => {
  //console.log(`Called subCatWithout ignore`);
  const copy = totalsArr.filter((obj) => obj.subCategory !== "Ignore");
  const finalCopy = copy.filter((obj) => {
    if (!checkInCategory(obj.subCategory, categories)) {
      return obj;
    }
  });
  //console.log(finalCopy);
  return finalCopy;
};

const getModifiedSubCatTotals = (subCatArr, totalsArr) => {
  const copy = subCatArr.map((subCatObj) => {
    const subCatIndex = totalsArr.findIndex(
      (obj) => obj.subCategory === subCatObj.subCategory
    );
    if (subCatIndex !== -1) {
      return {subCategory: subCatObj.subCategory, amount: totalsArr[subCatIndex].amount}
    }
  });
  return copy
};

//--------SIMPLE TOTALS------
//create a simple totals object, subCategory: amount?
const createSimpleTotals = (totals) => {
  return totals.reduce((acc, obj) => {
    acc[obj.subCategory] = Number(obj.amount);
  }, {});
};

//array of objects [{month, year, data}]
const sortArrayByDate = (arr) => {
  return arr.sort((e1, e2) => {
    if (e1.year !== e2.year) {
      return e1.year - e2.year
    } else {
      return months.indexOf(e1.month) - months.indexOf(e2.month)
    }
  })
}

// Takes in array of objects [{HOA: 15}, {GAS: 50}...] and returns amount sum for each of the subCategories
const generateTotal = (subCatArr) => {
  return subCatArr.reduce((acc, obj) => {
    return acc + Object.values(obj)[0];
  }, 0);
};

//Generates label for X line of a graph, passed in string and number, returns single string "month 'year", Ex. "May '25" 
const generateMonthLabels = (month, year) => {
  const yearStr = monthObj.year.toString().slice(-2);
  console.log(str);
  return monthObj + " '" + yearStr;
} 
  
const generateRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

export {
  getCatwithoutIncome,
  matchTotalsToCats,
  getModifiedSubCats,
  getModifiedSubCatTotals,
  createSimpleTotals,
  sortArrayByDate,
  generateTotal,
  generateRandomColor,
  generateMonthLabels
};
