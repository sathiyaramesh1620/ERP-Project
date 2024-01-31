
import React, { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./Sales.css";
import axios from "axios";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserContext } from "../../Context/UserContext";

const SalesTable = (props) => {
  const inputMonth = props.salesMonth;
  const [errorMessage, setErrorMessage] = useState("");

  const [year, month] = inputMonth.split("-");
  const date = new Date(year, month - 1, 1);
  const monthName = date.toLocaleString("default", { month: "long" });

  const { user } = useContext(UserContext);

  const [optionCategory, setOptionCategory] = useState([]);
  const [optionItem, setOptionItem] = useState({});
  const [tableData, setTableData] = useState([
    { id: props.cols.length + 1, Category: "", Item: "", TableUnits: "" },
  ]);

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
    axios.get("/Marie-ERP/api/salesmenu").then((res) => {
      setOptionCategory(res.data.categories.categories);
      setOptionItem(res.data.categories.items);
    });
  }, []);

  const handleInputChange = (index, value, name) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][name] = value;
    setTableData(updatedTableData);
  };

  const handleCustomCategorySave = () => {
    if (customCategory.trim() !== "") {
      setOptionCategory([...optionCategory, customCategory]);
      setSelectedCategory(customCategory);
      closeOtherCategoryModal();
    }
  };

  const handleCustomItemSave = () => {
    if (customItem.trim() !== "") {
      const updatedOptionItem = { ...optionItem };
      if (!updatedOptionItem[selectedCategory]) {
        updatedOptionItem[selectedCategory] = [];
      }
      updatedOptionItem[selectedCategory].push(customItem);
      setOptionItem(updatedOptionItem);
      setSelectedItem(customItem);
      closeOtherItemModal();
    }
  };

  const addRow = () => {
    const newRow = {
      id: tableData.length + 1,
      Category: "",
      Item: "",
      TableUnits: "",
    };
    setTableData([...tableData, newRow]);
  };

  const deleteRow = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };
  const sendDataToParent = () => {
    if (validateForm()) {
      axios
        .post("/Marie-ERP/api/salesmenu_insert", {
          data: tableData,
          month: monthName,
          userId: user.userId ? user.userId : "300",
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            // props.sendDataToParent(monthName);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          props.calleffect(Math.random());
        });
      props.sendDataToParent(monthName);
      props.setShowSalesTable(false);
    } else {
      setErrorMessage("Please fill out all input fields before save.");
    }
  };
  

  const validateForm = () => {
    for (const row of tableData) {
      if (!row.Category || !row.Item || !row.TableUnits) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <div className="pt-5">
        <Table bordered className="text-center shadow">
          <thead>
            <tr>
              <th className="Thead">No</th>
              <th className="Thead">Category</th>
              <th className="Thead">Item</th>
              <th className="Thead">Total units sales volume</th>
              <th className="Thead">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={item.id}>
                <td>{item.id}</td>
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
                      { value: "Other", label: "Other" },
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
                            { value: "Other", label: "Other" },
                          ]
                        : [{ value: "Other", label: "Other" }]
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
                      style={{ color: "#ee1717" }}
                    ></i>
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
      <Modal show={showOtherCategoryModal} onHide={closeOtherCategoryModal} centered>
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
