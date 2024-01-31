import React, { useState, useEffect, useContext } from "react";
import { Button, Table, Form, Modal, Nav, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { CostDataContext } from "./CostContext";
import Mains from "./Mains";
import SidesTable from "./SidesTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from 'react-paginate';
import { UserContext } from "../../../../Context/UserContext";
import './Sides.css'

const CostIngredients = () => {
  const { user } = useContext(UserContext);

  const { servings, sidesSelectedItems , setPremixTotal, monthYearr, premixIngredients, setPremixIngredients } = useContext(CostDataContext);
  const [showModal, setShowModal] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);

  const [categories, setCategories] = useState([]);
  

  const totalPremixesRows = selectedItems.length;
  
  setPremixTotal(totalPremixesRows)

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  console.log(sidesSelectedItems);

  

  // useEffect(() => {
  //   const today = new Date();
  //   today.setMonth(today.getMonth() - 1);

  //   const monthYear = new Intl.DateTimeFormat("en-US", {
  //     year: "numeric",
  //     month: "numeric",
  //   }).format(today);

  //   const [month, year] = monthYear.split('/');
  //   console.log(month, '9999999');

  //   console.log({
  //     userId: user.userId || 64,
  //     month: month,
  //     year: year
  //   })
    

  //   axios
  //     .post("/Marie-ERP/api/selectingIngredients", {
  //       userId: user.userId ? user.userId : 4,
  //       month: 10,
  //       year: year,
  //     })
  //     .then((response) => {
  //       console.log(response, '`````');
  //       const updatedCategories = response.data.selectedData.map((category) => {
  //         const updatedIngredients = category.ingredients.map((ingredient) => ({
  //           ...ingredient,
  //           isChecked: false, // Initialize isChecked property to false
  //         }));
  //         return { ...category, ingredients: updatedIngredients };
  //       });
  //       setCategories(updatedCategories);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

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
        month: 10, // Assuming you want to keep this fixed at 10
        year: year,
      })
      .then((response) => {
        console.log(response, '`````');
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
  

  const handleAddToTable = () => {
      const selectedItems = categories.flatMap((cat) =>
        cat.ingredients.filter((ing) => ing.isChecked)
      );
      setSelectedItems(selectedItems);
      setShowModal(false);
    };

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


  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(selectedItems.length / itemsPerPage);
  const currentItems = selectedItems.slice(offset, offset + itemsPerPage);

  const adjustedCurrentPage = currentPage + 1; 

  const [showModalH, setShowModalH] = useState(false);

  const handleCloseModalH = () => setShowModalH(false);
  const handleShowModalH = () => setShowModalH(true);

  

  const prepareTableData = () => {
    return selectedItems.map((item) => {
      return {
        itemName: `${item.ingredient} ${item.subtype}`,
        quantity: item.quantity || 0,
        unitOfMeasure: item.unitOfMeasure || "",
        unitPrice: item.unit_price || 0,
        batchCost: item.batchCost || 0,
        unitCost: item.unitCost || 0,
      };
    });
  };

    
   const sendData = () => {
    const tableData = prepareTableData();
  //  console.log(tableData, '----------');
    setPremixIngredients(tableData)
 
  }

  //------------------------------------------------------------------------------

  
  
    
  console.log(premixIngredients, '``````````');
  
  const [key, setKey] = useState('home'); // State to manage the active tab

  const handleTabSelect = (key) => {
    setKey(key); // Update the active tab key when a tab is selected
  };

  

  const navigateToMainsTab = () => {
    if(key === 'home'){
    setKey('profile'); // Set the active tab to "Mains"
    sendData() // Invoke the function to send data (if needed)
    }else if (key === 'profile' && sidesSelectedItems.length > 0){
      setKey('longer-tab')

  } else if (key === 'longer-tab'){
    
  }
}

 

  return (
    <>
    <ToastContainer />
    <hr />
    <Tabs
       id="justify-tab-example"
       className="mb-3"
       variant="pills"
       
       activeKey={key}
       onSelect={(k) => handleTabSelect(k)} // Handle tab selection
    >
      <Tab eventKey="home" title="Premixes">

      <section>
        <div className="d-flex justify-content-end pt-3">
          {/* <h5 className="mx-3">1.Premixes</h5> */}
          <button
            className="btn btn-outline-warning shadow"
            style={{width : '10rem'}}
            onClick={handleShowModal}>
            Add
          </button>

          <button className="btn" onClick={handleShowModalH}>?</button>
        </div>

        <Modal show={showModalH} onHide={handleCloseModalH} centered>
        <Modal.Header closeButton className="bgc shadow text-white" style={{height : '3.5rem'}}>
          <Modal.Title>Why premix ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="shadow">
          {/* Content for your modal goes here */}
          <p className="justtify p-2">Premixes are pre-prepared blends of ingredients, seasonings, sauces or dressings used to create specific 
            dishes on the menu. These premixes are prepared in advance by chefs, allowing for quick and more consistent
            food preparation in busy periods.
          </p>
        </Modal.Body>
        
      </Modal>

       {currentItems.length > 0 && (
        <Table bordered className="shadow-lg">
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
            {currentItems.map((item, index) => (
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
        </Table>)}


        {selectedItems.length > itemsPerPage && (
        <div className="d-flex justify-content-center">
          <ReactPaginate
  previousLabel={"Previous"}
  nextLabel={"Next"}
  breakLabel={"..."}
  pageCount={pageCount}
  marginPagesDisplayed={2}
  pageRangeDisplayed={5}
  onPageChange={handlePageClick}
  containerClassName={"pagination"}
  activeClassName={"active"}
  forcePage={adjustedCurrentPage - 1} // Replace currentPage with adjustedCurrentPage
/>
        </div>
      )}
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
          <Modal.Footer >
            {/* <button className="btn rounded-5 text-white " style={{backgroundColor : 'red'}} onClick={handleCloseModal}>
              Close
            </button> */}
            <button className="btn rounded-5 text-white btn-warning "  onClick={handleAddToTable}>
              Add to Table
            </button>
          </Modal.Footer>
        </Modal>
      </section>
      </Tab>

      <Tab eventKey="profile" title="Mains">
      <Mains />
      </Tab>
      {sidesSelectedItems.length > 0 && (
      <Tab eventKey="longer-tab" title="Sides">
         <div>
      {/* <h5 className="pt-3">3.Sides</h5> */}
      {sidesSelectedItems.map((item, index) => (
        <>
        
          <SidesTable item={item} index={index} />
        </>
      ))}
      </div>
      </Tab>)}
      
    </Tabs>

      

        
      {/* -------------------------------------------------------------mains----------------------------------------------------------------- */}
      
     
      
     
      <div className="d-flex justify-content-between  ">
        <div className="text-start mx-3 mt-4">
          <Link to="/dashboard/cost/sides">
            <Button
              className="float-end btn btn-warning text-white border-0 "
              // type="submit"
              style={{ width: "7rem", backgroundColor: "#fca311", marginTop : (selectedItems.length < 1) ? '5rem' : ''}}>
              <i
                className="fa-solid fa-arrow-left"
                style={{ color: "#ffffff" }}></i>{" "}
              Previous{" "}
            </Button>
          </Link>
        </div>
        
        {(key === 'longer-tab' || (key === 'profile' && sidesSelectedItems.length < 1)) &&
        <div className="text-end mx-3 mt-4">
          <Link to="/dashboard/cost/directlabour">
            <Button
              className="float-end btn text-white border-0 "
              // type="submit"
              style={{ width: "6rem", backgroundColor: "#fca311", marginTop : (selectedItems.length < 1) ? '5rem' : '' }}
              onClick={() => {sendData()}}>
              Next{" "}
              <i
                className="fa-solid fa-arrow-right"
                style={{ color: "#ffffff" }}></i>
            </Button>
          </Link>
        </div>
        }
        
        {(key === 'home' || (key === 'profile' && sidesSelectedItems.length > 0))  &&
         <div className="text-end mx-3 mt-4">
        <Button
          className="float-end btn text-white border-0"
          style={{ width: "6rem", backgroundColor: "#fca311", marginTop : (selectedItems.length < 1) ? '5rem' : '' }}
          onClick={navigateToMainsTab} // Navigate to "Mains" tab
        >
          Next{" "}
          <i className="fa-solid fa-arrow-right" style={{ color: "#ffffff" }}></i>
        </Button>
      </div>}
      </div>
    </>
  );
};

export default CostIngredients;
