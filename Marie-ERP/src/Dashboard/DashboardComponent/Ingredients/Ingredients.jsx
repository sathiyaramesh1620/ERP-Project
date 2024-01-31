import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import loader from "/assets/loader.svg";
import { UserContext } from "../../../Context/UserContext";
import "./Ingredient.css";
import { IngredientsDataContext } from "./IngredienstsContext";
import { Link } from "react-router-dom";

const Ingredients = () => {
  const { user } = useContext(UserContext);
  const { selectedIngredients, setSelectedIngredients } = useContext(
    IngredientsDataContext
  );
  const [data, setData] = useState({
    Ingredients: [
      "Vegetables",
      "Powders",
      "Spices",
      "Lentils",
      "Meats",
      "Seafoods",
      "Oils",
      "Fruits",
      "Rice",
      "Flour",
      "Dairy",
      "Sauces",
      "Beverages",
      
    ],
    Images: [
      "/ingredientsImg/1a.webp",
      "/ingredientsImg/2a.jpg",
      "/ingredientsImg/3a.jpg",
      "/ingredientsImg/4a.jpg",
      "/ingredientsImg/5a.jpg",
      "/ingredientsImg/6a.jpg",
      "/ingredientsImg/7a.jpg",
      "/ingredientsImg/8a.jpg",
      "/ingredientsImg/9a.jpg",
      "/ingredientsImg/10a.jpg",
      "/ingredientsImg/11a.jpg",
      "/ingredientsImg/12a.jpg",
      "/ingredientsImg/13a.jpg",
    ],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.post("/Marie-ERP/api/ingredients", {
  //       });
  //       console.log(response,'555');
  //       setData(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       setError(error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    // Check if there are selected ingredients in session storage
    const storedSelectedIngredients = localStorage.getItem(
      "selectedIngredients"
    );

    if (storedSelectedIngredients) {
      // If there are, update the state with the stored ingredients
      setSelectedIngredients(JSON.parse(storedSelectedIngredients));
    }
  }, [setSelectedIngredients]);

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
    console.log(selectedIngredients);
  };

  // Update session storage whenever selectedIngredients changes
  useEffect(() => {
    localStorage.setItem(
      "selectedIngredients",
      JSON.stringify(selectedIngredients)
    );
  }, [selectedIngredients]);

  
  return (
    <>
      {loading ? (
        <img src={loader} alt="Loading..." />
      ) : (
        <>
          <div className="">
          
         
            <div className="d-flex justify-content-between align-items-center">
              {selectedIngredients.length > 0 && (
                <>
                <div className="h4">Select the food groups used in your recipes.</div>
                <div className="mt-3" style={{marginRight : '5.5%'}}>
                <Link
                to="/dashboard/ingredients/pantry"
                className="buttonn py-2 px-3 p-3 rounded-2 text-decoration-none text-light "
                style={{backgroundColor : '#14213d'}}>
                Next
              </Link></div></>
              )}
              
            </div>
            {selectedIngredients.map((el) => (
              <Button key={el} variant="secondary" className=" d-inline m-1">
                {el}
              </Button>
            ))}
        
          <Row className="mt-2 d-flex justify-content-start ">
          {data.Ingredients?.map((el, i) => {
          const isSelected = selectedIngredients.includes(el);
          const isSundry = el === 'Sundry';
          return (
            <Col
              key={i}
              xs={5}
              sm={5}
              md={5}
              lg={2}
              onClick={() => {
                handleIngredientSelect(el);
              }}
              className={`cat-card m-2 mx-3 my-3 shadow-lg p-0 rounded-4 ${isSundry ? 'sundry-hover' : ''}`}
              style={{borderColor : '#002161'}}
              title={isSundry ? "" : ""}>
              <div class="card bg-dark h-100 w-100 border-0">
                
                <img
                  class="card-img h-100 w-100"
                  src={data.Images[i]}
                  alt="Card image"

                  // style={{objectFit: 'cover'}}
                />
                <div class="card-img-overlay">
                  <h5 class="cat-card-title text-start fw-medium " style={{color : '#002161'}}>{el}</h5>
                  <div className="cat-card-dark-bg" />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0.3 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className={`cat-card-select `}>
                      <button className="btn p-1" style={{backgroundColor : '#002161'}}>
                      <i
                        className="fa-solid fa-check fa-xl"
                        style={{ color: "white" }}></i></button>
                    </motion.div>
                  )}
                </div>
              </div>
            </Col>
          );
        })}
          </Row>  </div>
        </>
      
        
      )} 
    
   
    
      {/* {loading ? (
        <img src={loader} alt="Loading..." />
      ) : (
        <>
          <div className="">
            <div className=" d-flex justify-content-between align-items-center">
              {selectedIngredients.length > 0 && (
                <>
                  <div className="h4">
                    Select the food groups used in your recipes.
                  </div>
                  <div className="mt-3" style={{ marginRight: "5.5%" }}>
                    <Link
                      to="/dashboard/ingredients/pantry"
                      className="buttonn py-2 px-3 p-3 rounded-2 text-decoration-none text-light "
                      style={{ backgroundColor: "#14213d" }}
                    >
                      Next
                    </Link>
                  </div>
                </>
              )}
            </div>
            {selectedIngredients.map((el) => (
              <Button key={el} variant="secondary" className=" d-inline m-1">
                {el}
              </Button>
            ))}
          </div>
          {/* justify-content-center- class added by raja *
          <Row className="mt-2 d-flex justify-content-center">
            {data.Ingredients?.map((el, i) => {
              const isSelected = selectedIngredients.includes(el);
              const isSundry = el === "Sundry";
              return (
              
                <Col
                  key={i}
                  xs={10}
                  sm={8}
                  md={5}
                  lg={2}
                  onClick={() => {
                    handleIngredientSelect(el);
                  }}
                  className={`cat-card m-2 mx-3 my-3 shadow-lg p-0 rounded-4 ${
                    isSundry ? "sundry-hover" : ""
                  }`}
                  style={{ borderColor: "#002161" }}
                  title={isSundry ? "" : ""}
                >
                  <div class="card bg-dark h-100 w-100 border-0">
                    <img
                      class="card-img h-100 w-100"
                      src={data.Images[i]}
                      alt="Card image"
                    />
                    <div class="card-img-overlay">
                      <h5
                        class="cat-card-title text-start fw-medium "
                        style={{ color: "#002161" }}
                      >
                        {el}
                      </h5>
                      <div className="cat-card-dark-bg" />
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0.3 }}
                          animate={{ scale: 1 }}
                          className={`cat-card-select `}
                        >
                          <button
                            className="btn p-1"
                            style={{ backgroundColor: "#002161" }}
                          >
                            <i
                              className="fa-solid fa-check fa-xl"
                              style={{ color: "white" }}
                            ></i>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </>
      )} */}
     </>
  );
};

export default Ingredients;
