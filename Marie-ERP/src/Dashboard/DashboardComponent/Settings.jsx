import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Accordion,
  Row,
  Col,
  Modal,
  Card,
  Form,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import "./Settings.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import DefaultButton from "./ProcessBuilder/child/defaultButton/DefaultButton";
import SelectedItems from "./ProcessBuilder/child/selectedItems/SelectedItems";
import { toast } from "react-toastify";

const Settings = () => {
  const { user } = useContext(UserContext);
  const [initialData, setInitialData] = useState([]);
  const [fetchData, setFetchData] = useState({});
  const [newCategory, setNewCategory] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [prosSelectedItems, setProsSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);

  const [showModals, setShowModals] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateItem, setShowCreateItem] = useState(false);

  const [modalData, setModalData] = useState({
    category: "",
    selectedItems: [],
  });

  // add items start
  const [categoryName, setCategoryName] = useState("");
  const [subItemName, setSubItemName] = useState("");
  const [subItems, setSubItems] = useState([]);

  const [show, setShow] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");

  // console.log("selectedItems : ", selectedItems);
  // console.log("selectedItems 2 :", prosSelectedItems);

  const getData = async () => {
    await axios
      .post("/Marie-ERP/api/processBuilder/init", {
        userId: user.userId ? user.userId : 7,
        // userId: 111,
        month: "January",
        year: "2024",
      })
      .then((response) => {
        // console.log("init Data : ", response.data.data);
        setInitialData(response.data.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getData();
  }, []);

  // initial data

  const fetchProcessbuilder = async () => {
    await axios
      .post("/Marie-ERP/api/processBuilder/fetch", {
        userId: user.userId ? user.userId : 3,
        // userId: 111,
      })
      .then((response) => {
        // console.log("response :", response.data.data.processBuilder);
        // console.log("response :", response.data.data.processBuilder === false);
        const processBuilderData =
          response?.data?.data?.processBuilder?.data?.data;

        if (processBuilderData) {
          setFetchData(response.data.data);

          const prosValues = processBuilderData.prosValues;

          if (prosValues) {
            setProsSelectedItems((prev) => ({ ...prev, ...prosValues }));
          }
          setLoading(false);
        } else {
          console.error("Data structure is not as expected:", response);
          setLoading(false);
        }
      })
      .catch((error) => console.error(error));
  };

  // console.log(fetchData);

  useEffect(() => {
    fetchProcessbuilder();
  }, []);

  const handleShowModal = (item, category) => {
    setModalData({
      category,
      selectedItems: prosSelectedItems[category] || [],
    });
    setShowModals((prevShowModals) => ({
      ...prevShowModals,
      [item]: true,
    }));
  };

  const handleCloseModal = (item) => {
    setShowModals((prevShowModals) => ({
      ...prevShowModals,
      [item]: false,
    }));
  };

  const handleShow = (category) => {
    setCurrentCategory(category);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentCategory("");
    if (modalData.category) {
      setProsSelectedItems((prev) => ({
        ...prev,
        [modalData.category]: modalData.selectedItems,
      }));
    }
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
      setInitialData((prevProcessBuilder) => {
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
      setInitialData((prevProcessBuilder) => {
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
  // future code end

  // add items end

  ////////////////////////////////////////////////////
  // function mergeData(selectedData, mainData) {
  //   if (selectedData) {
  //     Object.keys(selectedData).forEach((key) => {
  //       console.log("keys :", key)
  //       Object.keys(selectedData[key]).forEach((value) => {
  //         console.log("value :", value)
  //         if (mainData.hasOwnProperty(value)) {
  //           if (Array.isArray(mainData[value])) {
  //             mainData[value] = [
  //               ...new Set([...mainData[value], ...selectedData[key][value]]),
  //             ];
  //           } else {
  //             mainData[value] = selectedData[key][value];
  //           }
  //         } else {
  //           // If the key doesn't exist in mainData, add it
  //           mainData[value] = selectedData[key][value];
  //         }
  //       });
  //     });

  //     // Set the updated mainData
  //     setNewCategory({ ...mainData });
  //   } else {
  //     console.error("selectedData is null or undefined");
  //   }
  // }

  function mergeData(selectedData, mainData) {
    if (selectedData) {
      // Object.keys(selectedData).forEach((key) => {
      // console.log("keys :", key);
      Object.keys(selectedData).forEach((value) => {
        // console.log("value :", value);
        if (mainData.hasOwnProperty(value)) {
          if (Array.isArray(mainData[value])) {
            mainData[value] = [
              ...new Set([...mainData[value], ...selectedData[value]]),
            ];
          } else {
            mainData[value] = selectedData[value];
          }
        } else {
          // If the key doesn't exist in mainData, add it
          mainData[value] = selectedData[value];
        }
      });
      // });

      // Set the updated mainData
      setNewCategory({ ...mainData });
    } else {
      console.error("selectedData is null or undefined");
    }
  }
  // Object.keys(newCategory).forEach((key) => {
  //   console.log("map : ",key);
  // });
  // console.log("newCategory : ", newCategory)
  // Merge the data

  useEffect(() => {
    mergeData(
      fetchData?.processBuilder?.data?.data?.newCategories ?? {},
      initialData?.categories ?? {}
    );
  }, [fetchData, initialData]);

  // console.log("fetch data : ", fetchData);

  // console.log("newCategories, ", newCategory);

  ///////////////////////////////////////////////////
  const [filteredObject, setFilteredObject] = useState({});

  const handleSelect = (item, category, data) => {
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

  // selected categories

  useEffect(() => {
    const newFilteredObject = {};
    for (let key in prosSelectedItems) {
      if (prosSelectedItems.hasOwnProperty(key)) {
        const categoryObject = prosSelectedItems[key];
        for (let category in categoryObject) {
          if (categoryObject.hasOwnProperty(category)) {
            if (newFilteredObject.hasOwnProperty(category)) {
              let set = new Set([
                ...newFilteredObject[category],
                ...categoryObject[category],
              ]);
              newFilteredObject[category] = Array.from(set);
            } else {
              newFilteredObject[category] = categoryObject[category];
            }
          }
        }
      }
    }
    setFilteredObject(newFilteredObject);
  }, [prosSelectedItems]);

  // console.log("filteredObject :", filteredObject);

  // selected categories

  // search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  let filteredCategories;
  if (newCategory) {
    filteredCategories = Object.keys(newCategory).filter((category) =>
      category.toLowerCase().includes(searchTerm)
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

  const handleSave = async (item) => {
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

    // console.log("filteredCategories :", filteredCategories);
    const resultData = {
      data: {
        data: {
          activity: initialData.activities,
          values: selectedItems,
          prosValues: prosSelectedItems,
          categories: filteredObject,
          default: initialData.default,
          newCategories: newCategory,
          subCatPross: subCatPross,
        },
      },
    };
    // console.log("resultData :", resultData);
    // console.log("prosSelectedItems :", prosSelectedItems);
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
          // console.log("response : ", response);
          toast.success("Process builder created successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
          // setTimeout(() => {
          //   navigate("/dashboard/home");
          // }, 2300);
        }
      })
      .then(() => handleCloseModal(item))
      .catch((error) => console.error(error));
  };

  // search
  let str;
  let formatedString;

  // console.log("fetchdata", fetchData);
  // console.log("prosSelectedItems :", prosSelectedItems);

  const style = {
    display: showCreateItem ? "block" : "none",
    margin: "5px",
    width: "90%",
  };

  return (
    <>
      <Container fluid className="backgrounddd">
        <main>
          <div className="d-flex justify-content-between mx-3 pt-2">
            <h1 className=" " style={{ color: "#fca311" }}>
              ProcessBuilder
            </h1>
            {fetchData &&
            fetchData.processBuilder &&
            fetchData.processBuilder.data &&
            fetchData.processBuilder.data.data &&
            fetchData.processBuilder.data.data.prosValues ? (
              ""
            ) : (
              <Link to="/dashboard/processbuilder">
                <button className="btn btn-warning">
                  Create ProcessBuilder
                </button>
              </Link>
            )}
          </div>
          <div className="">
            <h4 className="mx-3 pt-2">An overview of your F&B supply chain.</h4>
            {/* <p>
              <button
                className="btn mx-2 mt-2"
                style={{ color: "blue" }}
                onClick={() => setShowSettings(!showSettings)}>
                View complete network
              </button>
            </p> */}
          </div>
        </main>
        {/* {showSettings && ( */}
        {loading ? (
          <>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh", flexDirection: "column" }}>
              <div>Data is loading...</div>
              <div>
                <Spinner animation="border" variant="primary" />
              </div>
            </div>
          </>
        ) : fetchData?.processBuilder?.data?.data?.prosValues ? (
          <section>
            <div className="">
              <div className="mx-3 mt-5 mb-5">
                {/* {console.log(fetchData)} */}
                {fetchData !== null && fetchData !== undefined ? (
                  <Accordion defaultActiveKey="0">
                    {/* {Object.keys(
                      fetchData?.processBuilder?.data?.data?.values */}
                    {initialData.activities &&
                      initialData.activities.map((item, i) => {
                        // console.log("item : ", item);
                        {
                          str = item.slice(item.indexOf(" "));
                        }
                        {
                          formatedString = str.replace(/^\s+/, "");
                        }
                        {
                          formatedString =
                            formatedString
                              .toLowerCase()
                              .charAt(0)
                              .toUpperCase() +
                            formatedString.slice(1).toLowerCase();
                        }
                        return (
                          <Accordion.Item key={item} eventKey={item}>
                            <Accordion.Header>
                              <span style={{ width: "25px" }}>
                                {item.slice(0, item.lastIndexOf("."))}{" "}
                              </span>

                              <span className="mx-5">{formatedString}</span>
                            </Accordion.Header>
                            <Accordion.Body className="">
                              {/* description */}
                              <p style={{ fontSize: "13px" }}>
                                {fetchData.description &&
                                  Object.keys(fetchData.description).map(
                                    (code, i) => {
                                      if (
                                        code ===
                                        item.slice(0, item.lastIndexOf("."))
                                      ) {
                                        return fetchData.description[code];
                                      }
                                    }
                                  )}
                              </p>
                              {/* description */}
                              <p>
                                <a style={{ fontSize: "13px" }} href="#">
                                  View the expense pool.
                                </a>
                              </p>
                              <p className="" style={{ fontSize: "11px" }}>
                                RESOURCES
                              </p>
                              <div className="d-flex gap-4 flex-wrap justify-content-center justify-content-sm-start">
                                {fetchData?.processBuilder?.data?.data
                                  ?.default &&
                                  Object.keys(
                                    fetchData.processBuilder.data.data.default
                                  ).map((code, i) => {
                                    if (
                                      code ===
                                      item.slice(0, item.lastIndexOf("."))
                                    ) {
                                      return fetchData.processBuilder.data.data.default[
                                        code
                                      ].map((e) =>
                                        e ? (
                                          <DefaultButton key={e} value={e} />
                                        ) : null
                                      );
                                    }
                                    return null;
                                  })}
                                {prosSelectedItems &&
                                  Object.keys(prosSelectedItems).map((e, i) => {
                                    return Object.keys(
                                      prosSelectedItems[e]
                                    ).map((ee) => {
                                      return prosSelectedItems[e][ee].map(
                                        (eee) => {
                                          if (
                                            item.slice(
                                              0,
                                              item.lastIndexOf(".")
                                            ) === e.slice(0, e.lastIndexOf("."))
                                          ) {
                                            return (
                                              <SelectedItems
                                                key={eee}
                                                categories={ee}
                                                type={eee}
                                              />
                                            );
                                          }
                                        }
                                      );
                                    });
                                  })}
                              </div>
                              <Row key={item}>
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
                                    onClick={() => handleShowModal(item)}>
                                    +
                                  </button>
                                  <Modal
                                    size="lg"
                                    backdrop="static"
                                    keyboard={false}
                                    style={{ borderRadius: "0" }}
                                    scrollable
                                    show={showModals[item] || false}
                                    onHide={() => handleCloseModal(item)}>
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
                                        <div>
                                          <button
                                            style={{
                                              height: "35px",
                                              background: "transparent",
                                              borderRadius: "10px",
                                              padding: "0",
                                              border: "2px solid #002060",
                                            }}
                                            className="px-3 me-1 me-lg-5 "
                                            onClick={() => handleSave(item)}>
                                            Save
                                          </button>
                                          <button
                                            style={{
                                              height: "35px",
                                              background: "transparent",
                                              borderRadius: "10px",
                                              padding: "0",
                                              border: "2px solid #002060",
                                            }}
                                            className="px-3 me-2 me-lg-5 "
                                            onClick={() =>
                                              setShowCreateItem(!showCreateItem)
                                            }>
                                            {showCreateItem == true
                                              ? "Add Category"
                                              : "Add Category"}
                                          </button>
                                        </div>
                                      </div>
                                    </Modal.Header>
                                    <Modal.Body style={{ padding: "0" }}>
                                      <div className="d-flex justify-content-center mt-3 mb-3">
                                        <Card
                                          style={{
                                            ...style,
                                            background: "#dad5d5",
                                          }}>
                                          <Card.Body>
                                            <Form>
                                              <Form.Group
                                                className="mb-3"
                                                controlId="formBasicEmail">
                                                <Form.Label>
                                                  Category Name
                                                </Form.Label>
                                                <Form.Control
                                                  style={{
                                                    height: "38px",
                                                  }}
                                                  className="p-0 px-3"
                                                  type="text"
                                                  placeholder="Enter category Name..."
                                                  value={categoryName}
                                                  onChange={(e) =>
                                                    setCategoryName(
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              </Form.Group>

                                              <Form.Group
                                                className="mb-3"
                                                controlId="formBasicCheckbox">
                                                <Form.Label>
                                                  Resources
                                                </Form.Label>
                                                <Form.Control
                                                  style={{
                                                    height: "38px",
                                                  }}
                                                  className="p-0 px-3"
                                                  type="text"
                                                  placeholder="Enter Resources Name..."
                                                  value={subItemName}
                                                  onChange={(e) =>
                                                    setSubItemName(
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                <Button
                                                  variant="primary"
                                                  onClick={handleAddSubItem}
                                                  style={{
                                                    marginTop: "13px",
                                                  }}>
                                                  Add Resource
                                                </Button>
                                                <ul
                                                  className="d-flex flex-wrap mt-2"
                                                  style={{
                                                    listStyle: "none",
                                                  }}>
                                                  {subItems.map(
                                                    (subItem, index) => (
                                                      <li
                                                        style={{
                                                          margin:
                                                            " 5px 10px 5px 5px ",
                                                          fontSize: "15px",
                                                        }}
                                                        key={index}>
                                                        <a
                                                          style={{
                                                            border:
                                                              "1px solid grey",
                                                            borderRadius: "5px",
                                                            padding:
                                                              "2px 10px 2px 10px",
                                                          }}>
                                                          {subItem}
                                                        </a>
                                                      </li>
                                                    )
                                                  )}
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
                                      {newCategory ? (
                                        <>
                                          <Table
                                            striped
                                            bordered
                                            hover
                                            className="mt-0">
                                            <tbody>
                                              {filteredCategories.map(
                                                (category, index) => (
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
                                                          onClick={() =>
                                                            handleShow(category)
                                                          }>
                                                          +
                                                        </Button>

                                                        {currentCategory ===
                                                          category && (
                                                          <Modal
                                                            show={show}
                                                            onHide={
                                                              handleClose
                                                            }>
                                                            <Modal.Header
                                                              closeButton>
                                                              <Modal.Title>
                                                                {category}
                                                              </Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                              <Form>
                                                                <Form.Group
                                                                  className="mb-3"
                                                                  controlId="formBasicCheckbox">
                                                                  <Form.Label>
                                                                    Add
                                                                    Resources
                                                                  </Form.Label>
                                                                  <Form.Control
                                                                    type="text"
                                                                    placeholder="Add item Resources..."
                                                                    value={
                                                                      subItemName
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      setSubItemName(
                                                                        e.target
                                                                          .value
                                                                      )
                                                                    }
                                                                  />
                                                                  <Button
                                                                    variant="primary"
                                                                    onClick={
                                                                      handleAddSubItem
                                                                    }
                                                                    style={{
                                                                      marginTop:
                                                                        "10px",
                                                                    }}>
                                                                    Add
                                                                    Resources
                                                                  </Button>
                                                                  <ul>
                                                                    {subItems.map(
                                                                      (
                                                                        subItem,
                                                                        index
                                                                      ) => (
                                                                        <li
                                                                          key={
                                                                            index
                                                                          }>
                                                                          {
                                                                            subItem
                                                                          }
                                                                        </li>
                                                                      )
                                                                    )}
                                                                  </ul>
                                                                </Form.Group>

                                                                <Button
                                                                  onClick={(
                                                                    e
                                                                  ) =>
                                                                    handleAdd(
                                                                      e,
                                                                      category
                                                                    )
                                                                  }
                                                                  variant="primary"
                                                                  style={{
                                                                    background:
                                                                      "#002060",
                                                                    borderRadius:
                                                                      "0",
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
                                                        {newCategory[
                                                          category
                                                        ].map(
                                                          (data, i, array) => (
                                                            <div
                                                              key={data}
                                                              className="ms-2 d-flex"
                                                              style={{
                                                                flexDirection:
                                                                  "row",
                                                              }}>
                                                              <input
                                                                onChange={() => {
                                                                  handleSelect(
                                                                    item,
                                                                    category,
                                                                    data
                                                                  );
                                                                }}
                                                                id={data}
                                                                type="checkbox"
                                                                checked={
                                                                  prosSelectedItems &&
                                                                  prosSelectedItems[
                                                                    item
                                                                  ] &&
                                                                  prosSelectedItems[
                                                                    item
                                                                  ][category] &&
                                                                  prosSelectedItems[
                                                                    item
                                                                  ][
                                                                    category
                                                                  ].includes(
                                                                    data
                                                                  )
                                                                    ? true
                                                                    : false
                                                                }
                                                              />
                                                              <label
                                                                className="ms-1"
                                                                style={{
                                                                  fontSize:
                                                                    "12px",
                                                                  textWrap:
                                                                    "nowrap",
                                                                  paddingTop:
                                                                    "4px",
                                                                }}>
                                                                {data}
                                                              </label>
                                                              {i ===
                                                              array.length - 1
                                                                ? ""
                                                                : ","}
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </Table>
                                        </>
                                      ) : (
                                        <h3>data not exist</h3>
                                      )}
                                      <Modal.Footer>
                                        {/* <div className="mt-3 text-end mx-3">
                                        <button
                                          className="btn btn-primary"
                                          onClick={handleSave}>
                                          Save
                                        </button>
                                      </div> */}
                                      </Modal.Footer>
                                    </Modal.Body>
                                  </Modal>
                                  {/* Modal end */}
                                  {/* next button and save button */}
                                  {/* <div className="d-flex gap-5">
                                  <a
                                    style={{
                                      fontSize: "30px",
                                      cursor: "pointer",
                                    }}
                                    // onClick={handlePrevPage}
                                  >
                                    <i className="fa-solid fa-arrow-left"></i>
                                  </a> */}
                                  {/* {currentPage === totalPages ? (
                                    <a
                                      style={{
                                        fontSize: "30px",
                                        cursor: "pointer",
                                      }}
                                      onClick={handleSave}>
                                      <i className="fa-regular fa-floppy-disk"></i>
                                    </a>
                                  ) : (
                                    <a
                                      style={{
                                        fontSize: "30px",
                                        cursor: "pointer",
                                      }}
                                      // onClick={handleNextPage}
                                      >
                                      <i
                                        style={{}}
                                        className="fa-solid fa-arrow-right"></i>
                                    </a>
                                  )} */}
                                  {/* </div> */}
                                </Col>
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                  </Accordion>
                ) : (
                  <div>
                    <p>Please create process builder</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
              color: "blue",
            }}>
            ProcessBuilder is empty please create ProcessBuilder
          </div>
        )}
        {/* // )} */}
        {/* <SettEditTest /> */}
      </Container>
    </>
  );
};

export default Settings;
