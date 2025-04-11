import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { updateFile } from "./utils/expenseUtilities";

const UploadExpenseData = ({ updateFn }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateFile(file, updateFn);
      e.target.value = "";
    }
  };

  return (
    <div className="d-flex w-100 h-100 overflow-auto">
      <Card className="d-flex h-100 w-100 p-2 m-0 align-items-center">
        <p>Input file: </p>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </Card>
    </div>
  );
};

UploadExpenseData.propTypes = {
  updateFn: PropTypes.func,
};

export default UploadExpenseData;
