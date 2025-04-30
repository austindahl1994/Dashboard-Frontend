import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { MdDeleteForever } from "react-icons/md";
import { useMemo, useState } from "react";

const ModalGrid = ({
  title,
  category,
  subCategory,
  setCategories,
  setSubCategories,
  settings,
}) => {
  const [selected, setSelected] = useState(() => {
    if (title === "subCategories") {
      return "Unknown";
    } else {
      return "Other";
    }
  });
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [heldStr, setHeldStr] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [hovering, setHovering] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [dragging, setDragging] = useState(false);

  const getIndexByKey = (arr, key, str) => {
    // console.log(`Key of: ${key}`);
    // console.log(`String of: ${str}`);
    return arr.findIndex((obj) => obj[key] === str);
  };

  //Left card will either contain all strings in subCat or all subCat strings in categories
  const leftData = useMemo(() => {
    const getLeftData = () => {
      if (title === "subCategories") {
        const index = getIndexByKey(subCategory, "subCategory", selected);
        if (index === -1) return [];
        const newArr = Array.from(subCategory[index].descriptions);
        return newArr.sort();
      } else {
        const otherIndex = getIndexByKey(category, "category", selected);
        //console.log(`The returned index was ${otherIndex}`);
        if (otherIndex === -1) {
          setSelected("Other")
          return
        }
        const newArr = Array.from(category[otherIndex].subCategory);
        return newArr.sort();
      }
    };

    return getLeftData();
  }, [category, subCategory, selected, title]);

  //Right data will be either the subCategories strings can go into or the categories subCats can go into
  const rightData = useMemo(() => {
    const getRightData = () => {
      if (title === "subCategories") {
        return subCategory.map((obj) => obj.subCategory).sort();
      } else {
        return category.map((obj) => obj.category);
      }
    };
    return getRightData();
  }, [category, subCategory, title]);

  //const rightData = getRightData();

  //Don't allow users to change these values
  const checkMainKeys = (str) => {
    if (
      str === "Ignore" ||
      str === "Income" ||
      str === "Unknown" ||
      str === "Other"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkPrevious = (str) => {
    //console.log(`Checking previous`)
    let exists = false;
    if (title === "subCategories") {
      subCategory.forEach((obj) => {
        if (obj.subCategory === str) {
          //console.log(`subCategories already has that!`);
          exists = true;
        }
      });
    } else {
      category.forEach((obj) => {
        if (obj.category === str) {
          //console.log(`Categories already has that!`)
          exists = true;
        }
      });
    }
    return exists;
  };

  const handleDragStart = (str) => {
    setDragging(true);
    setHeldStr(str);
  };

  const handleDragEnd = () => {
    setHeldStr("");
    setEditingIndex(0);
    setDragging(false);
    setHovering(false);
  };

  const handleDragEnter = (e, i) => {
    e.preventDefault();
    setHovering(true);
    setEditingIndex(i);
  };

  const handleDrop = (str) => {
    setHovering(false);
    setEditingIndex(-1);
    if (title === "subCategories") {
      moveFromUnknown(str);
    } else {
      moveToCat(str);
    }
  };

  const handleHover = (index) => {
    setHovering(true);
    setHoverIndex(index);
  };

  const handleMouseOut = () => {
    setHovering(false);
    setHoverIndex(-1);
  };

  //Check if the input string already is a part of subCategories or categories

  //User clicked '+', add to subCat or Cat
  const handleAddBlur = () => {
    setAdding(false);
    if (editText.length === 0 || checkPrevious(editText)) {
      setEditText("");
      return;
    }
    if (title === "subCategories") {
      //console.log(`Add to subcat: ${editText}`);
      setSubCategories((prev) => {
        const copy = structuredClone(prev);
        copy.push({ subCategory: editText, descriptions: new Set() });
        return copy;
      });
      setCategories((prev) => {
        const copy = structuredClone(prev);
        const otherIndex = getIndexByKey(copy, "category", "Other");
        copy[otherIndex].subCategory.add(editText);
        return copy;
      });
    } else {
      //console.log(`Add to cat: ${editText}`);
      setCategories((prev) => {
        const copy = structuredClone(prev);
        copy.push({ category: editText, subCategory: new Set() });
        return copy;
      });
    }
    setEditText("");
  };

  //Editing data, instead of adding it, need to add every description that was in the old subcat description to the new subcat description OR remove old subCat from categories and add the new one to prev category Set
  const handleEditBlur = () => {
    setEditing(false);
    if (editText.length === 0) {
      const oldString = structuredClone(heldStr);
      handleDelete(oldString);
      setSelected(title === "subCategories" ? "Unknown" : "Other");
      setEditText("");
      setHeldStr("");
      return;
    }
    if (checkPrevious(editText)) {
      setSelected(title === "subCategories" ? "Unknown" : "Other");
      setEditText("");
      setHeldStr("");
      return;
    }
    if (title === "subCategories") {
      //Edit a current subCategory, adding the past subCat descptions to the new one
      setSubCategories((prev) => {
        const copy = prev.filter((obj) => obj.subCategory !== heldStr);
        const oldSubCatIndex = getIndexByKey(prev, "subCategory", heldStr);
        const newSubCatObj = { subCategory: editText, descriptions: new Set() };
        prev[oldSubCatIndex].descriptions.forEach((e) => {
          newSubCatObj.descriptions.add(e);
        });
        copy.push(newSubCatObj);
        return copy;
      });
      //Need to remove the old subCat from the category containing it, then add it to other
      setCategories((prev) => {
        const copy = structuredClone(prev);
        let categoryStr = "";
        copy.forEach((obj) => {
          if (obj.subCategory.has(heldStr)) {
            obj.subCategory.delete(heldStr);
            categoryStr = obj.category;
          }
        });
        const catIndex = copy.findIndex((obj) => obj.category === categoryStr);
        if (catIndex !== -1) {
          copy[catIndex].subCategory.add(editText);
        }
        return copy;
      });
      setSelected(editText);
      setEditText("");
      setHeldStr("");
    } else {
      setCategories((prev) => {
        const copy = prev.filter((obj) => obj.category !== heldStr);
        const newCatObj = {
          category: editText,
          subCategory: new Set(),
        };
        prev.forEach((obj) => {
          if (obj.subCategory.size > 0 && obj.category === heldStr) {
            obj.subCategory.forEach((str) => {
              newCatObj.subCategory.add(str);
            });
          }
        });
        copy.push(newCatObj);
        return copy;
      });
      setSelected(editText);
      setEditText("");
      setHeldStr("");
    }
  };

  //Delete called either from editing and leaving as a blank string or pressing X button on card
  const handleDelete = (str) => {
    //console.log(`-------------- CALLING DELETE --------------`);
    if (checkMainKeys(str)) return;
    if (title === "subCategories") {
      //console.log(`Clearing it from subCat`);
      setSubCategories((prev) => {
        const copy = prev.filter((obj) => obj.subCategory !== str);
        const oldIndex = getIndexByKey(prev, "subCategory", str);
        const unknownIndex = getIndexByKey(copy, "subCategory", "Unknown");
        prev[oldIndex].descriptions.forEach((e) => {
          copy[unknownIndex].descriptions.add(e);
        });
        return copy;
      });

      setCategories((prev) => {
        const copy = structuredClone(prev);
        const catIndex = copy.findIndex((obj) => obj.subCategory.has(str));
        if (catIndex !== -1) {
          copy[catIndex].subCategory.delete(str);
        }
        return copy;
      });
      setSelected("Unknown");
      setEditText("");
      setHeldStr("");
    } else {
      // console.log(`Clear it from categories: ${str}`);
      setCategories((prev) => {
        const copy = prev.filter((obj) => obj.category !== str);
        // console.log(`Attempting to get index of str being deleted`);
        const oldIndex = prev.findIndex((obj) => obj.category === str);
        // console.log(`Index was found for ${str} of ${oldIndex}`);
        // console.log(`Now attempting to get index for "Other" category`);
        const otherIndex = getIndexByKey(copy, "category", "Other");
        // console.log(`Other index passed back was ${otherIndex}`);
        prev[oldIndex].subCategory.forEach((e) => {
          copy[otherIndex].subCategory.add(e);
        });
        return copy;
      });
      setSelected("Other");
      setEditText("");
      setHeldStr("");
    }
  };

  const handleRightClick = (e, str, index) => {
    e.preventDefault();
    if (checkMainKeys(str)) return;
    setEditing(true);
    setEditText(str);
    setHeldStr(str);
    setEditingIndex(index);
  };

  //Add from left side strings to right subcategory
  const moveFromUnknown = (newSubCat) => {
    setSubCategories((prev) => {
      const copy = structuredClone(prev);
      const unknownIndex = getIndexByKey(copy, "subCategory", selected);
      copy[unknownIndex].descriptions.delete(heldStr);
      const newSubCatIndex = getIndexByKey(copy, "subCategory", newSubCat);
      copy[newSubCatIndex].descriptions.add(heldStr);
      return copy;
    });
    setHeldStr("");
  };

  //Add from left side Subcategory to right categories
  const moveToCat = (newCat) => {
    //console.log(`Calling move to cat with str: ${heldStr}`)
    if (heldStr === "Unknown" || heldStr === "Ignore") {
      setHeldStr("");
      return;
    }
    setCategories((prev) => {
      const copy = structuredClone(prev);
      const otherIndex = getIndexByKey(copy, "category", selected);
      const newCatIndex = getIndexByKey(copy, "category", newCat);
      copy[otherIndex].subCategory.delete(heldStr);
      copy[newCatIndex].subCategory.add(heldStr);
      return copy;
    });
    setHeldStr("");
  };

  //Gets string from settings prop passed in to get badge size for left data
  const getSize = () => {
    let size;
    switch (settings.Size) {
      case "Large":
        size = 20;
        break;
      case "Medium":
        size = 15;
        break;
      default:
        size = 10;
        break;
    }
    return size;
  };

  //Gets string from settings prop passed in for spacing between right and left data
  const getSpacing = () => {
    let space;
    switch (settings.Spacing) {
      case "Left":
        space = 3;
        break;
      case "Right":
        space = 9;
        break;
      default:
        space = 6;
        break;
    }
    return space;
  };

  return (
    <div className="w-100 h-100">
      <Container fluid className="h-100">
        <Row className="h-100">
          {/*Left Data*/}
          <Col>
            <Card className="leftBox my-2">
              <Card.Header>
                {title === "subCategories"
                  ? `Subcategory: ${selected}`
                  : `Category: ${selected}`}
              </Card.Header>
              <Card.Body className="overflow-auto">
                {leftData?.length > 0 &&
                  leftData?.map((str, index) => (
                    <Badge
                      key={index}
                      className="m-1"
                      style={{
                        cursor: "default",
                        userSelect: "none",
                        fontSize: `${getSize()}px`,
                      }}
                      draggable="true"
                      onDragStart={() => handleDragStart(str)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={handleDragEnd}
                    >
                      {str}
                    </Badge>
                  ))}
              </Card.Body>
            </Card>
          </Col>
          {/*Right Data */}
          <Col xs={getSpacing()}>
            <div className="d-flex flex-wrap gap-3 my-2 align-items-stretch">
              {rightData?.length > 0 &&
                rightData.map((str, index) => (
                  <Card
                    key={index}
                    className={`d-flex flex-column rightBox ${
                      hovering && dragging && editingIndex === index
                        ? "shadow"
                        : ""
                    }`}
                    onClick={() => setSelected(str)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDrop={() => handleDrop(str)}
                    onMouseOver={() => handleHover(index)}
                    onMouseOut={handleMouseOut}
                    onContextMenu={(e) => handleRightClick(e, str, index)}
                  >
                    {hovering && !dragging && hoverIndex === index && (
                      <Card.Header className="m-0 p-0 d-flex justify-content-end">
                        <MdDeleteForever
                          onClick={() => handleDelete(str)}
                          size={20}
                        />
                      </Card.Header>
                    )}
                    <Card.Body className="d-flex justify-content-center align-items-center text-center">
                      {editing && editingIndex === index ? (
                        <input
                          id="EditInputText"
                          type="text"
                          className="h-25 w-75"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.target.blur();
                          }}
                          onBlur={handleEditBlur}
                          autoFocus
                        />
                      ) : (
                        <h5 className="mb-0">{str}</h5>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              {/*Add new Category or subCategory card*/}
              <Card
                style={{ minHeight: "150px", minWidth: "150px" }}
                className="d-flex flex-column"
                onClick={() => setAdding(true)}
              >
                <Card.Body className="d-flex justify-content-center align-items-center">
                  {adding ? (
                    <input
                      id="AddInputText"
                      className="h-25 w-75"
                      autoFocus
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.target.blur();
                      }}
                      onBlur={handleAddBlur}
                    />
                  ) : (
                    <h1 className="mb-0">+</h1>
                  )}
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
  settings: PropTypes.object,
};

export default ModalGrid;
