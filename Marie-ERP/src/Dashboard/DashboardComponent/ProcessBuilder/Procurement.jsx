import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import ChildTable from "./child/table/ChildTable";
import SelectedItems from "./child/selectedItems/SelectedItems";
import DefaultButton from "./child/defaultButton/DefaultButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../Context/UserContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function Procurement({ processbuilder, setProcessbuilder }) {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [prosSelectedItems, setProsSelectedItems] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);
  const [showCreateItem, setShowCreateItem] = useState(false);

  // add items start
  const [categoryName, setCategoryName] = useState("");
  const [subItemName, setSubItemName] = useState("");
  const [subItems, setSubItems] = useState([]);

  const [show, setShow] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");

  const handleShow = (category) => {
    setCurrentCategory(category);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentCategory("");
  };

  const handleAddSubItem = () => {
    if (subItemName.trim() !== "") {
      setSubItems([...subItems, subItemName]);
      setSubItemName("");
    }
  };

  const handleAdd = (e, category) => {
    e.preventDefault();
    if (category.trim() !== "" && subItems.length > 0) {
      setProcessbuilder((prevProcessBuilder) => {
        const updatedCategories = { ...prevProcessBuilder.categories };

        if (updatedCategories[category]) {
          updatedCategories[category] = [
            ...updatedCategories[category],
            ...subItems,
          ];
        } else {
          updatedCategories[category] = subItems;
        }
        return {
          ...prevProcessBuilder,
          categories: updatedCategories,
        };
      });
      setSubItemName("");
      setSubItems([]);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    if (categoryName.trim() !== "" && subItems.length > 0) {
      setProcessbuilder((prevProcessBuilder) => {
        const updatedCategories = { ...prevProcessBuilder.categories };
        if (updatedCategories[categoryName]) {
          updatedCategories[categoryName] = [
            ...updatedCategories[categoryName],
            ...subItems,
          ];
        } else {
          updatedCategories[categoryName] = subItems;
        }
        return {
          ...prevProcessBuilder,
          categories: updatedCategories,
        };
      });

      setCategoryName("");
      setSubItemName("");
      setSubItems([]);
    }
  };

  // future code
  const removeItem = (category, itemToRemove) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete ${itemToRemove} from ${category}?`
    );

    if (userConfirmed) {
      setProcessbuilder((prevProcessBuilder) => {
        const updatedCategories = { ...prevProcessBuilder.categories };

        // Check if the category exists
        if (updatedCategories[category]) {
          // Filter out the item to be removed
          updatedCategories[category] = updatedCategories[category].filter(
            (item) => item !== itemToRemove
          );

          // If the category has no items left, remove the category
          if (updatedCategories[category].length === 0) {
            delete updatedCategories[category];
          }

          return {
            ...prevProcessBuilder,
            categories: updatedCategories,
          };
        }

        return prevProcessBuilder;
      });
    } else {
      console.log("User canceled deletion.");
    }
  };
  // future code
  // add items end

  // pagination start
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let currentItems;
  let totalPages;

  const filteredItem = processbuilder.activities.filter(
    (data) => data !== null
  );
  currentItems = filteredItem.slice(indexOfFirstItem, indexOfLastItem);
  totalPages = Math.ceil(filteredItem.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // pagination end

  const [categorySelect, setCategorySelect] = useState([]);

  const handleSelect = (item, category, data) => {
    setCategorySelect((prevData) => {
      if (prevData[category]) {
        if (!prevData[category].includes(data)) {
          return { ...prevData, [category]: [...prevData[category], data] };
        } else {
          return prevData;
        }
      } else {
        return { ...prevData, [category]: [data] };
      }
    });

    const newEntry = `${category} - ${data}`;
    setSelectedItems((prevData) => {
      const itemEntries = prevData[`${item}`] || [];
      const entryIndex = itemEntries.indexOf(newEntry);

      if (entryIndex !== -1) {
        itemEntries.splice(entryIndex, 1);
      } else {
        itemEntries.push(newEntry);
      }
      return {
        ...prevData,
        [`${item}`]: itemEntries,
      };
    });

    setProsSelectedItems((prev) => {
      const newProsSelectedItems = { ...prev };
      if (newProsSelectedItems.hasOwnProperty(item)) {
        if (newProsSelectedItems[item].hasOwnProperty(category)) {
          const dataIndex = newProsSelectedItems[item][category].indexOf(data);
          if (dataIndex !== -1) {
            newProsSelectedItems[item][category] = [
              ...newProsSelectedItems[item][category].slice(0, dataIndex),
              ...newProsSelectedItems[item][category].slice(dataIndex + 1),
            ];
            if (newProsSelectedItems[item][category].length === 0) {
              delete newProsSelectedItems[item][category];
              if (Object.keys(newProsSelectedItems[item]).length === 0) {
                delete newProsSelectedItems[item];
              }
            }
          } else {
            newProsSelectedItems[item][category] = [
              ...newProsSelectedItems[item][category],
              data,
            ];
          }
        } else {
          newProsSelectedItems[item][category] = [data];
        }
      } else {
        newProsSelectedItems[item] = {
          [category]: [data],
        };
      }

      return newProsSelectedItems;
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  let filteredCategories;
  if (processbuilder.categories) {
    filteredCategories = Object.keys(processbuilder.categories).filter(
      (category) => category.toLowerCase().includes(searchTerm)
    );
  }

  // filtered selected processbuilder by subCategory

  const [subCatPross, setSubCatPross] = useState({});
  const updateUtilities = () => {
    let newObject = {}; // Initialize the newObject outside the loops

    Object.keys(prosSelectedItems).forEach((processbuilder) => {
      Object.keys(prosSelectedItems[processbuilder]).forEach((categories) => {
        prosSelectedItems[processbuilder][categories].forEach((value) => {
          // Update the newObject inside the loops
          newObject = {
            ...newObject,
            [categories]: {
              ...(newObject[categories] || {}), // Preserve existing data
              [value]: [
                ...(newObject[categories]?.[value] || []),
                processbuilder,
              ],
            },
          };
        });
      });
    });
    setSubCatPross(newObject);
  };

  useEffect(() => {
    updateUtilities();
  }, [prosSelectedItems]);

  // console.log(subCatPross);
  // filtered selected processbuilder by subCategory

  const handleSave = async () => {
    // month and year
    const currentDate = new Date();
    const monthNames = [
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
    const currentYear = currentDate.getFullYear();
    const currentMonthName = monthNames[currentDate.getMonth()];
    // month and year

    console.log("filteredCategories :", filteredCategories);
    const resultData = {
      data: {
        data: {
          activity: processbuilder.activities,
          values: selectedItems,
          prosValues: prosSelectedItems,
          categories: categorySelect,
          default: processbuilder.default,
          subCatPross: subCatPross,
        },
      },
    };

    await axios
      .post("/Marie-ERP/api/processBuilder/save", {
        userId: user.userId ? user.userId : 7,
        // userId: 23,
        month: currentMonthName,
        year: currentYear,
        data: resultData,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("response : ", response);
          toast.success("Process builder created successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
          setTimeout(() => {
            navigate("/dashboard/home");
          }, 2300);
        }
      })
      .catch((error) => console.error(error));
  };
  // console.log("processbuilder", processbuilder);
  let str;
  let formatedString;

  const style = {
    display: showCreateItem ? "block" : "none",
    margin: "5px",
    width: "90%",
  };

  return (
    <>
      <ToastContainer />
      {currentItems.map((item, i) => (
        <Container
          key={i}
          className="d-flex justify-content-around"
          style={{ minHeight: "80vh", flexDirection: "column" }}>
          {/* Activity code and name table */}

          <Row>
            <div style={{ display: "none" }}>
              {(str = item.slice(item.indexOf(" ")))}
              {(formatedString = str.replace(/^\s+/, ""))}
              {
                (formatedString =
                  formatedString.toLowerCase().charAt(0).toUpperCase() +
                  formatedString.slice(1).toLowerCase())
              }
            </div>

            <ChildTable
              activityCode={item.slice(0, item.lastIndexOf("."))}
              name={formatedString}
            />
            <Row className="mt-3">
              <Col xs={12} md={3} lg={2}>
                <h6>Description </h6>
              </Col>
              <Col xs={12} md={9} lg={10}>
                <p className="ps-3 ps-sm-3">
                  {processbuilder.description &&
                    Object.keys(processbuilder.description).map((code, i) => {
                      if (code === item.slice(0, item.lastIndexOf("."))) {
                        return processbuilder.description[code];
                      }
                    })}
                </p>
              </Col>
            </Row>
          </Row>
          <Row className="mt-5">
            <h5>RESOURCES</h5>
            <div className="d-flex gap-4 flex-wrap justify-content-center justify-content-sm-start">
              {processbuilder.default &&
                Object.keys(processbuilder.default).map((code, i) => {
                  // console.log(item, ": item :");
                  if (code === item.slice(0, item.lastIndexOf("."))) {
                    return processbuilder.default[code].map((e) =>
                      e ? <DefaultButton key={e} value={e} /> : null
                    );
                  }
                  return null;
                })}

              {selectedItems[`${item}`]
                ? selectedItems[`${item}`].map((e, i) => {
                    // console.log("selected items : ", e)
                    return (
                      <>
                        <SelectedItems
                          key={i}
                          categories={e.slice(0, e.lastIndexOf("-"))}
                          type={e.slice(e.lastIndexOf("-") + 1)}
                        />
                      </>
                    );
                  })
                : ""}
            </div>
          </Row>
          <Row>
            <Col className="d-flex justify-content-between mt-5">
              {/* Modal start */}
              <button
                style={{
                  width: "35px",
                  height: "35px",
                  background: "transparent",
                  borderRadius: "10px",
                  padding: "0",
                  border: "2px solid #002060",
                }}
                className=""
                onClick={() => setShowModal(!showModal)}>
                +
              </button>
              <Modal
                size="lg"
                backdrop="static"
                keyboard={false}
                style={{ borderRadius: "0" }}
                scrollable
                show={showModal}
                onHide={() => setShowModal(!showModal)}>
                <Modal.Header closeButton>
                  <div
                    className="d-flex justify-content-between"
                    style={{ width: "100%" }}>
                    <Modal.Title>
                      <input
                        style={{ height: "40px" }}
                        onChange={handleSearch}
                        className="form-control me-2"
                        type="search"
                        placeholder="Search category ..."
                        aria-label="Search"
                      />
                    </Modal.Title>
                    <button
                      style={{
                        height: "35px",
                        background: "transparent",
                        borderRadius: "10px",
                        padding: "0",
                        border: "2px solid #002060",
                      }}
                      className="px-3 me-2 me-lg-5 "
                      onClick={() => setShowCreateItem(!showCreateItem)}>
                      {showCreateItem == true ? "Add Category" : "Add Category"}
                    </button>
                  </div>
                </Modal.Header>
                <Modal.Body style={{ padding: "0" }}>
                  <div className="d-flex justify-content-center mt-3 mb-3">
                    <Card style={{ ...style, background: "#dad5d5" }}>
                      <Card.Body>
                        <Form>
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicEmail">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                              style={{ height: "38px" }}
                              className="p-0 px-3"
                              type="text"
                              placeholder="Enter category Name..."
                              value={categoryName}
                              onChange={(e) => setCategoryName(e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group
                            className="mb-3"
                            controlId="formBasicCheckbox">
                            <Form.Label>Resources</Form.Label>
                            <Form.Control
                              style={{ height: "38px" }}
                              className="p-0 px-3"
                              type="text"
                              placeholder="Enter Resources Name..."
                              value={subItemName}
                              onChange={(e) => setSubItemName(e.target.value)}
                            />
                            <Button
                              variant="primary"
                              onClick={handleAddSubItem}
                              style={{ marginTop: "13px" }}>
                              Add Resource
                            </Button>
                            <ul
                              className="d-flex flex-wrap mt-2"
                              style={{ listStyle: "none" }}>
                              {subItems.map((subItem, index) => (
                                <li
                                  style={{
                                    margin: " 5px 10px 5px 5px ",
                                    fontSize: "15px",
                                  }}
                                  key={index}>
                                  <a
                                    style={{
                                      border: "1px solid grey",
                                      borderRadius: "5px",
                                      padding: "2px 10px 2px 10px",
                                    }}>
                                    {subItem}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </Form.Group>
                          
                          <button
                            onClick={handleAddItem}
                            className="px-4"
                            style={{
                              background: "#002060",
                              borderRadius: "5px",
                              color: "white",
                              fontSize: "15px",
                            }}>
                            Add category
                          </button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </div>
                  {/* Render categories and their items in a table structure */}
                  {processbuilder.categories ? (
                    <>
                      <Table striped bordered hover className="mt-0">
                        <tbody>
                          {filteredCategories.map((category, index) => (
                            <tr key={index}>
                              <td>
                                <p className="fw-bold mb-1 d-flex flex-wrap align-items-center gap-1">
                                  {category}
                                  {/* new */}
                                  <Button
                                    style={{
                                      padding: "0",
                                      width: "15px",
                                      height: "15px",
                                      fontSize: "8px",
                                      borderRadius: "50%",
                                      display: "block",
                                    }}
                                    variant="success"
                                    onClick={() => handleShow(category)}>
                                    +
                                  </Button>

                                  {currentCategory === category && (
                                    <Modal show={show} onHide={handleClose}>
                                      <Modal.Header closeButton>
                                        <Modal.Title>{category}</Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        <Form>
                                          <Form.Group
                                            className="mb-3"
                                            controlId="formBasicCheckbox">
                                            <Form.Label>
                                              Add Resources
                                            </Form.Label>
                                            <Form.Control
                                              type="text"
                                              placeholder="Add item Resources..."
                                              value={subItemName}
                                              onChange={(e) =>
                                                setSubItemName(e.target.value)
                                              }
                                            />
                                            <Button
                                              variant="primary"
                                              onClick={handleAddSubItem}
                                              style={{
                                                marginTop: "10px",
                                              }}>
                                              Add Resources
                                            </Button>
                                            <ul>
                                              {subItems.map(
                                                (subItem, index) => (
                                                  <li key={index}>{subItem}</li>
                                                )
                                              )}
                                            </ul>
                                          </Form.Group>

                                          <Button
                                            onClick={(e) =>
                                              handleAdd(e, category)
                                            }
                                            variant="primary"
                                            style={{
                                              background: "#002060",
                                              borderRadius: "0",
                                            }}>
                                            Add
                                          </Button>
                                        </Form>
                                      </Modal.Body>
                                    </Modal>
                                  )}
                                  {/* new */}
                                </p>
                                <div className="d-flex">
                                  {processbuilder.categories[category].map(
                                    (data, i, array) => (
                                      <div
                                        key={data}
                                        className="ms-2 d-flex"
                                        style={{ flexDirection: "row" }}>
                                        <input
                                          onClick={() => {
                                            handleSelect(item, category, data);
                                          }}
                                          id={data}
                                          type="checkbox"
                                          readOnly
                                          checked={
                                            selectedItems[`${item}`] &&
                                            selectedItems[`${item}`].includes(
                                              `${category} - ${data}`
                                            )
                                              ? true
                                              : false
                                          }
                                        />

                                        <label
                                          className="ms-1"
                                          style={{
                                            fontSize: "12px",
                                            textWrap: "nowrap",
                                            paddingTop: "4px",
                                          }}
                                          htmlFor={data}
                                          key={i}>
                                          {" "}
                                          {data}
                                        </label>
                                        {i === array.length - 1 ? "" : ","}
                                        {/* {","} */}
                                      </div>
                                    )
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </>
                  ) : (
                    <h3>data not exist</h3>
                  )}
                  <Modal.Footer>
                    <div className="mt-3 text-end mx-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(!showModal)}>
                        Done
                      </button>
                    </div>
                  </Modal.Footer>
                </Modal.Body>
              </Modal>
              {/* Modal end */}
              {/* next button and save button */}
              <div className="d-flex gap-5">
                <a
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  onClick={handlePrevPage}>
                  <i className="fa-solid fa-arrow-left"></i>
                </a>
                {currentPage === totalPages ? (
                  <a
                    style={{ fontSize: "30px", cursor: "pointer" }}
                    onClick={handleSave}>
                    <i className="fa-regular fa-floppy-disk"></i>
                  </a>
                ) : (
                  <a
                    style={{ fontSize: "30px", cursor: "pointer" }}
                    onClick={handleNextPage}>
                    <i style={{}} className="fa-solid fa-arrow-right"></i>
                  </a>
                )}
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col>
              <div>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous Page
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}>
                  Next Page
                </button>
              </div>
            </Col>
          </Row> */}
        </Container>
      ))}
    </>
  );
}
