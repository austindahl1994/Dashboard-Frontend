import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CategorizeModal from "./CategorizeModal";
import {
  addTotals,
  setInitialTotals,
  getUnknown,
} from "./utils/expenseUtilities";
import {
  freshCats,
  freshSubCats,
  freshTotals,
  months,
} from "./utils/initialData.js";
import { Button, Accordion, Container, Row, Col, Card } from "react-bootstrap";
import UploadExpenseData from "./UploadExpenseData";
import ExpenseTable from "./ExpenseTable";
import ExpensePieGraph from "./ExpensePieGraph";
import * as gu from "./utils/graphUtils.js";
import "./styles/expenseTracker.css";
import {
  convertForBackendData,
  convertForBackendSettings,
} from "./dataConversion.js";
import {
  getExpenseSettings,
  mutateExpenseSettings,
} from "./utils/expenseQueries.js";
//LEAVING OFF: Finish updating totals for table, setup front/backend data updates

const ExpenseTracker = () => {
  const queryClient = useQueryClient();
  const widgetSettings = useQuery(getExpenseSettings());
  const saveSettingsConfig = mutateExpenseSettings(queryClient);
  const saveWidgetSettings = useMutation(saveSettingsConfig);

  const [fileData, setFileData] = useState([]); //Arr of objects, each obj is {fileName: {parsedData}}
  //Categories is what is iterated over for table data, subcategories array is just for what strings should be in that subcat, total is for the totals of the subcat
  const [categories, setCategories] = useState(freshCats); //Arr objects [{category: ['subcategories']}, ...]
  const [subCategories, setSubCategories] = useState(freshSubCats); //Arr objects [{subcategory: Set['strings']}, ...]
  //Want to add every subCat to totals
  const [showModal, setShowModal] = useState(false);
  const [activeKey, setActiveKey] = useState("0");
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    if (widgetSettings.isSuccess && widgetSettings.data) {
      setSubCategories(widgetSettings.data);
    }
  }, [widgetSettings.isSuccess, widgetSettings.data]);

  const initialTotals = setInitialTotals(subCategories) || freshTotals;
  const totals =
    fileData.length === 0
      ? initialTotals
      : fileData.reduce((acc, nextFileObj) => {
          return addTotals(acc, nextFileObj.data, subCategories);
        }, initialTotals); //Arr objects [{subcategory: total}, ...]

  const catTotals = gu.matchTotalsToCats(
    gu.getCatwithoutIncome(categories),
    totals
  );
  const modSubCat = gu.getModifiedSubCats(totals, categories);
  const subCatTotals = gu.getModifiedSubCatTotals(modSubCat, totals);

  //#region fileUpdate
  const updateFileData = (data) => {
    if (selectedOption?.length === 0) {
      setSelectedOption(data.fileName);
    }
    setFileData((prev) => {
      let newArr = structuredClone(prev);
      const index = prev.findIndex((obj) => obj?.fileName === data?.fileName);
      if (index !== -1) {
        newArr[index] = data;
      } else {
        newArr.push(data);
      }
      return newArr;
    });

    setSubCategories((prev) => {
      const newUnknowns = getUnknown(data.data, prev);
      if (newUnknowns?.length > 0) {
        const copy = structuredClone(prev);
        const uIndex = copy?.findIndex((obj) => obj?.subCategory === "Unknown");
        newUnknowns.forEach((str) => {
          copy[uIndex].descriptions.add(str);
        });
        return copy;
      } else {
        return prev;
      }
    });
  };

  const removeFileData = (name) => {
    setFileData((prev) => {
      const copyWithoutDeleted = prev.filter((obj) => obj?.fileName !== name);
      if (copyWithoutDeleted.length > 0) {
        setSelectedOption(copyWithoutDeleted[0].fileName);
      }
      return copyWithoutDeleted;
    });
  };
  //returns array of years
  const getYears = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const range = 10;
    return Array.from(
      { length: range * 2 + 1 },
      (_, i) => currentYear - range + i
    );
  };

  const handleSaveExpenses = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const year = formData.get("year");
    const month = formData.get("month");
    console.log(`Saving expense data to expenses table`);
    console.log(`Year: ${year}, Month: ${month}`);
    const saveData = convertForBackendData(categories, totals);
    console.log(saveData);
  };

  const handleSaveSettings = () => {
    //console.log(`Save Categories to database`);
    const saveData = convertForBackendSettings(subCategories);
    saveWidgetSettings.mutate({ settings: saveData, location: "expenses" });
  };

  //#endregion
  return (
    <div className="w-100 h-100">
      <Accordion
        onSelect={(e) => setActiveKey(e)}
        className="d-flex flex-column h-100"
        defaultActiveKey="0"
      >
        <Accordion.Item
          eventKey="0"
          className={`d-flex flex-column ${
            activeKey === "0" ? "flex-grow-1" : ""
          }`}
        >
          <Accordion.Header>File Data</Accordion.Header>
          <Accordion.Body>
            <Container>
              <Row>
                {/*UPLOAD FILES */}
                <Col sm={6} md={3}>
                  <UploadExpenseData
                    fileData={fileData}
                    updateFn={updateFileData}
                    deleteFn={removeFileData}
                  />
                </Col>
                {/*DISPLAY FILES */}
                <Col sm={6} md={3}>
                  <Card className="w-100 h-100">
                    <Card.Body className="d-flex">
                      {fileData.length === 0 ? (
                        <p className="d-flex w-100 h-100 justify-content-center align-items-center">
                          No file Data
                        </p>
                      ) : (
                        <div className="w-100 d-flex justify-content-center align-items-center">
                          <label htmlFor="files">Files: </label>
                          <select
                            name="files"
                            id="files"
                            className="w-75"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                          >
                            {fileData.map((obj, index) => (
                              <option value={obj.fileName} key={index}>
                                {obj.fileName}
                              </option>
                            ))}
                          </select>
                          <Button
                            variant="danger"
                            size="sm"
                            className="mx-2"
                            onClick={() => removeFileData(selectedOption)}
                          >
                            X
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                {/*SAVE DATA TO DATABASE WITH MONTH AND YEAR */}
                <Col sm={6} md={3}>
                  <Card className="h-100">
                    <Card.Body className="p-1">
                      <form
                        className="d-flex flex-column m-0 p-0"
                        onSubmit={handleSaveExpenses}
                      >
                        <label htmlFor="year">Year: </label>
                        <select
                          name="year"
                          id="year"
                          defaultValue={new Date().getFullYear()}
                        >
                          {getYears().map((year, index) => {
                            return (
                              <option key={index} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                        <label htmlFor="month" className="mx-1">
                          Month:{" "}
                        </label>
                        <select
                          name="month"
                          id="month"
                          defaultValue={months[new Date().getMonth()]}
                        >
                          {months.map((month, index) => {
                            return (
                              <option key={index} value={month}>
                                {month}
                              </option>
                            );
                          })}
                        </select>
                        <Button className="mt-1" type="submit">
                          Save
                        </Button>
                      </form>
                    </Card.Body>
                  </Card>
                </Col>
                {/*MODIFY AND SAVE CATEGORIES */}
                <Col sm={6} md={3}>
                  <Card className="h-100">
                    <div className="d-flex h-100 flex-column p-2 justify-content-evenly">
                      <Button onClick={() => setShowModal(true)}>
                        Modify Categories
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleSaveSettings()}
                      >
                        Save Categories
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row>
                {/**EXPENSE GRAPH */}
                <Col>
                  {fileData && fileData.length > 0 && (
                    <ExpenseTable
                      categories={categories}
                      totals={totals || freshTotals}
                    />
                  )}
                </Col>
              </Row>
              {/**GRAPHS TO DISPLAY DATA */}
              <Row className="d-flex align-items-center justify-content-center custom-row">
                <Col>
                  {fileData && fileData.length > 0 && (
                    <ExpensePieGraph
                      totalsArr={catTotals}
                      categories={catTotals}
                      title="Categories"
                    />
                  )}
                </Col>
                <Col>
                  {fileData && fileData.length > 0 && (
                    <ExpensePieGraph
                      totalsArr={subCatTotals}
                      categories={modSubCat}
                      title="Subcategories"
                    />
                  )}
                </Col>
              </Row>
            </Container>

            <CategorizeModal
              showModal={showModal}
              setShowModal={setShowModal}
              categories={categories}
              subCategories={subCategories}
              setCategories={setCategories}
              setSubCategories={setSubCategories}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item
          eventKey="1"
          className={`d-flex flex-column ${
            activeKey !== "0" ? "flex-grow-1" : ""
          }`}
        >
          <Accordion.Header>Database Data</Accordion.Header>
          <Accordion.Body>
            <h1>Data Body</h1>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ExpenseTracker;

/*
What are the parts of the application:
1. Section to enter in CSV files (store them in state)
2. Section to show the total values Table; Categories as header row, cols containing subcategories with totals of those subcategories
3. Modal to drag each string to subcats, or subcats to categories. Allows user to make their own categories and subcategories, allows them to modify/delete them as well
4. Charts later on for each to have comparisons
5. Way to save all the data once it's input for categories/subcats, also can save the obj that holds the object: set kv pairs as widget setting for personalization, save in modal?

Process:
1. User adds 1+ csv files, each csv file updates page
2. CSV file is parsed, updates multiple states with data (only adds string with no numbers, (trim?), array of objects {string: value})
3. Custom object to personalize the subcategories, array of objects, string: Set(strings), Custom object with Categories: [subcats]
4. For each row of the CSV file, checks if it exists in subcat object set, if not add it to unknown subcat
*/
