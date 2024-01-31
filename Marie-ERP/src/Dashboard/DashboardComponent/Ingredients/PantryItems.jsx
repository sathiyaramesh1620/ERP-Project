import React, { useState, useEffect } from "react";
import { FormCheck, Row, Col, Button, FormControl, Modal, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import PantryItemsRow from "./PantryItemsRow";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PantryItems.css";
import ReactPaginate from "react-paginate";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";


const PantryItems = () => {
  const [searchQuery,setSearchQuery]=useState('')
  const [ingredientsData, setIngredientsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
 


  const dataPerPage=50
  
 
  
  const { user } = useContext(UserContext);
  const { item } = useParams();

  const [selectAll, setSelectAll] = useState(false);
  const [measurement, setMeasurements] = useState();

  console.log(measurement, 'asa')
  // const [purchase_cycle, setPurchase_cycle] = useState();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
 
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    // Store the 'item' in sessionStorage when it changes
    sessionStorage.setItem('currentItem', item);
 
    // Rest of your useEffect logic for fetching data based on 'item'
    // ...
  }, [item]);

  console.log('Selected Items: ', item)

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.post("/Marie-ERP/api/ingredientsList", {
          userId: user.userId ? user.userId : 7,
          category: item,
        });
        console.log(response, 'ingredient list');
        //console.log(response, 'SSaa')
        setIngredientsData(
          response.data.data.categoryListing[item].map((el) => {
            return {
              ingredient: el.ingredient,
              ingredientId : el.ingredientId,
              isChecked:
                el.isChecked === true || el.isChecked === false
                  ? el.isChecked
                  : false ,
              measurement: el.unitsOfMeasure ? el.unitsOfMeasure : el.measurement
            };
          }) || []
        );
       setMeasurements(response.data.data.measurements);
       console.log(ingredientsData)
       //console.log(response.data.data.measurements, 'mesurement')
      //  ingredientsData.map((items) => {
      //   console.log(items.measurement, "MEASUREMENT")
      //   console.log(items.ingredient, "INGREDIENT")
      //   console.log(items.ingredientId, "INGREDIENTID")
      //  })
       
        //setPurchase_cycle(response.data.data.purchase_cycle);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [item]);

  //console.log(measurement)
//console.log(ingredientsData)
//console.log(ingredientsData, 'asdfasdf');


  const handleIngredientsData = (index, data) => {
    setIngredientsData((prevData) => {
      const newData = [...prevData];
      newData[index] = data;
      return newData;
    });
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
console.log({
  userId: user.userId ? user.userId : 5,
  category: item,
  data: ingredientsData,
}, 'store ingredient');
    try {
      const response = await axios.post("/Marie-ERP/api/storeIngredients", {
        userId: user.userId ? user.userId : 5,
        category: item,
        data: ingredientsData,
      });

      console.log(response.data, 'After store message');

      if (response.status === 200) {
        setLoading(true);
        const fetchData = async () => {
          try {
            const response = await axios.post("/Marie-ERP/api/ingredientsList", {
              userId: user.userId ? user.userId : 5,
              category: item,
            });
            console.log(response);
            setIngredientsData(
              response.data.data.categoryListing[item].map((el) => {
                return {
                  ingredient: el.ingredient,
                  ingredientId : el.ingredientId,
                  isChecked:
                    el.isChecked === true || el.isChecked === false
                      ? el.isChecked
                      : false,
                  measurement: el.measurement
                 // purchase_cycle: el.purchase_cycle ? el.purchase_cycle : "Daily",
                };
              }) || []
            );
            setMeasurements(response.data.data.measurements);
            
           // setPurchase_cycle(response.data.data.purchase_cycle);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        };
    
        fetchData();

        toast.success("Data saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  
  //console.log(ingredientsData.measurement, 'jjj')

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //Calculate start index for the current page
  const startIndex = (currentPage - 1) * dataPerPage;

  // Paginated data based on the current page
  const paginatedData = ingredientsData.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  // const filteredData = ingredientsData.filter((data) => {
  //   // Ensure data.ingredient exists and is a string before applying toLowerCase
  //   return data.ingredient && typeof data.ingredient === 'string'
  //     ? data.ingredient.toLowerCase().includes(searchQuery.toLowerCase())
  //     : false;
  // });

  const filteredData = ingredientsData && ingredientsData.length > 0
    ? ingredientsData.filter((data) => {
        return data.ingredient && typeof data.ingredient === 'string'
          ? data.ingredient.toLowerCase().includes(searchQuery.toLowerCase())
          : false;
      })
    : [];

// Calculate start index for the current page on the filtered data
const filteredStartIndex = (currentPage - 1) * dataPerPage;

// Paginated data based on the current page and filtered data
const paginatedFilteredData = filteredData.slice(
  filteredStartIndex,
  filteredStartIndex + dataPerPage
);

const [newIngredient, setNewIngredient] = useState({
  isChecked : true,
  ingredient: '',
  measurement: 'kg', // Set default value for measurements
});

// Function to handle adding a new ingredient
const handleAddIngredient = async () => {
  // Create a copy of existing ingredients data and append the new ingredient
  const updatedIngredientsData = [newIngredient, ...ingredientsData];

  setIngredientsData(updatedIngredientsData); // Update the state with the new ingredient

  setSubmitLoading(true); // Set loading to true while sending data to backend

  console.log({
    userId: user.userId ? user.userId : 5,
    category: item,
    ingredientsData : updatedIngredientsData, // Send the updated ingredients data to the backend
  }, 'Create ingredient');
  try {
    const response = await axios.post("/Marie-ERP/api/createIngredient", {
      userId: user.userId ? user.userId : 5,
      category: item,
      ingredientsData : updatedIngredientsData, // Send the updated ingredients data to the backend
    });
    
    
    console.log(response.data, 'After create ingredient message');

    if (response.status === 200) {
      toast.success("Data saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.post("/Marie-ERP/api/ingredientsList", {
            userId: user.userId ? user.userId : 7,
            category: item,
          });
          console.log(response, 'ingredient list');
          //console.log(response, 'SSaa')
          setIngredientsData(
            response.data.data.categoryListing[item].map((el) => {
              return {
                ingredient: el.ingredient,
                ingredientId : el.ingredientId,
                isChecked:
                  el.isChecked === true || el.isChecked === false
                    ? el.isChecked
                    : false ,
                measurement: el.unitsOfMeasure ? el.unitsOfMeasure : el.measurement
              };
            }) || []
          );
         setMeasurements(response.data.data.measurements);
         console.log(ingredientsData)
         //console.log(response.data.data.measurements, 'mesurement')
        //  ingredientsData.map((items) => {
        //   console.log(items.measurement, "MEASUREMENT")
        //   console.log(items.ingredient, "INGREDIENT")
        //   console.log(items.ingredientId, "INGREDIENTID")
        //  })
         
          //setPurchase_cycle(response.data.data.purchase_cycle);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
      
      fetchData();
    }
  } catch (error) {
    console.error(error);
    toast.error("Error saving data. Please try again later.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } finally {
    setSubmitLoading(false);
  }
};


  return (
    <>
    
    <div className="pantry-items-container">
    <h3 className="mx-0">Pick your ingredients from the table</h3>
      <Row>
        <Col>
          <div className="h4">{item}</div>
        </Col>
        {/* <Col>
        <input
            className="form-control mx-0"
            placeholder="search item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col> */}
      
        <Col>
          <div className="d-flex justify-content-end">
          <div className="text-end">
    <button className="btn btn-warning m-0 rounded-2 p-2 border-0  mx-2" onClick={handleShow}>Add ingredient</button></div>
            <button
              className="rounded saveB px-3 text-light p-1 bg-dark-blue"
              onClick={handleSubmit}
              disabled={submitLoading}>
              {submitLoading ? "Loading..." : "Save"}
            </button>
          </div>
        </Col>
      </Row>

      {loading ? (
        <>
          <div className="w-100 mt-3">
            <span className="placeholder col-3 bg-primary p-3"></span>
            <span className="placeholder col-3 bg-primary p-3"></span>
            <span className="placeholder col-3 bg-primary p-3"></span>
            <span className="placeholder col-3 bg-primary p-3"></span>

            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>

            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>

            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>

            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
            <span className="placeholder col-3 p-3 mt-1"></span>
          </div>
        </>
      ) : (
        <>
          <table className="w-100 mt-3">
            <thead>
              <tr className="table-header-row">
                <th className="d-flex justify-content-center align-items-center ">
                  <FormCheck
                    checked={selectAll}
                    onChange={handleSelectAll}
            
                    style={{ fontSize: "18px", color: "blue" }}
                    className="p-1"
                  />
                  <div className="p-1">+</div>
                </th>
                <th>Ingredients</th>
                <th>Unit of M</th>
                
              </tr>
            </thead>
            <tbody>
            {ingredientsData.map((data, index) => (
            <PantryItemsRow
              key={index}
              index={startIndex + index}
              data={data}
              isSelectAll={selectAll}
              _setIngredientsData={handleIngredientsData}
              item={item}
              measurement={measurement}
             // purchase_cycle={purchase_cycle}
            />
          ))}
            </tbody>
          </table>

          <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(ingredientsData.length / dataPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
          variant="outlined"
        />
      </Stack>

     
          <ToastContainer />

          
        </>
      )}
       

       

    </div>

    <Modal show={show} onHide={() => setShow(false)}> {/* Update the onHide prop */}
<Modal.Header closeButton>
  <Modal.Title>Add New Ingredient</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form.Control
            className="mt-2"
            type="text"
            placeholder="Enter ingredient name"
            value={newIngredient.ingredient}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, ingredient: e.target.value })
            }
          />
          <Form.Select
            className="mt-2"
            value={newIngredient.measurement}
            onChange={(e) =>
              setNewIngredient({
                ...newIngredient,
                measurement: e.target.value,
              })
            }
          >
            <option value="kg">kg</option>
            <option value="units">units</option>
            <option value="litre">litres</option>
            {/* Add other measurement options here */}
          </Form.Select>
          <div className="text-end">
            <button
              className="btn btn-warning mt-3"
              onClick={() => {
                handleAddIngredient();
                handleClose(); // Close the modal after adding the ingredient
              }}
            >
              Save
            </button>
          </div>
</Modal.Body>
</Modal>
    </>);
};

export default PantryItems;
