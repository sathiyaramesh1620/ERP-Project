import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { UserRegistrationContext } from "./RegistrationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
//import { DineIn, FoodDeliveryPlatform, OwnPlatform, Takeaway } from "./checkboxOptions";
import CheckboxOptions from "./checkboxOptions";
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";

const OtherInformation = () => {
  const [selectItems, setSelectItems] = useState([])
  const [capacityError, setCapacityError] = useState(false)
  const [channelError, setChannelError] = useState(false)
  const [cuisineError, setCuisineError] = useState(false)
  const [Cuisine, setCuisine] = useState([
    "Indian",
    "Malaysian",
    "Chinese",
    "Thai",
    "Korean",
  ]);

  const [validated, setValidated] = useState({
    dineIn: false,
    typeOf: false,
  });

  const [channelOptions, setChannelOptions] = useState([])
  const { otherInformation, setOtherInformation, setCurrentStep } = useContext(
    UserRegistrationContext
  );

  const getCurrentDate = new Date()
  const getCurrentYear = getCurrentDate.getFullYear()
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const getCurrentMonth = months[getCurrentDate.getMonth()]

  otherInformation.currentYear = getCurrentYear
  otherInformation.currentMonth = getCurrentMonth
  
  const userData = useContext(UserRegistrationContext)
  console.log(userData)
  // console.log(Dine)
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if(isValidate()){
      setCurrentStep(5);
    }
  } 
  
  const isValidate = () => {
    let success = true
    const dineIn = otherInformation.dineInCapacity;

    if(dineIn != ''){
      setCapacityError(false)
    } else {
      setCapacityError(true)
      success = false
    }

    if(otherInformation.typeOfCuisine.length > 0){
      setCuisineError(false)
    } else {
      setCuisineError(true)
      success = false
    } 

    if(otherInformation.channels.length != 0){
      setChannelError(false)
    } else {
      setChannelError(true)
      success = false 
    }

    return success
  }
  
  const handleChange = (_key, _value) => {
    setOtherInformation({ ...otherInformation, [_key]: _value });
    otherInformation.typeOfCuisine.length >= 0 ? setCuisineError(false) : setCuisineError(true) 
    const dineIn = otherInformation.dineInCapacity;
    dineIn >= 0 ? setCapacityError(false) : setCapacityError(true)
  };

  
  function handleBlur(e) {
    const capacity = Number(e.target.value);
    capacity >= 0 ? setCapacityError(false) : setCapacityError(true)
  }

  const handleCheckboxChange = (e) => {
    let isSelected = e.target.checked;
    let value = e.target.value;
    if(isSelected === true){
      setSelectItems([...selectItems, value])
    } else {
      setSelectItems((curData) => {
        return curData.filter((curValue) => {
          return curValue !== value
        })
      })
    }
    setChannelError(false)
  }

  useEffect(() => {
    setOtherInformation({...otherInformation, channels : selectItems})
  },[selectItems])

  console.log(otherInformation)

  useEffect(() => {
    axios.post('/Marie-ERP/api/init')
    .then((response) => {
      console.log(response, 'line 129')
      setChannelOptions(response.data.data)
    })
    .catch((error) => {
      console.log(error)
    })
  },[])

  
  console.log(channelOptions, 'Channel Options')

  return (
    <div className="d-flex justify-content-center pb-5 overflow-y-auto">
      <Form onSubmit={handleSubmit} className="w-75">
        <div className="form_label  fw-medium pb-3">
          <span
            className=" px-1 rounded me-2"
            style={{ background: "#14213D" }}></span>
          Other Information
        </div>
        <Form.Group className="mt-3">
          <Form.Label>Dine-in capacity</Form.Label>
          <Form.Control
            minLength={1}
            type="number"
            placeholder="Enter 0 if no customer seating is available"
            onChange={(e) => handleChange("dineInCapacity", e.target.value)}
            value={otherInformation.dineInCapacity}
            onBlur={(e) => handleBlur(e)}
            style={{
              color: "#757575",
            }}
          />
          {capacityError && (
            <p className="fs-6 mt-1 text-danger" style={{position:'relative'}}>Invalid Entry</p>
          )}
        </Form.Group>
        {/* <Form.Group className='mt-3'>
          <Form.Label>Type of Cuisine</Form.Label>
          {/* <Form.Control
            type="text"
            placeholder="Type of Cuisine"
            onInput={(e) => handleChange("typeOfCuisine", e.target.value)}
            defaultValue={otherInformation.typeOfCusine}
          /> */}

        {/* <Form.Select aria-label="select" onChange={(e) => { handleChange("typeOfCuisine", e.target.value) }} defaultValue={otherInformation.typeOfCusine}>
            <option value="Indian">Indian</option>
            <option value="Malaysian">Malaysian </option>
            <option value="Chinese">Chinese</option>
            <option value="Thai">Thai</option>
            <option value="Korean">Korean</option>
          </Form.Select>
        </Form.Group> */}
        <Form.Group>
          <Form.Label className="form-label mt-5 ">Type of cuisine</Form.Label>

          <div className="text-dark">
            <Multiselect
              id="typ-cus"
              isObject={false}
              onRemove={(event) => {
                handleChange("typeOfCuisine", event);
              }}
              onSelect={(event) => {
                handleChange("typeOfCuisine", event);
              }}
              options={Cuisine}
              type="select"
              placeholder=""
              showCheckbox
              showArrow
              avoidHighlightFirstOption
              keepSearchTerm={true}
              selectedValues={otherInformation.typeOfCuisine}
              style={{
                searchBox: {
                  borderColor: "#dee2e6",
                },
                inputField: {
                  height: "44px",
                  marginTop: "0",
                  padding: "6px 0 6px 8px",
                },
              }}
            />
            {cuisineError && (
              <p className="fs-6 text-danger mt-1" style={{position:'relative'}}>Invalid Entry</p>
            )}
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label className='mt-5'>Select channels used to reach your customers</Form.Label>
            <Container>
              <Row className='mt-2'>
                {channelOptions.map((option, index) => (
                  <Col xs={12} key={index} className='d-flex'>
                    <Form.Check 
                      type="checkbox" 
                      className='mt-3'
                      value={option.name}
                      onChange={handleCheckboxChange}
                      checked={selectItems.includes(option.name)}
                      id={`checkbox-${index}`}
                    />
                    <label className='w-100 ms-3'>
                      <CheckboxOptions name={option.name} descript={option.description}/>
                    </label>
                    </Col>                    
                  ))}
                </Row>
            </Container>
            {channelError && (
                <p className='text-danger mt-3' style={{position:'relative'}}>Select the channels</p>  
            )}
        </Form.Group>
          <Row className="mt-5">
            <Col className="d-flex justify-content-start">
              <Button
                className="btn-2"
                onClick={() => {
                setCurrentStep(3);
                }}>
                <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ color: "#ffffff" }}
                />{" "}
                Back
              </Button>
          </Col>

          <Col className="d-flex  justify-content-end">
            <Button
              type="submit"
              className="btn text-white"
              style={{ backgroundColor: "#FCA311" }}>
              Next{" "}
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ color: "ffffff" }}
              />
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default OtherInformation;
