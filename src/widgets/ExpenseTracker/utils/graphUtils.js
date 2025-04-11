//-------CATEGORIES---------
//get categories without income and ignore in "Other"
const getCatwithoutIncome = (categories) => {
  const copy = categories.filter(obj => obj.category !== "Income")
  const otherIndex = copy.findIndex(obj => obj.category === "Other")
  if (copy[otherIndex].subCategory.has("Ignore")) {
    copy[otherIndex].subCategory.delete("Ignore")
  }
  return copy
};

//match totals subCats with each category subCat for totals [{category: amount}]
const matchTotalsToCats = (catArr, totalsObj) => {
  return catArr.map((obj) => {
    const total = Array.from(obj.subCategory).reduce((acc, str) => {
      if (totalsObj[str]) {
        return Number(totalsObj[str]) + Number(acc)
      } else {
        return Number(acc)
      }
    }, 0)
    return {category: [obj.category], amount: Number(total)}
  })
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
const getModifiedSubCats = () => {
  
};

//match totals with each of those subcategories
const matchTotalsToSubCats = () => {};


//--------SIMPLE TOTALS------
//create a simple totals object, subCategory: amount?
const createSimpleTotals = (totals) => {
  return totals.reduce((acc, obj) => {
    acc[obj.subCategory] = Number(obj.amount)
  }, {})
};

export {
  getCatwithoutIncome,
  matchTotalsToCats,
  getModifiedSubCats,
  matchTotalsToSubCats,
  createSimpleTotals,
};
