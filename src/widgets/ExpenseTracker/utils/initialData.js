const freshCats = [
  {
    category: "Necessities",
    subCategory: new Set(["HOA", "Mortage", "Electric", "Gas For House"]),
  },
  {
    category: "Car Expenses",
    subCategory: new Set(["Gas", "Auto Insurance", "Car repair"]),
  },
  { category: "Food", subCategory: new Set(["Groceries", "Restaurants"]) },
  {
    category: "Entertainment",
    subCategory: new Set([
      "Internet",
      "Verizon",
      "Games/Books",
      "Date",
      "Trips",
    ]),
  },
  {
    category: "Other",
    subCategory: new Set([
      "Amazon",
      "Medical",
      "Education",
      "Unknown",
      "Ignore",
    ]),
  },
  { category: "Income", subCategory: new Set(["Fairview", "C.H. Robinson"]) },
];
const getSubCats = (categories) => {
  const finalArr = [];
  categories.forEach((obj) => {
    obj.subCategory.forEach((subCat) => {
      //console.log(subCat)
      finalArr.push({ subCategory: subCat, descriptions: new Set() });
    });
  });
  return finalArr;
};
const freshSubCats = getSubCats(freshCats);
const freshTotals = freshSubCats.map((obj) => ({
  subCategory: obj.subCategory,
  amount: 0,
}));

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export {freshCats, freshSubCats, freshTotals, months}