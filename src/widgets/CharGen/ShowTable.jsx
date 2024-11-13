import React from "react";
import PropTypes from "prop-types";
import { Button, Table } from "react-bootstrap";
const ShowTable = ({ traits, editButtonFunc }) => {
  return (
    <>
      <Table striped bordered hover responsive='sm' size="sm">
        <tbody>
          {Object.entries(traits).map(([k, v], i) => (
            <tr key={i}>
              <td>{k}</td>
              {Array.isArray(v) && v.length > 0
                ? v.map((element, index) =>
                    element.percent > 0 ? (
                      <React.Fragment key={index}>
                        <td>{element.trait}</td>
                        <td>{element.percent}</td>
                      </React.Fragment>
                    ) : (
                      <td key={index} colSpan={2}>
                        {element.trait}
                      </td>
                    )
                  )
                : null}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => editButtonFunc(true)}>Edit</Button>
    </>
  );
};

ShowTable.propTypes = {
  traits: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.shape({
          trait: PropTypes.string,
          percent: PropTypes.number,
        })
      ),
    ])
  ),
  editButtonFunc: PropTypes.func,
};

export default ShowTable;
