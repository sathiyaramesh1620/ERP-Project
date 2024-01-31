import React, { useState, useEffect } from "react";
import { Table, Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import CostingHeader from "../CostingHeader";
import { useContext } from "react";
import { CostDataContext } from "./CostContext";
import { UserContext } from "../../../../Context/UserContext";


const General = () => {
  const { user } = useContext(UserContext);
  const {
    
    setData,
    setMonthYearr,
    servings,
    setServings,
    setFtype,
    ftype,
    costItem,
    setCostItem,
    setSalesChan, setFoodBev, selectedItem, setSelectedItem, preparation, setPreparation,
    selectedType, setselectedType,
  } = useContext(CostDataContext); // context api

  
  

  // session storage

  //getting data of sales by menu items
  useEffect(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);

    const monthYear = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(today);

    const [month, year] = monthYear.split(" ");

    console.log(month);
    setMonthYearr(monthYear);

    axios
      .post("/Marie-ERP/api/costing/init", {
        month: 'January',
        year: 2024,
        userId:  user.userId ? user.userId : '4',
      })
      .then((response) => {
        console.log(response.data.data, "** fetched Table data **");
        setSalesChan(response.data.data.salesChannel);
        setFoodBev(response.data.data)
        
        // Map the data from the API to the format expected by your table
        const mappedData = response.data.data.salesMenu.map((item) => ({
          Item: item["Item"],
          TableUnits: item["TableUnits"],
        }));

        console.log(mappedData);
        setCostItem(mappedData);
        // Set the mapped data to the salesByMenuData state
        // setSalesByMenuData(mappedData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  useEffect(() => {
    // When the component mounts, check sessionStorage for stored values and set them in the state
    const storedSelectedItem = sessionStorage.getItem("selectedItem");
    if (storedSelectedItem) {
      setSelectedItem(storedSelectedItem);
    }

    const storedPreparation = sessionStorage.getItem("preparation");
    if (storedPreparation) {
      setPreparation(storedPreparation);
    }

    const storedSelectedType = sessionStorage.getItem("selectedType");
    if (storedSelectedType) {
      setselectedType(storedSelectedType);
    }
    const storedPrep = sessionStorage.getItem("servings");
    if (storedPrep) {
      setServings(storedPrep);
    }
  }, []);

  const handleSelectedItemChange = (event) => {
    const selectedText = event.target.value;
    setSelectedItem(selectedText);
    sessionStorage.setItem("selectedItem", selectedText);
  };

  const handlePreparationChange = (event) => {
    const selectedText = event.target.value;
    setPreparation(selectedText);
    sessionStorage.setItem("preparation", selectedText);

    if (selectedText === "2") {
      // If 'Unit' is selected, clear the servings and update session storage
      setServings("");
      sessionStorage.setItem("servings", "");
    }
  };

  const handleTypeChange = (event) => {
    const selectedText = event.target.value;
    setselectedType(selectedText);
    setFtype(selectedText);
    sessionStorage.setItem("selectedType", selectedText);
  };

  const handlePrepChange = (event) => {
    const selectedText = event.target.value;
    if (preparation === 2) {
      setServings(""); // Set servings to 0 when preparation is not '1'
      sessionStorage.setItem("servings", "");
    } else {
      setServings(selectedText);
      sessionStorage.setItem("servings", selectedText);
    }
  };

  console.log(ftype);

  console.log(preparation);

  const handleNextButtonClick = () => {
    console.log("Selected Item:", selectedItem);
    console.log("Preparation1:", preparation);
    console.log("servings:", servings);
    console.log("type:", selectedType);
    // Perform other actions as needed using these values
  };

  useEffect(() => {
    setData(selectedItem);
  }, [selectedItem]);

  return (
    <>
      <section>
        <Container fluid xs={12} sm={12} md={12} lg={12}>
        <Table responsive bordered hover className="text-center shadow">
          <tbody>
            <tr>
              <th
                className="pt-3 w-25"
                style={{ backgroundColor: "#14213d", color: "white" }}>
                Name
              </th>
              <td>
                <Form.Select
                  placeholder="Select the item"
                  className="border-0"
                  style={{ height: "40px" }}
                  value={selectedItem}
                  onChange={handleSelectedItemChange}>
                  <option>Select the item</option>
                  {costItem.map((item, index) => (
                    <option key={index} value={item.Item}>
                      {item.Item}
                    </option>
                  ))}
                </Form.Select>
              </td>
            </tr>

            <tr>
              <th
                className="pt-3"
                style={{ backgroundColor: "#14213d", color: "white" }}>
                Type
              </th>
              <td>
                <Form.Select
                  aria-label="Default select example"
                  style={{ height: "40px" }}
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="border-0">
                  <option>Select the type of item</option>
                  <option value="1">Food</option>
                  <option value="2">Beverages</option>
                </Form.Select>
              </td>
            </tr>
            <tr>
              <th
                className="pt-3"
                style={{ backgroundColor: "#14213d", color: "white" }}>
                Preparation
              </th>
              <td>
                <Form.Select
                  className="border-0"
                  aria-label="Default select example"
                  value={preparation}
                  onChange={handlePreparationChange}
                  style={{ height: "40px" }}>
                  <option value="0">Select preparation type</option>
                  <option value="1">Batch</option>
                  <option value="2">Unit</option>
                </Form.Select>
              </td>
            </tr>
            {preparation === "1" && (
              <tr>
                <th
                  className="pt-3"
                  style={{ backgroundColor: "#14213d", color: "white" }}>
                  Servings
                </th>
                <td>
                  <Form.Control
                    className="border-0"
                    type="number"
                    value={servings}
                    onChange={handlePrepChange}
                    style={{ height: "40px" }}
                    //onChange={(e) => setServings(e.target.value)}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        </Container>
      </section>
      <div className="text-end mx-3 mt-5 pb-5">
        <Link to="/dashboard/cost/costsales">
          <Button
            className="float-end btn btn-warning text-white border-0 "
            // type="submit"
            onClick={handleNextButtonClick}
            style={{ width: "6rem", backgroundColor: "#fca311" }}>
            Next{" "}
            <i
              className="fa-solid fa-arrow-right"
              style={{ color: "#ffffff" }}></i>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default General;
