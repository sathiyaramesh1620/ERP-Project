import React from "react";
import { useState, useEffect, useContext } from "react";
import { Button, Table, Form, Modal, Nav, Tab, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { CostDataContext } from "./CostContext";
import Mains from "./Mains";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../../Context/UserContext";
import './Sides.css'

const SidesTable = ({ item, index }) => {
  const { user } = useContext(UserContext);
  const { servings, sidesSelectedItems, SidesSave, setSidesSave } =
    useContext(CostDataContext);
  const [showModal, setShowModal] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  console.log(sidesSelectedItems);

  useEffect(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);

    const monthYear = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
    }).format(today);

    const [month, year] = monthYear.split("/");
    console.log(month, "9999999");

    console.log({
      userId: user.userId || 64,
      month: month,
      year: year,
    });
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
        setCategories(updatedCategories);
      })
      .catch((err) => console.log(err));
  }, []);

  // useEffect(() => {
  //   axios.post('/Marie-ERP/api/selectingIngredients', {userId :64, month : 11, year : 2023} )
  //   .then(response => console.log(response))
  //   .catch(err => console.log(err))
  // },[])
  const handleCheckboxChange = (event, category, ingredient, subtype) => {
    const isChecked = event.target.checked;
    const updatedCategories = categories.map((cat) => {
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
    setCategories(updatedCategories);
  };

  const handleAddToTable = () => {
    const selectedItems = categories.flatMap((cat) =>
      cat.ingredients.filter((ing) => ing.isChecked)
    );
    setSelectedItems(selectedItems);
    setShowModal(false);
  };

  // const handleAddToTable = () => {
  //   const selectedItems = categories.flatMap((cat) =>
  //     cat.ingredients.filter((ing) => ing.isChecked && ing.unit_price !== 0)
  //   );

  //   if (selectedItems.length === 0) {
  //     // Show an alert or perform an action indicating a purchase is required
  //     toast.error("Please do purchase", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 1500,
  //     });
  //     return; // Stop further execution
  //   }

  //   setSelectedItems(selectedItems);
  //   setShowModal(false);
  // };

  // const handleAddToTable = () => {
  //   const selectedItems = categories.flatMap((cat) =>
  //     cat.ingredients.filter((ing) => ing.isChecked && ing.unit_price !== 0)
  //   );

  //   const hasZeroUnitPrice = categories.some((cat) =>
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

  //   if (selectedItems.length === 0) {
  //     // Show an alert or perform an action indicating a purchase is required
  //     toast.error("Please do purchase", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 1500,
  //     });
  //     return; // Stop further execution
  //   }

  //   setSelectedItems(selectedItems);
  //   setShowModal(false);
  // };

  const handleDeleteItem = (ingredientToDelete, subtypeToDelete) => {
    const updatedCategories = categories.map((cat) => {
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
    setCategories(updatedCategories);

    const updatedSelectedItems = selectedItems.filter(
      (item) =>
        !(
          item.ingredient === ingredientToDelete &&
          item.subtype === subtypeToDelete
        )
    );
    setSelectedItems(updatedSelectedItems);
  };

  const handleQuantityChange = (index, newQuantity) => {
    // Convert the input value to a non-negative number
    const parsedQuantity = Math.max(0, parseFloat(newQuantity));

    const updatedItems = [...selectedItems];
    const item = updatedItems[index];
    item.quantity = parsedQuantity;
    item.batchCost = calculateBatchCost(item);
    item.unitCost = servings ? item.batchCost / servings : item.batchCost;
    updatedItems[index] = item;
    setSelectedItems(updatedItems);
  };

  const handleUnitPriceChange = (index, newUnitPrice) => {
    const updatedItems = [...selectedItems];
    const item = updatedItems[index];
    item.unit_price = newUnitPrice;
    item.batchCost = calculateBatchCost(item);
    item.unitCost = servings ? item.batchCost / servings : item.batchCost; // Recalculate unit cost based on new batch cost
    updatedItems[index] = item;
    setSelectedItems(updatedItems);
  };

  const handleUnitOfMeasureChange = (index, newUnitOfMeasure) => {
    const updatedItems = [...selectedItems];
    const item = updatedItems[index];
    item.unitOfMeasure = parseInt(newUnitOfMeasure); // Assuming unitOfMeasure is stored as an integer
    item.batchCost = calculateBatchCost(item);
    item.unitCost = servings ? item.batchCost / servings : item.batchCost; // Adjust unit cost based on new batch cost
    updatedItems[index] = item;
    setSelectedItems(updatedItems);
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

  // const handleAddToTabled = () => {
  //   console.log(item, "outside");
  // const it = item;
  // const selectedItemsData = selectedItems.map((items) => {
  //   return {
  //     [it]: {
  //       itemName: `${items.ingredient} ${items.subtype}`,
  //       quantity: items.quantity || 0,
  //       unitOfMeasure: items.unitOfMeasure || 0,
  //       unitPrice: items.unit_price || 0,
  //       batchCost: items.batchCost || 0,
  //       unitCost: items.unitCost || 0,
  //     },
  //   };
  // });

  // // Combine all objects from the mapped data into a single object
  // const combinedData = Object.assign({}, ...selectedItemsData);
  // setSidesSave(combinedData);

   

  //   console.log(SidesSave);
  //   console.log(selectedItemsData, " ###");
  //   console.log(item);
  // };


  const handleAddToTabled = () => {
    const groupedItems = selectedItems.map((item) => ({
      itemName: `${item.ingredient} ${item.subtype}`,
      quantity: item.quantity || 0,
      unitOfMeasure: item.unitOfMeasure || 0,
      unitPrice: item.unit_price || 0,
      batchCost: item.batchCost || 0,
      unitCost: item.unitCost || 0,
    }));
    
    const currentState = SidesSave || {}
    const combinedData = {
      ...currentState,
      [item]: groupedItems,
    };
  
    setSidesSave(combinedData);
  
    console.log(combinedData, '~~~~~~~~');
  };


  return (
    <>
      <ToastContainer />
      <section key={index}>
        <div className="d-flex justify-content-between  pt-3 mt-5">
          <h4 className="mx-3 ">
            {index + 1}. {item}
          </h4>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Add ingredient</Tooltip>}
          >
            <Button
              className="btn shadow mx-3 p-1 border-0 "
              style={{ width: '10rem', backgroundColor: 'orange' }}
              onClick={handleShowModal}
            >
              Add
            </Button>
          </OverlayTrigger>
        </div>

        {selectedItems.length > 0 && 
        <Table bordered>
          <thead>
            <tr className="text-center">
              <th
                style={{ backgroundColor: "rgb(255, 217, 155)" }}
                className="border-1 border-white">
                Index No
              </th>
              <th
                style={{ width: "15%", backgroundColor: "rgb(255, 217, 155)" }}
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
              <th
                style={{ backgroundColor: "rgb(255, 217, 155)" }}
                className="border-1 border-white">
                Batch cost
              </th>
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
              {/* Add other table headers if needed */}
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
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
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
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
                    onChange={(e) =>
                      handleUnitPriceChange(index, e.target.value)
                    }
                    readOnly
                  />
                </td>
                <td>
                  <Form.Control
                    style={{ height: "10%" }}
                    className="border-0 text-center"
                    type="number"
                    value={item.batchCost} // Display the calculated batch cost
                    readOnly // To prevent user editing
                  />
                </td>
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
        </Table>}
        {selectedItems.length > 0 &&
        <button className="btn btn-warning " onClick={handleAddToTabled}>
          Save
        </button>}
        <Modal size="lg" show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton className="bgc shadow-sm text-white" style={{height : '3.5rem'}}>
            <Modal.Title>Select Items</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Container
              id="ingredient-tabs"
              defaultActiveKey={categories[0]?.category}>
              <Nav variant="tabs">
                {categories.map((category, index) => (
                  <Nav.Item key={`category-tab-${index}`}>
                    <Nav.Link eventKey={category.category}>
                      {category.category}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
              <Tab.Content>
                {categories.map((category, index) => (
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
            {/* <Button className="btn btn-danger border-0" onClick={handleCloseModal}>
              Close
            </Button> */}
            <Button variant="btn btn-warning border-0" onClick={handleAddToTable}>
              Add to Table
            </Button>
          </Modal.Footer>
        </Modal>
      </section>

      {/* <div className="d-flex justify-content-between  ">
        <div className="text-start mx-3 mt-4">
          <Link to="/dashboard/cost/sides">
            <Button
              className="float-end btn btn-warning text-white border-0 "
              // type="submit"
              style={{ width: "7rem", backgroundColor: "#fca311" }}>
              <i
                className="fa-solid fa-arrow-left"
                style={{ color: "#ffffff" }}></i>{" "}
              Previous{" "}
            </Button>
          </Link>
        </div>

        <div className="text-end mx-3 mt-4">
          <Link to="/dashboard/cost/directlabour">
            <Button
              className="float-end btn text-white border-0 "
              // type="submit"
              style={{ width: "6rem", backgroundColor: "#fca311" }}>
              Next{" "}
              <i
                className="fa-solid fa-arrow-right"
                style={{ color: "#ffffff" }}></i>
            </Button>
          </Link>
        </div>
      </div> */}
    </>
  );
};

export default SidesTable;
