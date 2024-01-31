import React from "react";
import { useState, useEffect, useContext } from "react";
import { Button, Table, Form, Modal, Nav, Tab } from "react-bootstrap";
import axios from "axios";

import { CostDataContext } from "./CostContext";
import { UserContext } from "../../../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Mains = () => {
  const { user } = useContext(UserContext);
  const { servings , setMainsTotal, setMainsIngredients } = useContext(CostDataContext);

  const [showMainsModal, setShowMainsModal] = useState(false);
  const [selectedMainsItems, setSelectedMainsItems] = useState([]);

  const [categoriesMains, setCategoriesMains] = useState([]);

  // Handlers for "Mains" section
  const handleShowMainsModal = () => {
    setShowMainsModal(true);
  };

  const handleCloseMainsModal = () => {
    setShowMainsModal(false);
  };
  useEffect(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);

    const monthYear = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
    }).format(today);

    const [month, year] = monthYear.split('/');
    axios
      .post("/Marie-ERP/api/selectingIngredients", {
        userId: user.userId ? user.userId : 4,
        month: 10,
        year: year,
      })
      .then((response) => {
        console.log(response);
        const updatedCategories = response.data.selectedData
        .filter((category) => category.ingredients && category.ingredients.length > 0) // Filter out categories with null/empty ingredients
        .map((category) => {
          const updatedIngredients = category.ingredients.map((ingredient) => ({
            ...ingredient,
            isChecked: false, // Initialize isChecked property to false
          }));
          return { ...category, ingredients: updatedIngredients };
        });
        setCategoriesMains(updatedCategories);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCheckboxChange = (event, category, ingredient, subtype) => {
    const isChecked = event.target.checked;
    const updatedCategories = categoriesMains.map((cat) => {
      if (cat.category === category) {
        const updatedIngredients = cat.ingredients.map((ing) => {
          if (ing.ingredient === ingredient && ing.subtype === subtype) {
            return { ...ing, isChecked };
          }
          return ing;
        });
        return { ...cat, ingredients: updatedIngredients };
      }
      return cat;
    });
    setCategoriesMains(updatedCategories);
  };

  const handleAddMainsToTable = () => {
    const selectedMainsItems = categoriesMains.flatMap((cat) =>
      cat.ingredients.filter((ing) => ing.isChecked)
    );
    setSelectedMainsItems(selectedMainsItems);
    setShowMainsModal(false);
  };

  const totalMainsRows = selectedMainsItems.length;
  setMainsTotal(totalMainsRows)

  // const handleAddMainsToTable = () => {
  //   const selectedMainsItems = categoriesMains.flatMap((cat) =>
  //     cat.ingredients.filter((ing) => ing.isChecked && ing.unit_price !== 0)
  //   );
  
  //   if (selectedMainsItems.length === 0) {
  //     // Show an alert or perform an action indicating a purchase is required
  //     toast.error("Please do purchase", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 1500,
  //     })
  //     return; // Stop further execution
  //   }
  
  //   setSelectedMainsItems(selectedMainsItems);
  //   setShowMainsModal(false);
  // };

  // const handleAddMainsToTable = () => {
  //   const selectedMainsItems = categoriesMains.flatMap((cat) =>
  //     cat.ingredients.filter((ing) => ing.isChecked && ing.unit_price !== 0)
  //   );
  
  //   const hasZeroUnitPrice = categoriesMains.some((cat) =>
  //     cat.ingredients.some((ing) => ing.isChecked && ing.unit_price === 0)
  //   );
  
  //   if (hasZeroUnitPrice) {
  //     // Show an error message or perform an action indicating the presence of a zero unit price
  //     toast.error("One or more selected items have a unit price of 0", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 1500,
  //     });
  //     return; // Stop further execution
  //   }
  
  //   if (selectedMainsItems.length === 0) {
  //     // Show an alert or perform an action indicating a purchase is required
  //     toast.error("Please do purchase", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 1500,
  //     });
  //     return; // Stop further execution
  //   }
  
  //   setSelectedMainsItems(selectedMainsItems);
  //   setShowMainsModal(false);
  // };

  const handleDeleteItem = (ingredientToDelete, subtypeToDelete) => {
    const updatedCategories = categoriesMains.map((cat) => {
      const updatedIngredients = cat.ingredients.map((ing) => {
        if (
          ing.ingredient === ingredientToDelete &&
          ing.subtype === subtypeToDelete
        ) {
          return { ...ing, isChecked: false };
        }
        return ing;
      });
      return { ...cat, ingredients: updatedIngredients };
    });
    setCategoriesMains(updatedCategories);

    const updatedSelectedItems = selectedMainsItems.filter(
      (item) =>
        !(
          item.ingredient === ingredientToDelete &&
          item.subtype === subtypeToDelete
        )
    );
    setSelectedMainsItems(updatedSelectedItems);
  };

  const handleQuantityChange = (index, newQuantity) => {
    // Convert the input value to a non-negative number
    const parsedQuantity = Math.max(0, parseFloat(newQuantity));

    const updatedItems = [...selectedMainsItems];
    const item = updatedItems[index];
    item.quantity = parsedQuantity;
    item.batchCost = calculateBatchCost(item);
    item.unitCost = servings ? item.batchCost / servings : item.batchCost;
    updatedItems[index] = item;
    setSelectedMainsItems(updatedItems);
  };

  const handleUnitPriceChange = (index, newUnitPrice) => {
    const updatedItems = [...selectedMainsItems];
    const item = updatedItems[index];
    item.unit_price = newUnitPrice;
    item.batchCost = calculateBatchCost(item);
    item.unitCost = servings ? item.batchCost / servings : item.batchCost; // Recalculate unit cost based on new batch cost
    updatedItems[index] = item;
    setSelectedMainsItems(updatedItems);
  };

  const handleUnitOfMeasureChange = (index, newUnitOfMeasure) => {
    const updatedItems = [...selectedMainsItems];
    const item = updatedItems[index];
    item.unitOfMeasure = parseInt(newUnitOfMeasure); // Assuming unitOfMeasure is stored as an integer
    item.batchCost = calculateBatchCost(item);
    item.unitCost = servings ? item.batchCost / servings : item.batchCost; // Adjust unit cost based on new batch cost
    updatedItems[index] = item;
    setSelectedMainsItems(updatedItems);
  };

  const unitMapping = {
    1: 1, // Kg
    2: 1, // Units
    3: 0.001, // Gram (assuming gram as a fraction of kg)
    4: 0.005, // Teaspoon (example fraction relative to kg)
    5: 0.015, // Tablespoon (example fraction relative to kg)
    6: 0.002, // Pinch (example fraction relative to kg)
    // Add more units as needed
  };

  const calculateBatchCost = (item) => {
    const unitMeasure = unitMapping[item.unitOfMeasure]; // Fetch the unit measure
    return item.quantity * item.unit_price * unitMeasure;
  };


  const prepareTableData = () => {
    return selectedMainsItems.map((item) => {
      return {
        itemName: `${item.ingredient} ${item.subtype}`,
        quantity: item.quantity || 0,
        unitOfMeasure: item.unitOfMeasure || "",
        unitPrice: item.unit_price || 0,
        //batchCost: item.batchCost || 0,
        unitCost: item.unitCost || 0,
      };
    });
  };

 

    
   const sendData = () => {
    const tableData = prepareTableData();
   console.log(tableData, '----------');
    setMainsIngredients(tableData)
 
  }

  return (
    <>
    <ToastContainer />
    <section>
      <div className="d-flex justify-content-end pt-3">
        {/* <h5 className="mx-3">2.Mains</h5> */}
        <button className="btn btn-outline-warning shadow"
            style={{width : '10rem'}} onClick={handleShowMainsModal}>
          Add
        </button>
      </div>

      {selectedMainsItems.length > 0 && (
        <>
      <Table bordered className="shadow">
        <thead>
          <tr className="text-center">
            <th
              style={{ backgroundColor: "rgb(255, 217, 155)" }}
              className="border-1 border-white">
              Index No
            </th>
            <th
              style={{
                width: "15%",
                backgroundColor: "rgb(255, 217, 155)",
              }}
              className="border-1 border-white">
              Item Name
            </th>

            <th
              style={{ backgroundColor: "rgb(255, 217, 155)" }}
              className="border-1 border-white">
              Quantity
            </th>
            <th
              style={{ backgroundColor: "rgb(255, 217, 155)" }}
              className="border-1 border-white">
              Unit of Measure
            </th>
            <th
              style={{ backgroundColor: "rgb(255, 217, 155)" }}
              className="border-1 border-white">
              Unit Price
            </th>
            {/* <th
              style={{ backgroundColor: "rgb(255, 217, 155)" }}
              className="border-1 border-white">
              Batch cost
            </th> */}
            <th
              style={{ backgroundColor: "rgb(255, 217, 155)" }}
              className="border-1 border-white">
              Unit cost
            </th>
            <th
              style={{ backgroundColor: "rgb(255, 217, 155)" }}
              className="border-1 border-white">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedMainsItems.map((item, index) => (
            <tr key={`${item.ingredient}-${index}`}>
              <td>
                <Form.Control
                  className="text-center border-0"
                  style={{ height: "10%" }}
                  value={index + 1}
                  readOnly></Form.Control>
              </td>
              <td>
                <Form.Control
                  value={`${item.ingredient} ${item.subtype}`}
                  readOnly
                  style={{ height: "10%" }}
                  className="border-0"></Form.Control>
              </td>

              <td>
                <Form.Control
                  style={{ height: "10%" }}
                  type="number"
                  value={isNaN(item.quantity) ? "" : String(item.quantity)}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      handleQuantityChange(index, newValue);
                    }
                  }}
                />
              </td>
              <td style={{ width: "15%" }}>
                <Form.Select
                  style={{ height: "10%" }}
                  value={item.unitOfMeasure}
                  onChange={(e) =>
                    handleUnitOfMeasureChange(index, e.target.value)
                  }>
                  {!item.unitOfMeasure && (
                    <option value="">Select value</option>
                  )}
                  <option value="1">Kg</option>
                  <option value="2">Units</option>
                  <option value="3">Gram</option>
                  <option value="4">Teaspoon</option>
                  <option value="5">Tablespoon</option>
                  <option value="6">Pinch</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  style={{ height: "10%" }}
                  className="border-0 text-center"
                  value={item.unit_price}
                  type="number"
                  onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                  readOnly
                />
              </td>
              {/* <td>
                <Form.Control
                  style={{ height: "10%" }}
                  className="border-0 text-center"
                  type="number"
                  value={item.batchCost} // Display the calculated batch cost
                  readOnly // To prevent user editing
                />
              </td> */}
              <td>
                <Form.Control
                  style={{ height: "10%" }}
                  className="border-0 text-center"
                  type="number"
                  value={item.unitCost} // Display the calculated unit cost
                  readOnly // To prevent user editing
                />
              </td>

              <td>
                <Button
                  variant=""
                  onClick={() =>
                    handleDeleteItem(item.ingredient, item.subtype)
                  }>
                  Delete
                </Button>
              </td>
              {/* Add other table cells corresponding to the item */}
            </tr>
          ))}
        </tbody>
      </Table>
      <button className="btn btn-warning mt-5" onClick={sendData}>Save</button></>)}


      <Modal size="lg" show={showMainsModal} onHide={handleCloseMainsModal}>
        <Modal.Header closeButton className="bgc shadow-sm text-white" style={{height : '3.5rem'}}>
          <Modal.Title>Select Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container
            id="ingredient-tabs"
            defaultActiveKey={categoriesMains[0]?.category}>
            <Nav variant="tabs">
              {categoriesMains.map((category, index) => (
                <Nav.Item key={`category-tab-${index}`}>
                  <Nav.Link eventKey={category.category}>
                    {category.category}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <Tab.Content>
              {categoriesMains.map((category, index) => (
                <Tab.Pane
                  key={`category-pane-${index}`}
                  eventKey={category.category}>
                  {category.ingredients.map(
                    (ingredient) =>
                      ingredient.subtype && (
                        <div
                          key={`${ingredient.ingredient}-${ingredient.subtype}`}>
                          <Form.Check
                            type="checkbox"
                            id={`${ingredient.ingredient}-${ingredient.subtype}`}
                            label={`${ingredient.ingredient} - ${ingredient.subtype}`}
                            checked={ingredient.isChecked}
                            onChange={(e) =>
                              handleCheckboxChange(
                                e,
                                category.category,
                                ingredient.ingredient,
                                ingredient.subtype
                              )
                            }
                          />
                        </div>
                      )
                  )}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
        <Modal.Footer>
          {/* <button className="btn rounded-5 text-white " style={{backgroundColor : 'red'}} onClick={handleCloseMainsModal}>
            Close
          </button> */}
          <button className="btn rounded-5 text-white btn-warning" onClick={handleAddMainsToTable}>
            Add to Table
          </button>
        </Modal.Footer>
      </Modal>
    </section>
    </>
  );
};

export default Mains;
