import React from "react";
import { useContext, useEffect, useState } from "react";
import { Row, Col, Container, Nav, Form, Table, Button } from "react-bootstrap";
import "./Sales.css";
import axios from "axios";
import Select from "react-select";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import { SalesDataContext } from "./SalesContext";
import SalesFileImport from "../SalesFileImport";
import ReactPaginate from "react-paginate"; // Import react-paginate
import ContentLoader from "react-content-loader";
import SalesTable from "./SalesTable";
import { UserContext } from "../../../Context/UserContext";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoData from "/assets/No data.gif";
import ExcelJS from 'exceljs/dist/exceljs.min.js';

const SalesByMenu = () => {
  const { selectedMMYYYY, salesData } = useContext(SalesDataContext);

  const { user } = useContext(UserContext);

console.log(selectedMMYYYY, 'month, year');

  const [calleffect, setCallEffect] = useState(0);
  const [activeTab, setActiveTab] = useState("Channel Type");

  const [showSalesTable, setShowSalesTable] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAddMenuClick = () => {
    if (showAddMenuSection) {
      setShowSalesTable(false); // Hide the SalesTable when the button is clicked
    } else {
      setShowSalesTable(true); // Show the SalesTable when the button is clicked
    }
    setShowAddMenuSection((prevState) => !prevState);
  };

  const handleEditModalClose = () => {
    setEditedItem(null);
    setShowEditModal(false);
  };

  const [salesByMenuData, setSalesByMenuData] = useState([]);

  // <------------------------------------------table listing----------------------------------------------------->
  // useEffect(() => {
  //   axios
  //     .post("/Marie-ERP/api/sales_month", {
  //       month: selectedMMYYYY.month,
  //       year: selectedMMYYYY.year,
  //       userId: user.userId ? user.userId : "555",
  //     })
  //     .then((response) => {
  //       console.log(response.data.data.sales_menu, "** fetched Table data **");
  //       // Map the data from the API to the format expected by your table
  //       const mappedData = response.data.data.sales_menu.menu_data.map((item) => ({
  //         id: item["id"],
  //         Category: item.Category,
  //         Item: item["Item"],
  //         TableUnits: item["TableUnits"],
  //       }));

  //       // Set the mapped data to the salesByMenuData state
  //       setSalesByMenuData(mappedData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data: ", error);
  //     });
  // }, [selectedMMYYYY.month, calleffect]);
 const [tableShow, setTableShow] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
console.log({
  month: selectedMMYYYY.month,
  year: selectedMMYYYY.year,
  userId: user.userId ? user.userId : "555",
}, 'sales month')
      try {
       
        setIsLoading(true);
        const response = await axios.post("/Marie-ERP/api/sales_month", {
          month: selectedMMYYYY.month,
          year: selectedMMYYYY.year,
          userId: user.userId ? user.userId : "555",
        });

        console.log(response.data.data, "sales_month data");
        
        if(response.data.data.sales_menu === false){
          setTableShow(false)
        }
        else{
          const mappedData = response.data.data.sales_menu.menu_data.map(
            (item) => ({
              id: item["id"],
              Category: item.Category,
              Item: item["Item"],
              TableUnits: item["TableUnits"],
            })
          );
          setSalesByMenuData(mappedData);
          setTableShow(true)
        }
      

        // Set the mapped data to the salesByMenuData state
       
      } catch (error) {
        console.error("Error fetching data: ", error);
        setTableShow(false)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMMYYYY.month, calleffect, selectedMMYYYY.year]);

  //   const [searchInput, setSearchInput] = useState(""); // State for search input
  // const [filteredItems, setFilteredItems] = useState([]); // State for filtered items

  // // Function to filter items based on search input
  // const filterItems = () => {
  //   const filtered = salesByMenuData.filter((item) =>
  //     item.Item.toLowerCase().includes(searchInput.toLowerCase())
  //   );
  //   setFilteredItems(filtered);
  // };

  // useEffect(() => {
  //   filterItems();
  // }, [searchInput, salesByMenuData]);

  const [searchValue, setSearchValue] = useState("");

  // Filtered items and categories based on search input
  const filteredItemsAndCategories = () => {
    return salesByMenuData.filter((item) => {
      const itemCategory = item.Category.toLowerCase();
      const itemName = item.Item.toLowerCase();
      const searchInput = searchValue.toLowerCase();

      return (
        itemCategory.includes(searchInput) || itemName.includes(searchInput)
      );
    });
  };

  console.log(filteredItemsAndCategories(), 'filter');

  // <------------------------------------------fetch single user by id ----------------------------------------------------->

  const handleEdit = (item) => {
    console.log(
      {
        month: selectedMMYYYY.month,
        year: selectedMMYYYY.year,
        userId: user.userId ? user.userId : "555",
        item_no: item.id,
      },
      "**Get user by id**"
    );
    axios
      .post(`/Marie-ERP/api/salesmenu_row`, {
        month: selectedMMYYYY.month,
        year: selectedMMYYYY.year,
        userId: user.userId ? user.userId : "555",
        item_no: item.id,
      })
      .then((response) => {
        console.log(response.data);
        console.log(response.data.data.menu_data);

        setEditedItem(response.data.data.menu_data); // Populate the edit modal with the data

        setShowEditModal(true);
      })
      .catch((error) => {
        console.error("Error fetching item for edit:", error);
      });
  };
  console.log(editedItem, " **editable data**");
  // <------------------------------------------Editing api----------------------------------------------------->

  const handleSaveEdit = () => {
    // Implement your PUT request here to update the item on the server

    let editedItemArray = Array.isArray(editedItem) ? editedItem : [editedItem];

    const converted_data = editedItemArray.map((item) => ({
      id: item["id"],
      Category: item.Category,
      Item: item["Item"],
      TableUnits: item["TableUnits"],
    }));

    console.log(converted_data, "mappededitedDAta");
    const datas = {
      data: converted_data,
      month: selectedMMYYYY.month,
      year: selectedMMYYYY.year,
      userId: user.userId ? user.userId : "555",
      button: "edit",
    };
    console.log(datas, "**edited data**");

    axios
      .post(`/Marie-ERP/api/salesmenu_edit_delete`, datas)

      .then((response) => {
        console.log("Item updated:", response.data);
        if (response.status === 200) {
          toast.success("Data edited successfully !", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1010,
          });
        }
        // Update the local state with the new data to reflect changes immediately
        // const updatedData = salesByMenuData.map((item) =>
        //   item["id"] === editedItem["id"] ? editedItem : item
        // );

        // setSalesByMenuData(updatedData);
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1010,
        });
      })
      .finally(() => {
        setCallEffect(Math.random());
      });
    setShowEditModal(false); // Close the modal
  };

  // <------------------------------------------deleting api----------------------------------------------------->

  // const handleDelete = (item) => {
  //   axios
  //     .post(`/Marie-ERP/api/salesmenu_edit_delete`, {
  //       data: [{ ...item, id: item.id, Item: item.Item }],
  //       month: selectedMMYYYY.month,
  //       year: selectedMMYYYY.year,
  //       userId: user.userId ? user.userId : "555",
  //       button: "delete",
  //     })
  //     .then((response) => {
  //       console.log("Item deleted:", response);
  //       if (response.status === 200) {
  //         toast.success("Data deleted successfully !", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1010,
  //         });
  //       }
  //       // Update the local state to remove the deleted item
  //       const updatedData = salesByMenuData.filter((dataItem) => dataItem.id !== item.id);
  //       setSalesByMenuData(updatedData);
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting item:", error);
  //       toast.error(error.message, {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1010,
  //       });
  //     })
  //     .finally(() => {
  //       setCallEffect(Math.random());
  //     });
  // };
  const handleDelete = async (item) => {
    try {
      const response = await axios.post(
        `/Marie-ERP/api/salesmenu_edit_delete`,
        {
          data: [{ ...item, id: item.id, Item: item.Item }],
          month: selectedMMYYYY.month,
          year: selectedMMYYYY.year,
          userId: user.userId ? user.userId : "555",
          button: "delete",
        }
      );

      console.log("Item deleted:", response);

      if (response.status === 200) {
        toast.success("Data deleted successfully !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1010,
        });

        // Update the local state to remove the deleted item
        const updatedData = salesByMenuData.filter(
          (dataItem) => dataItem.id !== item.id
        );
        setSalesByMenuData(updatedData);
      }
    } catch (error) {
      console.error("Error deleting item:", error);

      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1010,
      });
    } finally {
      setTimeout(() => {
        setCallEffect(Math.random());
      }, 4000);
    }
  };

  function isAnyChannelActive() {
    return channels.some((channel) => channel.active);
  }
  // <------------------------------------------pagination part----------------------------------------------------->

  // pagination for sales by menu
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 10; // Define the number of items per page
  const pagesVisited = pageNumber * itemsPerPage;

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  // show and hide add menu
  const [showAddMenuSection, setShowAddMenuSection] = useState(false);

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

  useEffect(() => {
    axios.post("/Marie-ERP/api/salesmenu").then((res) => {
      setCategories([...res.data.categories.categories]);
      setItems(res.data.categories.items);
    });
  }, []);

  const generateExcelData = () => {
    // Your data to be exported
    const data = [
      ['Item No', 'Category', 'Item Name', 'Total Unit Sales Volume'],
      ['1', 'Beverage', 'Tea', 2000],
      ['2', 'Food', 'Briyani', 1000],
      ['3', 'Food', 'Chicken Manjurian', 500],
      ['4', 'Food', 'Sambar Rice', 700],
      ['5', 'Food', 'Paneer Curry', 600],
      ['6', 'Food', 'Jamun', 400],
      ['7', 'Food', 'Laddu', 500],
      ['8', 'Food', 'Full Meals', 1000],
      ['9', 'Food', 'Dosa', 2500],
      ['10', 'Food', 'Fish', 1300],
     
      // Add more rows as needed
    ];
  
    // Create a workbook with a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    data.forEach((row) => {
      worksheet.addRow(row);
    });
  
    // Save the workbook as a buffer
    return workbook.xlsx.writeBuffer();
  };
  
  const handleDownload = async () => {
    const buffer = await generateExcelData(); // Use async function to get the buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Create a temporary link element and click it to trigger the download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Sample_sales_upload.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };



  return (
    <>
      <div className="pt-5">
        <section className="d-flex flex-lg-row flex-wrap justify-content-center  align-items-center">
          <Col xl={4} lg={5} md={12} sm={12} className="mb-3">
            <SalesFileImport
              callEffect={setCallEffect}
              month={selectedMMYYYY.month}
              year={selectedMMYYYY.year}
            />
          </Col>
          <Col xl={4} lg={5} md={12} sm={12} className="mb-3 text-end">
            <Form.Control
              type="text"
              placeholder="Enter item or category name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Col>
          <Col xl={4} lg={5} md={12} sm={12} className="text-end mb-3">
            <button className="btn text-white rounded-3 " style={{ backgroundColor: "#fca311" }} onClick={handleDownload}>Sample file to upload</button>
            <Button
              className=" mx-3 btn-warning text-white border-0  "
              style={{ backgroundColor: "#fca311" }}
              onClick={handleAddMenuClick}>
              {showAddMenuSection ? "Close Menu" : "Add Menu"}
            </Button>
          </Col>
        </section>
        <div>
          {showSalesTable && (
            <SalesTable
              calleffect={setCallEffect}
              setShowSalesTable={setShowSalesTable}
              handleAddMenuClick={handleAddMenuClick}
            />
          )}
        </div>
        <section className="pt-1 pb-4 table-responsive">
          <Table bordered className="shadow table ">
            <thead style={{ backgroundColor: "#14213d" }}>
              <tr>
                <th className="Thead px-3">No</th>
                <th className="Thead px-3">Category</th>
                <th className="Thead px-3">Item</th>
                <th className="Thead px-3">Units</th>
                <th className="Thead px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Render skeleton loading placeholders while data is loading.
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
              ) : tableShow === false ? (
                // Display a message when there's no data available.
                <tr>
                  <td colSpan="5" className="text-center">
                    <img src={NoData} className="img-fluid"></img>
                  </td>
                </tr>
              ) : (
                // Render the actual data when it's not loading.

                filteredItemsAndCategories()
                  .slice(pagesVisited, pagesVisited + itemsPerPage)
                  .map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.Category}</td>
                      <td>{item.Item}</td>
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
                        </button>
                        <ToastContainer />
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </Table>
          {filteredItemsAndCategories().length > itemsPerPage && (
            <div
              className="text-start mx-2  d-flex"
              style={{ paddingTop: "20px" }}>
              <Col lg={3}>
                <Link to="/dashboard/sales/salesbychannel">
                  <Button
                    className=" border-0  "
                    style={{ width: "6rem", backgroundColor: "#fca311" }}>
                    {" "}
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      style={{ color: "#ffffff" }}
                    />{" "}
                    Back{" "}
                  </Button>
                </Link>
              </Col>
              <Col lg={5} className=" ">
                <ReactPaginate
                  pageCount={Math.ceil(salesByMenuData.length / itemsPerPage)}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  previousLinkClassName={"previous"}
                  nextLinkClassName={"next"}
                  disabledClassName={"disabled"}
                  activeClassName={"active"}
                  previousLabel={
                    <span className="previous-button">Previous</span>
                  }
                  nextLabel={<span className="next-button">Next</span>}
                />
              </Col>
            </div>
          )}
        </section>
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

                <Form.Select
                  value={editedItem.Category}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setEditedItem({
                      ...editedItem,
                      Category: e.target.value,
                    });
                  }}>
                  {categories.map((val, i) => (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formName">
                <Form.Label>Items</Form.Label>

                <Form.Select
                  value={editedItem.Item}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      Item: e.target.value,
                    })
                  }>
                  {editedItem.Category !== "Other" ? (
                    items[editedItem.Category].map((val, i) => (
                      <option key={i} value={val}>
                        {val}
                      </option>
                    ))
                  ) : (
                    <option value="other">other</option>
                  )}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formTableUnits">
                <Form.Label>Total Units Sales Volume</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="TableUnits"
                  value={editedItem.TableUnits}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      TableUnits: e.target.value,
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
    </>
  );
};

export default SalesByMenu;
