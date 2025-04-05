import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import PropTypes from 'prop-types'
import { useState } from "react";
//LEAVING OFF: Allow user to add/edit/delete subCats and cats, change badge size, settings etc
const ModalGrid = ({title, category, subCategory, setCategories, setSubCategories}) => {
  const [selected, setSelected] = useState(() => {
    if (title === "subCategories") {
      return "Unknown";
    } else {
      return "Other";
    }
  })
  const [heldStr, setHeldStr] = useState('')

  const getIndexByKey = (arr, key, str) => {
    return arr.findIndex(obj => obj[key] === str)
  }

  const getLeftData = () => {
    if (title === "subCategories") {
      const index = getIndexByKey(subCategory, "subCategory", selected);
      if (index === -1) return [];
      const newArr = Array.from(subCategory[index].descriptions);
      //console.log(newArr)
      return newArr;
    } else {
      const otherIndex = getIndexByKey(category, "category", selected);
      const newArr = Array.from(category[otherIndex].subCategory);
      //console.log(newArr);
      return newArr;
    }
  }

  const leftData = getLeftData()

  const getRightData = () => {
    if (title === "subCategories") {
      return subCategory.map((obj) => obj.subCategory);
    } else {
      return category.map((obj) => obj.category);
    }
  }

  const rightData = getRightData()

  const handleDragStart = (str) => {
    setHeldStr(str)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (str) => {
    if (title === "subCategories") {
      moveFromUnknown(str);
    } else {
      moveToCat(str);
    }
  }

  const moveFromUnknown = (newSubCat) => {
    setSubCategories((prev) => {
      const copy = structuredClone(prev)
      const unknownIndex = getIndexByKey(copy, "subCategory", selected);
      copy[unknownIndex].descriptions.delete(heldStr)
      const newSubCatIndex = getIndexByKey(copy, "subCategory", newSubCat)
      copy[newSubCatIndex].descriptions.add(heldStr)
      return copy
    })
    setHeldStr("");
  }

  const moveToCat = (newCat) => {
    if (heldStr === "Unknown" || heldStr === "Ignore") {
      setHeldStr("");
      return;
    }
    setCategories((prev) => {
      const copy = structuredClone(prev);
      const otherIndex = getIndexByKey(copy, "category", selected);
      const newCatIndex = getIndexByKey(copy, "category", newCat);
      copy[otherIndex].subCategory.delete(heldStr);
      copy[newCatIndex].subCategory.add(heldStr)
    });
    setHeldStr("");
  };


  return (
    <div className="w-100 h-100">
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col>
            <Card className="h-100 my-2">
              <Card.Header>{title === "subCategories" ? `Subcategory: ${selected}` : `Category: ${selected}`}</Card.Header>
              <Card.Body>
                {leftData?.length > 0 &&
                  leftData?.map((str, index) => (
                    <Badge
                      key={index}
                      className="mx-1"
                      style={{ cursor: "default", userSelect: "none" }}
                      draggable="true"
                      onDragStart={() => handleDragStart(str)}
                      onDragOver={handleDragOver}
                      onDragEnd={(e) => e.preventDefault()}
                    >
                      {str}
                    </Badge>
                  ))}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6}>
            <div className="d-flex flex-wrap gap-3 my-2 align-items-stretch">
              {rightData?.length > 0 &&
                rightData.map((str, index) => (
                  <Card
                    key={index}
                    style={{ minWidth: "150px", minHeight: "150px" }}
                    onClick={() => setSelected(str)}
                    className="d-flex flex-column"
                    //onDragOver={() => console.log(`Dragging over ${str} holding ${heldStr}`)}
                    onDragOver={(e) => e.preventDefault()}
                    //onDrop={() => console.log(`Dropping ${heldStr} on ${str}`)}
                    onDrop={() => handleDrop(str)}
                  >
                    <Card.Body className="d-flex justify-content-center align-items-center text-center">
                      <h5 className="mb-0">{str}</h5>
                    </Card.Body>
                  </Card>
                ))}
              {/*Add card*/}
              <Card
                style={{ minHeight: "150px", minWidth: "150px" }}
                className="d-flex flex-column"
              >
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <h1 className="mb-0">+</h1>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

ModalGrid.propTypes = {
  title: PropTypes.string,
  category: PropTypes.array,
  subCategory: PropTypes.array,
  setCategories: PropTypes.func,
  setSubCategories: PropTypes.func,
}

export default ModalGrid;
