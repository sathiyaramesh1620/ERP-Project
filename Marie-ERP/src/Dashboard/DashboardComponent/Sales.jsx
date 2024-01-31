import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Container, Nav, Form, Table, Button } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "./Header";
import "./Sales.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import SalesTable from "./SalesTable";
import Papa from "papaparse";

import { Modal } from "react-bootstrap";
import SalesFileImport from "./SalesFileImport";
import { UserContext } from "../../Context/UserContext";
import ReactPaginate from "react-paginate"; // Import react-paginate
import ContentLoader from "react-content-loader";
import Select from "react-bootstrap/FormSelect";
import Alert from "react-bootstrap/Alert";

const Sales = () => {
  const { user } = useContext(UserContext);
  function formatMonth(selectedMonth) {
    const [year, month] = selectedMonth.split("-");
    const date = new Date(year, month - 1, 1); // Subtract 1 from the month to match JavaScript's 0-based index
    const options = { month: "long" };
    return date.toLocaleDateString(undefined, options);
  }

  const [calleffect, setCallEffect] = useState(0);
  const [activeTab, setActiveTab] = useState("Channel Type");

  const [showSalesTable, setShowSalesTable] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAddMenuClick = () => {
    setShowSalesTable(true); // Show the SalesTable when the button is clicked
  };

  const handleEditModalClose = () => {
    setEditedItem(null);
    setShowEditModal(false);
  };

  const [salesMonth, setSalesMonth] = useState("");

  const [mergedData, setMergedData] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [salesByMenuData, setSalesByMenuData] = useState([]);

  const handleDataFromChild = (data) => {
    setTableData(data);
  };

  const currentMonth = new Date();
  const initialMonthValue = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(initialMonthValue);

  const [sumTotal, setSumTotal] = useState({
    food: "",
    beverages: "",
  });

  const [header, setHeader] = useState([]);
  const [cols, setCols] = useState([]);

  const handleFile = (event) => {
    const file = event.target.files[0];
    ExcelRenderer(file, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        setHeader(response.rows[0]);
        setCols(response.rows);
      }
    });
  };

  // State variables for channels
  const [channels, setChannels] = useState([
    {
      id: 1,
      name: "Dine-in",
      active: false,
      food: "",
      beverages: "",
    },
    {
      id: 2,
      name: "Delivery Platform Service",
      active: false,
      food: "",
      beverages: "",
    },
    {
      id: 3,
      name: "Online",
      active: false,
      food: "",
      beverages: "",
    },
    {
      id: 4,
      name: "Telephone",
      active: false,
      food: "",
      beverages: "",
    },
    {
      id: 5,
      name: "Takeaway",
      active: false,
      food: "",
      beverages: "",
    },
  ]);

  function saveStateToSessionStorage() {
    const stateToSave = {
      // Save the state variables you want to store
      selectedMonth,
      channels,
      salesMonth,
      tableData,
      sumTotal,
      // Add more state variables here
    };

    // Convert the state data to a JSON string
    const stateJSON = JSON.stringify(stateToSave);

    // Store the JSON string in session storage
    sessionStorage.setItem("salesState", stateJSON);
  }

  useEffect(() => {
    saveStateToSessionStorage();
  }, [selectedMonth, channels, salesMonth, tableData, sumTotal]);

  function loadStateFromSessionStorage() {
    const stateJSON = sessionStorage.getItem("salesState");
    if (stateJSON) {
      const stateFromSessionStorage = JSON.parse(stateJSON);

      // Update your state with the data from session storage
      setSelectedMonth(stateFromSessionStorage.selectedMonth);
      setChannels(stateFromSessionStorage.channels);
      setSalesMonth(stateFromSessionStorage.salesMonth);
      setTableData(stateFromSessionStorage.tableData);
      setSumTotal(stateFromSessionStorage.sumTotal);
      // Update more state variables as needed
    }
  }

  useEffect(() => {
    loadStateFromSessionStorage();
  }, []);

  // Function to toggle a channel's activity
  function toggleChannel(id) {
    const updatedChannels = [...channels];
    const index = updatedChannels.findIndex((channel) => channel.id === id);
    if (index !== -1) {
      updatedChannels[index].active = !updatedChannels[index].active;
      setChannels(updatedChannels);
    }
  }

  // Function to handle input changes for a channel
  function handleInputChange(id, field, value) {
    const updatedChannels = [...channels];
    const index = updatedChannels.findIndex((channel) => channel.id === id);
    if (index !== -1) {
      updatedChannels[index][field] = value;
      setChannels(updatedChannels);
    }
  }

  // Render buttons for channels
  const channelButtons = channels.map((channel) => (
    <Col xl={3} className="pt-4" key={channel.id}>
      <button
        onClick={() => toggleChannel(channel.id)}
        className={`btn button-groups btntoggle shadow-sm border-2 ${
          channel.active ? "active" : ""
        }`}>
        {channel.name}
      </button>
    </Col>
  ));

  // Render table headers and inputs based on active channels
  const tableHeaders = channels
    .filter((channel) => channel.active)
    .map((channel) => (
      <th
        key={channel.id}
        style={{
          backgroundColor: "#14213d",
          color: "white",
          width: "15px",
          textAlign: "center",
        }}>
        {channel.name}
      </th>
    ));

  const tableInputs = channels
    .filter((channel) => channel.active)
    .map((channel) => (
      <td key={channel.id}>
        {channel.active && (
          <input
            type="number"
            className="text-center border-0 bg-light"
            value={channel.food}
            onChange={(e) =>
              handleInputChange(channel.id, "food", e.target.value)
            }
          />
        )}
      </td>
    ));

  const tableInputs2 = channels
    .filter((channel) => channel.active)
    .map((channel) => (
      <td key={channel.id}>
        {channel.active && (
          <input
            type="number"
            className="text-center border-0 bg-light"
            value={channel.beverages}
            onChange={(e) =>
              handleInputChange(channel.id, "beverages", e.target.value)
            }
          />
        )}
      </td>
    ));

  const tableSum = channels
    .filter((channel) => channel.active)
    .map((channel, index) => {
      return (
        <td key={index} className="text-center text-muted ">
          {channel.active && (
            <span>
              {Number(channel.beverages) + Number(channel.food) === 0
                ? ""
                : Number(channel.beverages) + Number(channel.food)}
            </span>
          )}
        </td>
      );
    });

  useEffect(() => {
    const activeChannels = channels.filter((channel) => channel.active);

    const totalFood = activeChannels.reduce((acc, channel) => {
      return acc + (channel.food ? parseFloat(channel.food) : 0);
    }, 0);

    const totalBeverages = activeChannels.reduce((acc, channel) => {
      return acc + (channel.beverages ? parseFloat(channel.beverages) : 0);
    }, 0);

    setSumTotal({
      food: totalFood, // You can adjust the number of decimal places as needed
      beverages: totalBeverages,
    });
  }, [channels]);

  // Function to send data to the backend
  function sendDataToBackend() {
    const formattedMonth = formatMonth(selectedMonth);
    const [monthValue, yearValue] = selectedMonth.split("-");
    const formattedMonthYear = `${monthValue},${yearValue}`;

    // Filter the active channels
    const activeChannels = channels.filter((channel) => channel.active);

    // Extract the names, food, and beverages data separately
    const channelNames = activeChannels.map((channel) => channel.name);
    const foodData = activeChannels.map((channel) => channel.food);
    const beveragesData = activeChannels.map((channel) => channel.beverages);

    // Construct the data object
    const dataToSend = {
      channels: channelNames,
      food: foodData,
      beverages: beveragesData,
      month: formattedMonth,
      userId: user.userId ? user.userId : "300",
    };

    console.log(dataToSend, "__");
    // Send a POST request to your backend API
    axios
      .post("/Marie-ERP/api/saleschannel", { ...dataToSend }) // Wrap the data in an array
      .then((response) => {
        // Handle a successful response from the backend if needed
        console.log("Data sent successfully:", response);
      })
      .catch((error) => {
        // Handle errors if the request fails
        console.error("Error sending data to the backend:", error);
      })
      .finally(() => {
        setActiveTab("Sales by Menu");
      });
  }

  const inputMonth = salesMonth;

  // Split the input into year and month parts
  const [year, month] = inputMonth.split("-");

  // Create a Date object with the year and month
  const date = new Date(year, month - 1, 1);

  // Get the month name from the Date object
  const monthName = date.toLocaleString("default", { month: "long" });

  useEffect(() => {
    console.log({
      month: monthName,
      userId: user.userId ? user.userId : "300",
    });
    axios
      .post("/Marie-ERP/api/salesmenu_get", {
        month: monthName,
        userId: user.userId ? user.userId : "300",
      })
      .then((response) => {
        console.log(response);
        // Map the data from the API to the format expected by your table
        const mappedData = response.data.data.menu_data.map((item) => ({
          id: item["Item_No"],
          Category: item.Category,
          Name: item["Item_Name"],
          TableUnits: item["Total_Unit_Sales_Volume"],
        }));

        // Set the mapped data to the salesByMenuData state
        setSalesByMenuData(mappedData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [monthName, calleffect]);

  // console.log("mergedData",mergedData);
  // console.log("tableData",tableData);

  //   useEffect(() => {

  //       // const mappedData = tableData.data.data.menu_data.map((item) => ({
  //       //   id: item["Item_No"],
  //       //   Category: item.Category,
  //       //   Name: item["Item_Name"],
  //       //   TableUnits: item["Total_Unit_Sales_Volume"],
  //       // }));
  //       // setSalesByMenuData(mappedData);
  //       // console.log(mappedData);

  // console.log(tableData.data.);
  //   }, [tableData]);

  const handleEdit = (item) => {
    axios
      .post(`/Marie-ERP/api/salesmenu_row`, {
        month: monthName,
        userId: user.userId ? user.userId : "300",
        item_no: item.id,
      })
      .then((response) => {
        console.log(response.data.data.menu_data);

        setEditedItem(response.data.data.menu_data); // Populate the edit modal with the data

        setShowEditModal(true);
      })
      .catch((error) => {
        console.error("Error fetching item for edit:", error);
      });
  };

  const handleSaveEdit = () => {
    // Implement your PUT request here to update the item on the server
    let editedItemArray = Array.isArray(editedItem) ? editedItem : [editedItem];

    // const converted_data = editedItemArray.map((item) => ({
    //   id: item["Item_No"],
    //   Category: item.Category,
    //   Item: item["Item_Name"],
    //   TableUnits: item["Total_Unit_Sales_Volume"],
    // }));

    console.log(editedItemArray);
    const data = {
      data: editedItemArray,
      month: monthName,
      userId: user.userId ? user.userId : "300",
      button: "edit",
    };
    // console.log(data);
    axios
      .post(`/Marie-ERP/api/salesmenu_edit_delete`, data)

      .then((response) => {
        console.log("Item updated:", response.data);
        // Update the local state with the new data to reflect changes immediately
        const updatedData = salesByMenuData.map((item) =>
          item["Item_No"] === editedItem["Item_No"] ? editedItem : item
        );

        setSalesByMenuData(updatedData);
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      })
      .finally(() => {
        setCallEffect(Math.random());
      });
    setShowEditModal(false); // Close the modal
  };

  const handleDelete = (item) => {
    // Implement your DELETE request here to remove the item from the server

    // const converted_data = editedItemArray.map((item) => ({
    //   id: item["Item_No"],
    //   Category: item.Category,
    //   Item: item["Item_Name"],
    //   TableUnits: item["Total_Unit_Sales_Volume"],
    // }));

    console.log({
      data: [{ ...item, Item_No: item.id, Item: item.Name }],
      month: monthName,
      userId: user.userId ? user.userId : "300",
      button: "delete",
    });

    axios
      .post(`/Marie-ERP/api/salesmenu_edit_delete`, {
        data: [{ ...item, Item_No: item.id, Item: item.Name }],
        month: monthName,
        userId: user.userId ? user.userId : "300",
        button: "delete",
      })
      .then((response) => {
        console.log("Item deleted:", response);

        // // Update the local state to remove the deleted item
        // const updatedData = salesByMenuData.filter((dataItem) => dataItem.id !== item.id);
        // setSalesByMenuData(updatedData);
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      })
      .finally(() => {
        setCallEffect(Math.random());
      });
  };

  function isAnyChannelActive() {
    return channels.some((channel) => channel.active);
  }

  // pagination for sales by menu
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 10; // Define the number of items per page
  const pagesVisited = pageNumber * itemsPerPage;

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  // show and hide add menu
  // const [showAddMenuSection, setShowAddMenuSection] = useState(false);

  // loading screen
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate a delay to mimic data loading (replace with actual data fetching logic).
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the delay as needed.
  }, []);

  //for fetching sales menu category and items in modal

  const [categories, setCategories] = useState([]); // Options for categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category

  const [items, setItems] = useState([]); // Options for items
  const [selectedItem, setSelectedItem] = useState(""); // Selected item
  useEffect(() => {
    axios.get("/Marie-ERP/api/salesmenu").then((res) => {
      setCategories(res.data.categories.categories);
      setItems(res.data.categories.items);
    });
  }, []);



 

  return (
    <>
      <Header />
      <Row className=" vw-100  vh-100 ">
        <Col sm={4} md={3} lg={2}>
          <Sidebar />
        </Col>
        <Col sm={8} md={9} lg={10}>
          {/* <Header /> */}
          <div className="pt-2">
            <h1 className="mt-2">
              <i
                className="fa-solid fa-chart-line"
                style={{ color: "#FCA311" }}></i>{" "}
              Sales
            </h1>

            <div className="pt-4 px-0 mx-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(key) => setActiveTab(key)}
                className=" gap-5"
                variant="">
                <Tab eventKey="Channel Type" title={<h4>Channel type</h4>}>
                  <h5 className="pt-5">
                    Select channels used to reach your customers.
                  </h5>
                  <div className="pt-5">
                    <Row>{channelButtons}</Row>
                  </div>

                  <div className="text-end mx-5" style={{ paddingTop: "40px" }}>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                      <button
                        className="btn"
                        onClick={() => setActiveTab("Sales by Channel")}>
                        <i className="fa-regular fa-circle-right fa-2xl"></i>
                      </button>
                    </Col>
                  </div>
                </Tab>

                {/* =======================================sales by channel================================================================== */}
                <Tab
                  eventKey="Sales by Channel"
                  title={<h4>Sales by channel</h4>}>
                  <h5 className="pt-5">
                    Enter available sales data from a recent calendar month.
                  </h5>
                  {/* date */}
                  <div className="pt-5">
                    <Row>
                      <Col lg={2} sm={4} xs={5}>
                        <Form.Control
                          className="text-center fs-6 shadow bg-light  border-0"
                          size="sm"
                          type="month"
                          placeholder="Year"
                          // defaultValue={selectedMonth}
                          onChange={(e) => {
                            setSelectedMonth(e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="pt-5">
                  {channels.some((channel) => channel.active) ? (
                    <Table
                      responsive
                      bordered
                      style={{ width: "10rem" }}
                      className="shadow-sm">
                      <thead>
                        <tr className="border-0">
                          <th className="border-0"></th>
                          {tableHeaders}
                          <th
                            style={{
                              backgroundColor: "#14213d",
                              color: "white",
                              width: "15%",
                              textAlign: "center",
                            }}>
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#14213d",
                              color: "white",
                            }}
                            className="text-center">
                            Food
                          </th>
                          {tableInputs}
                          <td className="text-center text-muted ">
                            {sumTotal.food}
                          </td>
                        </tr>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#14213d",
                              color: "white",
                            }}
                            className="text-center">
                            Beverages
                          </th>
                          {tableInputs2}
                          <td className="text-center text-muted">
                            {sumTotal.beverages}
                          </td>
                        </tr>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#14213d",
                              color: "white",
                            }}
                            className="text-center">
                            Total
                          </th>
                          {tableSum}
                        </tr>
                      </tbody>
                    </Table>
                    ) : (
                      // <Alert variant='danger'>
                      // Please select atleast one channel</Alert>
                      <p className="error-messagee">Please select at least one channel</p>
                    )}
                  </div>
                  <Row
                    className="text-center pt-2"
                    style={{
                      display: isAnyChannelActive() ? "block" : "none",
                    }}>
                    <Col></Col>
                    <Col className="text-center">
                      <button
                        onClick={() => {
                          sendDataToBackend();
                        }}
                        className="btn btn-primary my-2 ">
                        Save
                      </button>
                    </Col>
                    <Col></Col>
                  </Row>

                  <div
                    className="text-center"
                    style={{
                      paddingTop: isAnyChannelActive() ? "20px" : "100px",
                    }}>
                    <Row>
                      <Col>
                        <button
                          className="btn"
                          onClick={() => setActiveTab("Channel Type")}>
                          <i class="fa-regular fa-circle-left fa-2xl"></i>
                        </button>
                      </Col>
                      <Col></Col>
                      <Col>
                        <button
                          className="btn"
                          onClick={() => setActiveTab("Sales by Menu")}>
                          <i class="fa-regular fa-circle-right fa-2xl"></i>
                        </button>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                {/* =====================================sales menu ================================================================*/}
                <Tab
                  eventKey="Sales by Menu"
                  title={
                    <h4
                      className={activeTab === "Sales by Menu" ? "active" : ""}>
                      Sales by menu
                    </h4>
                  }>
                  <h5 className="p-2 mt-5">
                    Enter available product sales from a recent calendar month.
                  </h5>
                  <h6 className="pt-3">
                    {/* <u>How does answering this help me?</u> */}
                  </h6>

                  <Row>
                    <Col lg={2} sm={4} xs={5}>
                      <Form.Control
                        className="text-center fs-6 shadow border-0"
                        size="sm"
                        type="month"
                        required
                        // defaultValue={selectedMonth}
                        placeholder="Year"
                        // ref={inputRef}
                        onChange={(e) => {
                          setCallEffect(Math.random());
                          setSalesMonth(e.target.value);
                        }}
                      />
                    </Col>
                  </Row>

                  <div className="pt-5">
                    <div className="d-flex justify-content-between ">
                      <Col>
                        {/*<Form.Group>
                      <Form.Label className="mx-1">Upload excel sheet for menu data</Form.Label>
                       <Form.Control
                        type="file"
                        onChange={handleFile}
                        style={{width : '50%'}}
                        className="p-3 "
                        accept=".xlsx, .xls" /></Form.Group> */}
                        <SalesFileImport
                          callEffect={setCallEffect}
                          month={monthName}
                        />
                      </Col>
                      <Col className="text-end ">
                        <br></br>
                        <Button
                          className=" shadow mx-3"
                          onClick={handleAddMenuClick}>
                          {/* {showAddMenuSection ? "Close Menu" : "Add Menu"} */}
                          Add Menu
                        </Button>
                      </Col>
                    </div>
                    {showSalesTable && (
                      <SalesTable
                        calleffect={setCallEffect}
                        sendDataToParent={handleDataFromChild}
                        cols={cols}
                        salesMonth={salesMonth}
                        setShowSalesTable={setShowSalesTable}
                      />
                    )}
                    <div className="pt-5">
                      <Table bordered className="text-center shadow table">
                        <thead style={{ backgroundColor: "#14213d" }}>
                          <tr>
                            <th className="Thead">No</th>
                            <th className="Thead">Category</th>
                            <th className="Thead">Item</th>
                            <th className="Thead">Total units sales volume</th>
                            <th className="Thead">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading
                            ? // Render skeleton loading placeholders while data is loading.
                              Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                  <td>
                                    <ContentLoader
                                      speed={2}
                                      width={50}
                                      height={20}
                                      viewBox="0 0 50 20"
                                      backgroundColor="#f3f3f3"
                                      foregroundColor="#ecebeb">
                                      <rect
                                        x="0"
                                        y="0"
                                        rx="4"
                                        ry="4"
                                        width="50"
                                        height="20"
                                      />
                                    </ContentLoader>
                                  </td>
                                  <td>
                                    <ContentLoader
                                      speed={2}
                                      width={100}
                                      height={20}
                                      viewBox="0 0 100 20"
                                      backgroundColor="#f3f3f3"
                                      foregroundColor="#ecebeb">
                                      <rect
                                        x="0"
                                        y="0"
                                        rx="4"
                                        ry="4"
                                        width="100"
                                        height="20"
                                      />
                                    </ContentLoader>
                                  </td>
                                  <td>
                                    <ContentLoader
                                      speed={2}
                                      width={100}
                                      height={20}
                                      viewBox="0 0 100 20"
                                      backgroundColor="#f3f3f3"
                                      foregroundColor="#ecebeb">
                                      <rect
                                        x="0"
                                        y="0"
                                        rx="4"
                                        ry="4"
                                        width="100"
                                        height="20"
                                      />
                                    </ContentLoader>
                                  </td>
                                  <td>
                                    <ContentLoader
                                      speed={2}
                                      width={80}
                                      height={20}
                                      viewBox="0 0 80 20"
                                      backgroundColor="#f3f3f3"
                                      foregroundColor="#ecebeb">
                                      <rect
                                        x="0"
                                        y="0"
                                        rx="4"
                                        ry="4"
                                        width="80"
                                        height="20"
                                      />
                                    </ContentLoader>
                                  </td>
                                  <td>
                                    <ContentLoader
                                      speed={2}
                                      width={100}
                                      height={20}
                                      viewBox="0 0 100 20"
                                      backgroundColor="#f3f3f3"
                                      foregroundColor="#ecebeb">
                                      <rect
                                        x="0"
                                        y="0"
                                        rx="4"
                                        ry="4"
                                        width="100"
                                        height="20"
                                      />
                                    </ContentLoader>
                                  </td>
                                </tr>
                              ))
                            : // Render the actual data when it's not loading.
                              salesByMenuData
                                .slice(
                                  pagesVisited,
                                  pagesVisited + itemsPerPage
                                )
                                .map((item) => (
                                  <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.Category}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.TableUnits}</td>
                                    <td>
                                      <button
                                        className="btn"
                                        onClick={() => {
                                          handleEdit(item);
                                        }}>
                                        <i
                                          className="fa-regular fa-pen-to-square fa-xl"
                                          style={{ color: "#FCA311" }}></i>
                                      </button>
                                      <button
                                        className="btn"
                                        onClick={() => {
                                          handleDelete(item);
                                        }}>
                                        <i
                                          className="fa-solid fa-trash-can fa-xl"
                                          style={{ color: "#ee1717" }}></i>
                                      </button>{" "}
                                    </td>
                                  </tr>
                                ))}
                        </tbody>
                      </Table>

                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={Math.ceil(
                          salesByMenuData.length / itemsPerPage
                        )}
                        onPageChange={handlePageChange}
                        containerClassName={"pagination"}
                        previousLinkClassName={"previous"}
                        nextLinkClassName={"next"}
                        disabledClassName={"disabled"}
                        activeClassName={"active"}
                      />
                      {/* <div className="text-center mt-5"><Button type="btn">submit</Button></div>
                       */}
                    </div>

                    {/* <Table
                      bordered
                      responsive
                      className="mt-5"
                      style={{
                        borderCollapse: "collapse",
                        margin: "10px auto",
                      }}>
                      <thead>
                        <tr>
                          {header.map((h, i) => (
                            <th
                              className="text-center"
                              style={{
                                backgroundColor: "#FCA311",
                                color: "white",
                              }}
                              key={i}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                      {mergedData.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.Category}</td>
                            <td>{item.Item}</td>
                            <td>{item.TableUnits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table> */}
                  </div>
                  <div
                    className="text-start mx-5"
                    style={{ paddingTop: "20px" }}>
                    <Col>
                      <button
                        className="btn"
                        onClick={() => setActiveTab("Sales by Channel")}>
                        <i className="fa-regular fa-circle-left fa-2xl"></i>
                      </button>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                  </div>
                </Tab>
              </Tabs>
            </div>
            {showEditModal && (
              <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formCategory">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Category"
                        value={editedItem.Category}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            Category: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="formName">
                      <Form.Label>Items</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Item Name"
                        value={editedItem.Item_Name}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            Item_Name: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableUnits">
                      <Form.Label>Total Units Sales Volume</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Total_Unit"
                        value={editedItem.Total_Unit_Sales_Volume}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            Total_Unit_Sales_Volume: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleEditModalClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Sales;
