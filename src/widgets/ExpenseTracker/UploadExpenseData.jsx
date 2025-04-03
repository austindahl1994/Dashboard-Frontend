import { Button, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import React from "react";
import { updateFile } from "./expenseUtilities";

const UploadExpenseData = ({ fileData, updateFn, deleteFn }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateFile(file, updateFn);
      e.target.value = "";
    }
  };
  return (
    <div className="d-flex w-100 justify-content-evenly">
      <Card className="d-flex p-2 m-0 align-items-center">
        <p>Input file: </p>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </Card>
      <Card className="d-flex w-50">
        {fileData.length === 0 ? (
          <p className="d-flex w-100 h-100 justify-content-center align-items-center">
            No file Data
          </p>
        ) : (
          fileData.map((obj, index) => {
            return (
              <React.Fragment key={index}>
                <div className="d-flex flex-column">
                  <p className="d-flex m-1 justify-content-center align-items-center">
                    {obj.fileName}
                    <Button
                      variant="danger"
                      className="mx-2"
                      onClick={() => deleteFn(obj.fileName)}
                    >
                      X
                    </Button>
                  </p>
                </div>
              </React.Fragment>
            );
          })
        )}
      </Card>
    </div>
  );
};

UploadExpenseData.propTypes = {
  fileData: PropTypes.array,
  updateFn: PropTypes.func,
  deleteFn: PropTypes.func,
};

export default UploadExpenseData;
