import React, { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./Sales.css";
import axios from "axios";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserContext } from "../../../Context/UserContext";
import { SalesDataContext } from "./SalesContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesTable = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { selectedMMYYYY } = useContext(SalesDataContext);
  const { user } = useContext(UserContext);
  const [optionCategory, setOptionCategory] = useState([]);
  const [optionItem, setOptionItem] = useState({});
  const [tableData, setTableData] = useState([
    { id: 1, Category: "", Item: "", TableUnits: "" },
  ]);
  const [lastId, setLastId] = useState(1); // Add this state for tracking the last ID
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [customCategory, setCustomCategory] = useState("");
  const [customItem, setCustomItem] = useState("");

  const [showOtherCategoryModal, setShowOtherCategoryModal] = useState(false);
  const [showOtherItemModal, setShowOtherItemModal] = useState(false);

  const openOtherItemModal = () => {
    setShowOtherItemModal(true);
  };

  const closeOtherItemModal = () => {
    setShowOtherItemModal(false);
  };
  const openOtherCategoryModal = () => {
    setShowOtherCategoryModal(true);
  };

  const closeOtherCategoryModal = () => {
    setShowOtherCategoryModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/Marie-ERP/api/salesmenu");
        setOptionCategory(response.data.categories.categories);
        setOptionItem(response.data.categories.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (index, value, name) => {
    //console.log(value, name)
    //console.log(customCategory)
    const updatedTableData = tableData.map((item, i) => {
      if (i === index) {
        if (name === 'Item' && value !== 'Other') {
          setSelectedItem(value); // Set selectedItem state when an item is selected from the list
        } else if (name === 'Item' && value === 'Other') {
          setSelectedItem(null); // Reset selectedItem state when 'Other' is selected
        }
        return { ...item, [name]: value };
      }
      return item;
    });
    setTableData(updatedTableData);
  };
  

  console.log(tableData, 'tableData');
//  useEffect(() => {
//   if()

//  },[handleInputChange]) 
  const handleCustomCategorySave = () => {
   if (customCategory.trim() !== "") {
      setOptionCategory([...optionCategory, customCategory]);
      setSelectedCategory(customCategory);
      closeOtherCategoryModal();
    }
  };
 
  const handleCustomItemSave = () => {
    //console.log(customItem, 'LLL')
    if (customItem.trim() !== "") {
      const updatedOptionItem = { ...optionItem };
      if (!updatedOptionItem[selectedCategory]) {
        updatedOptionItem[selectedCategory] = [];
      }
      updatedOptionItem[selectedCategory].push(customItem);
      setOptionItem(updatedOptionItem);
      setSelectedItem(customItem);
  
      // Update table data with the selected custom item
      const updatedTableData = tableData.map((item, i) => {
        //console.log(lastId, i, "SOS")
        if (i + 1 === lastId) {
          
          return { ...item, Item: customItem };
        }
        return item;
      });
      setTableData(updatedTableData);
      
      closeOtherItemModal();
      //console.log(updatedTableData, "UPDATED DATA")
      
    }
  };

  const addRow = () => {
    const currentLastId = Math.max(...tableData.map((item) => item.id));
    const newRow = {
      id: currentLastId + 1, // Set the id to the currentLastId + 1
      Category: "",
      Item: "",
      TableUnits: "",
    };
    setTableData((prev) => [...prev, newRow]);
  };

  const deleteRow = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };

  const validateForm = () => {
    for (const row of tableData) {
      if (!row.Category || !row.Item || !row.TableUnits) {
        return false;
      }
    }
    return true;
  };

  console.log(selectedItem, 'selectedItem');
  const sendDataToParent = async () => {
    if (validateForm()) {
      try {
        console.log({
          data: [...tableData],
          month: selectedMMYYYY.month,
          year: selectedMMYYYY.year,
          userId: user.userId ? user.userId : "555",
        });

        const response = await axios.post("/Marie-ERP/api/salesmenu_insert", {
          data: [...tableData],
          month: selectedMMYYYY.month,
          year: selectedMMYYYY.year,
          userId: user.userId ? user.userId : "555",
        });

        console.log("Response:", response); // Debugging

        if (response.status === 200) {
          toast.success("Data saved successfully!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          console.log("Data saved successfully."); // Debugging
          props.setShowSalesTable(false);
          props.handleAddMenuClick();
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while saving data.");
      } finally {
        setTimeout(() => {
          props.calleffect(Math.random());
        }, 2000);
      }
    } else {
      setErrorMessage("Please fill out all input fields before save.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="pt-1 
      ">
        <Table bordered className="text-center shadow">
          <thead>
            <tr>
              <th className="Thead px-4">No</th>
              <th className="Thead px-4">Category</th>
              <th className="Thead px-4">Item</th>
              <th className="Thead px-4">Total units sales volume</th>
              <th className="Thead px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <Select
                    required
                    onChange={(e) => {
                      handleInputChange(index, e.value, "Category");
                      setSelectedCategory(e.value);
                      if (e.value === "Other") {
                        openOtherCategoryModal();
                        closeOtherItemModal();
                      }
                    }}
                    options={[
                      ...optionCategory.map((cat) => ({
                        value: cat,
                        label: cat,
                      })),
                      
                    ]}
                    name="category"
                    isSearchable={true}
                    placeholder="Select a category..."
                  />
                </td>
                <td className="text-center">
                  <Select
                    required
                    options={
                      selectedCategory &&
                      optionItem[selectedCategory] &&
                      optionItem[selectedCategory].length > 0
                        ? [
                            ...optionItem[selectedCategory].map((cat) => ({
                              value: cat,
                              label: cat,
                            })),
                            { value: 'Other', label:  'Other' },
                          ]
                        : [{ value:  'Other', label:  'Other' }]
                    }
                    onChange={(e) => {
                      handleInputChange(index, e.value, "Item");
                      setSelectedCategory(e.value);
                      if (e.value === "Other") {
                        openOtherItemModal();
                        closeOtherCategoryModal();
                      }
                    }}
                    isSearchable={true}
                    placeholder="Select an Item..."
                    value={selectedItem ? { value: selectedItem, label: selectedItem } : null}
                  />
                </td>
                <td>
                  <input
                    required
                    type="number"
                    name="TableUnits"
                    className="box-size text-center form-control form-control-sm fs-6"
                    placeholder="Enter the sales volume"
                    value={item.TableUnits}
                    onChange={(e) =>
                      handleInputChange(index, e.target.value, e.target.name)
                    }
                  />
                </td>
                <td>
                  <button className="btn" onClick={() => deleteRow(index)}>
                    <i
                      className="fa-solid fa-trash-can fa-xl"
                      style={{ color: "#ee1717" }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="error-message text-center">{errorMessage}</div>
        <div className="text-end mx-2">
          <button className="btn" onClick={sendDataToParent}>
            <i className="fa-solid fa-floppy-disk"></i> Save
          </button>

          <button className="btn" onClick={addRow}>
            <i className="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>
      <Modal
        show={showOtherCategoryModal}
        onHide={closeOtherCategoryModal}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Custom Category:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeOtherCategoryModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCustomCategorySave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showOtherItemModal} onHide={closeOtherItemModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Custom Item:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter item"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeOtherItemModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCustomItemSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SalesTable;
