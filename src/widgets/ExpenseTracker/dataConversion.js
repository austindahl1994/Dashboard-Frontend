// Convert for backend:
//Subcategory has all of the description strings for parsing through
//subCatArr = [{subCategory: 'subCat string', descriptions: Set(["desc string"])}]
const convertForBackendSettings = (subCatArr) => {
  const newArr = [];
  subCatArr.forEach((subCatObj) => {
    let subCategory = "";
    let newSubCatObj = {};
    Object.keys(subCatObj).forEach((key, index) => {
      if (index === 0) subCategory = subCatObj[key];
      if (index === 1) {
        newSubCatObj[subCategory] = [...subCatObj[key]];
        newArr.push(newSubCatObj);
      }
    });
  });
  return JSON.stringify(newArr);
};

//totalsArr = [{subCategory: 'someSubCat', amount: someInt}]
const simplifyTotals = (totalsArr) => {
  return totalsArr.reduce((acc, totalsObject) => {
    acc[totalsObject.subCategory] = totalsObject.amount;
    return acc;
  }, {});
};

//Categories has what subcats are in what category, totals has the amounts of those subCats
//Will be a new object, key is category array of objects that are {subcategory: amount} as kv
//catArr = [{category: 'someCat', subCats: Set(['subCat strings'])}]
const convertForBackendData = (catArray, totalsArr) => {
  const newObj = {};
  const totalsObject = simplifyTotals(totalsArr);
  catArray.forEach((categoryObject) => {
    let currentCat = "";
    Object.keys(categoryObject).forEach((categoryKey, index) => {
      //Index is which category key is used, 0 is category, 1 is subCategory
      if (index === 0) {
        currentCat = categoryObject[categoryKey]; //Entertainment etc.
        newObj[currentCat] = [];
      }
      if (index === 1 && currentCat.length !== 0) {
        categoryObject[categoryKey].forEach((subCategory) => {
          const subCatObj = {
            [subCategory]: totalsObject[subCategory],
          };
          newObj[currentCat].push(subCatObj);
        });
      }
    });
  });
  return JSON.stringify(newObj);
};

//Convert for frontend:
//will receive an object from axios already parsing the returned string
//array of [{subCategory: ["description strings"]}]
//change into subCatArr = [{subCategory: 'subCat string', descriptions: Set(["desc string"])}]
const convertForFrontendSettings = (data) => {
  // console.log(`Convert for frontend was called`)
  let subCatArr
  if (typeof data === "string") {
    subCatArr = JSON.parse(data)
  } else {
    subCatArr = data
  }
  const finalSubCatArr = subCatArr.map((subCatObj) => {
    const newObj = { subCategory: null, descriptions: null };
    for (const subCategory in subCatObj) {
      //console.log(`Subcategory of ${subCategory} has descriptions: ${subCatObj[subCategory]}`)
      newObj.subCategory = subCategory;
      newObj.descriptions = new Set(subCatObj[subCategory]);
    }
    return newObj;
  });
  // console.log(finalSubCatArr)
  return finalSubCatArr
};

//Data passed in - [{categoryName: [{subCategoryName: amount}] }]
//Want two arrays:
//Categories: [{category: 'someCatName', subCategories: ['subCatNames']}]
//Totals: [{subCategory: 'subCatName', amount: INT}]
const convertForFrontendData = (catArr) => {
  let newCategoryArray = [];
  let newTotalsArray = [];

  //Iterate through the original data passed in
  catArr.forEach((categoryObject) => {
    const newCatObj = { category: null, subCategories: new Set() };

    //Look into each category object {categoryName: array[{subcategoryName: INT}]}
    for (const category in categoryObject) {
      //get the Category name
      newCatObj.category = category;

      //Iterate through the array of the category to get subcats and amounts
      categoryObject[category].forEach((subCategoryObject) => {
        //Look at each subcat object {subCategory: INT}
        for (const subCategory in subCategoryObject) {
          newCatObj.subCategories.add(subCategory);
          newTotalsArray.push({
            subCategory: subCategory,
            amount: subCategoryObject[subCategory],
          });
        }
      });
    }
    newCategoryArray.push(newCatObj);
  });
  return { newCategoryArray, newTotalsArray };
};

export {
  convertForBackendData,
  convertForBackendSettings,
  convertForFrontendData,
  convertForFrontendSettings,
};
