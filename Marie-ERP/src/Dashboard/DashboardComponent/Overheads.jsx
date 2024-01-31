import { Button, Col, Container, Row } from "react-bootstrap";
import "./Overheads.css";
import React, { useState, useEffect, useContext } from "react";
import { Form, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Advertising from "./Overheads/Advertising";
import "./Overheads.css";
import { motion } from "framer-motion";
import axios from "axios";
import { object } from "yup";
import { UserContext } from "../../Context/UserContext";
import {
  OverHeadsProvider,
  OverheadsContext,
} from "./Overheads/OverHeadsContext";
import MonthYearPicker from "./Overheads/components/MonthYearPicker";

const Overheads = () => {
  const [values,setValues] = useState([]);
  const [processBuilder, setProcessBuilder] = useState([])
  const [selected, setSelected] = useState([]);
  const [showNextButton, setShowNextButton] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { user } = useContext(UserContext);
  //const { state } = useContext(OverheadsContext);

  const {tableData} = useContext(OverheadsContext)
///
    // Fetch Categories data from session/local storage
  //  useEffect(() => {
  //   const sessionCat = sessionStorage?.getItem("overheadsCat");
  //   if (sessionCat) {
  //     const sessionData = JSON?.parse(sessionCat);
  //     setValues(Object?.keys(sessionData));
  //   } else {
  //     // Fetch categories from the API and set it in session storage
  //     fetchCategoriesFromApi();
  //   }
  // }, []);

  // const fetchCategoriesFromApi = async () => {
  //   try {
  //     const res = await axios.post("/Marie-ERP/api/overheads/categories");
  //     const data = res.data.categories;
    
  //     let categoriesArray=[];
      
  //       if(Array.isArray(data)){
  //         categoriesArray=data;
  //       } else if (typeof data ==="object" && data !== null){
  //         categoriesArray = Object.keys(data);
  //       }
  //       setValues(categoriesArray);
        
  //     }
  //     //else if(Array.isArray(data)){
      //   setValues(data);
      //   sessionStorage.setItem("overheadsCat",JSON.stringify(data))
      // }
      //  else{
      //   console.error("Fetched data is not an array:", data);
      // }
      //  }
  //       catch(error) {
  //     console.error("Error fetching categories", error);
  //   }
  // };
console.log(user)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.post('/Marie-ERP/api/processBuilder/fetch', {
        userId: user.userId ? user.userId : 3
      })
      .then((res) => {
        console.log(res, 'Response know')
        const categories  = res.data.data.processBuilder.data.data.subCatPross 
        //const builder = res.data.data.processBuilder.data.data.subCatPross
        setValues(categories)
        //setProcessBuilder(builder)
        setLoading(false)
      }) 
      .catch((err) => console.log(err))
  },[])

  console.log(processBuilder, 'Process Builder')

  
  // useEffect(() => {
  //   if(values && selected) {
  //     const filteredArray = values.filter(item => selected.hasOwnProperty(item))
  //     console.log(filteredArray, 'Filtered Array')
  //   }
  // },[values, selected])

  // useEffect(()=> {
  //     fetchStoredCategory();
  //   },
  //   [state.month, state.year]
  // );

  // const fetchStoredCategory = async () => {
  //   try {
  //     const res = await axios.post("/Marie-ERP/api/overheads/fetchCategories", {
  //       userId: user.userId ? user.userId : "90",
  //       month: state.month,
  //       year: state.year,
  //     });
  //     console.log(res, 'Fetched Data')
  //     const storedCategories = res?.data?.data[0]?.categories || [];
  //     setSelected(storedCategories);
  //   } catch (error) {
  //     console.log(error);
  //     setSelected([]);
  //   }
  // };

  // async function StoreCategory() {
  //   try {
  //     const res = await axios.post(
  //       "/Marie-ERP/api/overheads/storeCategories",
  //       {
  //         userId: user.userId ? user.userId : "90",
  //         categories: selected,
  //         month: state.month,
  //         year: state.year,
  //       }
  //     );
  //     // console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  
  // function handleClick(value) {
  //   const newSelected = [...selected];

  //   if (newSelected.includes(value)) {
  //     newSelected.splice(newSelected.indexOf(value), 1);
  //   } else {
  //     newSelected.push(value);
  //   }

  //   setSelected(newSelected);
  //   setShowNextButton(newSelected.length > 0);
  // }

  // function handleSubmit() {
  //   console.log("Selected items:", selected);
  // }

  function handleNext() {
    setAdvertising(true);
    //StoreCategory()
  }

  // const handleAddCategory = () => {
  //   setShowAddModal(true);
  // };

 { /*
  const handleSaveCategory = () => {
    if (newCategory.trim()!=="") {
      const updatedValues = {...tableData,[newCategory]:[]}
      setValues(pre=>[...pre,newCategory]);
      sessionStorage.setItem("overheadsCat",JSON.stringify(updatedValues))
    }
    setShowAddModal(false);
  }; */}  

  console.log(values.length, 'LENGTH')
  console.log(user.userId)
  return (
    <>
      {!advertising && (
        <Container>
          <div id="container" className="d-flex flex-column pt-5 pb-3">
            <div className="d-flex justify-content-between ">
              <h5 id="head" className="py-2">
                Overheads
              </h5>
              <span>
                {/* <MonthYearPicker /> */}
              </span>
            </div>
            <p>
              The ongoing expenses your F&B business incurs to maintain its
              daily operations.
            </p>
            {/* <p className="pb-2">
              Choose to add a new category or select from the given options to
              enter your overheads.
            </p> */}
            {/* {selected.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0.9 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0.9 }}
                transition={{
                  duration: 0.3,
                }}
                className="px-2 ">
                <div>
                  <strong>Selected Category</strong>
                </div>
                <div className="selected-category-container px-1 flex-wrap">
                  {selected.map((category) => (
                    <motion.div
                      key={category}
                      initial={{ x: 300 }} // Start from the left
                      animate={{ x: 0 }} // Move to the right
                      exit={{ opacity: 0 }} // Fade out on exit
                      transition={{ duration: 0.3 }} // 2-second duration
                    >
                      <Button
                        key={category}
                        style={{ backgroundColor: "grey" }}
                        className="btn category-button border-0 me-1 my-1"
                        onClick={() => handleClick(category)}>
                        {category}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )} */}

            {!loading ? (
              <Container>
                <Row className="g-3 mt-2 w-75">
                  {Object.keys(values).map((value, i) => {
                    return (
                      <Col key={i} className="h-100" md={3}>
                        <Button
                          onClick={() => handleClick(value)}
                          // variant={selected.includes(value) ? "warning" : "light"}
                          id="butto"
                          className=" py-5 w-100   justify-content-center fs-6 fw-bold"
                          style={{
                            backgroundColor:'#14213d'
                          }}
                        // style={{
                        //   backgroundColor: selected.includes(value)
                        //     ? "#14213D"
                        //     : "white",
                        //   color: selected.includes(value) ? "white" : "#000000",
                        // }}
                        >
                          {value}
                        </Button>
                      </Col>
                    );
                  })}
                 {/* <Col className="" md={3}>
                  <Button
                    // id="addbutton"
                    id="butto"
                    className="px-4 py-4 h-100 w-100 justify-content-center fs-6 w-75 rounded fw-bolder"
                    style={{
                      background: "#fca311",
                      color: "#14213D",
                    }}
                    onClick={handleAddCategory}>
                    Add New
                    {/* <FaPlus
                      className="w-100 m-2"
                      style={{
                        color: "#FCA311",
                      }}
                    /> 
                  </Button>
                </Col>  */}
              </Row>
              <Row>
              <Col className="d-flex justify-space-between my-2">
                {/* {selected.length > 0 && (
                  <span className="me-auto">
                  <Button
                  className="float-end btn btn-warning text-white"
                  type="submit">
                  <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ color: "#ffffff" }}
                  />{" "}
                  Back
                  </Button>
                  </span>
                )} */}
                
                {values.length === 0 ? (
                  <p className='w-100 text-center fs-1' style={{color:'#8ba4da'}}>
                    You have not selected any overheads 
                  </p>
                  ) : (
                    <span className="ms-auto mt-4">
                    <Button
                      onClick={handleNext}
                      className="float-end btn btn-warning text-white"
                      type="">
                      Next{" "}
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        style={{ color: "#ffffff" }}
                      />
                    </Button>
                  </span>
                  )}  
              </Col>
            </Row>
            </Container>
            ): (
            <p style={{
              fontSize: '24px',
              textAlign: 'center',
              width: '100%',
              marginTop: '20px',
            }}>
              Loading...
            </p> )}
            
            
            
          </div>
        </Container>
      )}
      {advertising && (
        <Advertising
          onHandleClick={() => setAdvertising(false)}
          selected={values}
          processBuilder={processBuilder}
        />
      )}

      {/* Modal for adding a new category */}
      {/* <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button
            variant=""
            style={{
              background: "#FCA311",
              color: "white",
            }}
            onClick={handleSaveCategory}>
            Save Category
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default Overheads;