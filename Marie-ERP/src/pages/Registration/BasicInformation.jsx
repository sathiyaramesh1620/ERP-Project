import React, { useContext, useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { UserRegistrationContext } from "./RegistrationContext";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BasicInformation() {
  const [validated, setValidated] = useState(false);
  const {
    BasicInformation,
    setBasicInformation,
    setCurrentStep,
    userDetails,
    setUserDetails,
  } = useContext(UserRegistrationContext);

  const [otherTypes, setOtherTypes] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userplanid = searchParams.get("plan_id");
    setUserDetails({ ...userDetails, plan_id: userplanid });
  }, []);

  function handleChange(_key, _value) {
    // setBasicInformation({ ...BasicInformation, [_key]: _value });
    if (_key === "businessTypes" && _value === "Others") {
      setOtherTypes(true);
      setBasicInformation({ ...BasicInformation, businessTypes: _value });
    } else if (_key === "businessTypes") {
      setOtherTypes(false);
      setBasicInformation({
        ...BasicInformation,
        businessTypes: _value,
        otherbusinessType: "",
      });
    } else if (_key === "otherbusinessType") {
      setBasicInformation({ ...BasicInformation, otherbusinessType: _value });
    } else {
      setBasicInformation({ ...BasicInformation, [_key]: _value });
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setCurrentStep(2);
    }
    setValidated(true);
  };

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      className="d-flex justify-content-center align-items-center flex-column">
      <Row className="my-3">
        <Form.Label className="form_label  fw-medium pb-3 ">
          <span
            className=" p-1 rounded me-2 vh-1 pt-0 pb-0"
            style={{ height: "1px", background: "#14213D" }}></span>
          {"   "} Basic Information
        </Form.Label>
        <Form.Group as={Col} className="mt-3" controlId="validationCustom01">
          <Form.Label>F&B type</Form.Label>
          <Form.Select
            aria-label="select"
            onFocus={(e) => {
              handleChange("businessTypes", e.target.value);
            }}
            onChange={(e) => {
              handleChange("businessTypes", e.target.value);
            }}
            defaultValue={BasicInformation.businessTypes}>
            <option value="Restaurant">Restaurant</option>
            <option value="Cafe">Cafe</option>
            <option value="Bar">Bar</option>
            <option value="Cloud Kitchen">Cloud kitchen</option>
            <option value="Food Kiosk">Food kiosk</option>
            <option value="Others">Others</option>
          </Form.Select>
        </Form.Group>

        {otherTypes || BasicInformation.otherbusinessType ? (
          <Form.Group as={Col} className="mt-3" controlId="validationCustom02">
            <Form.Label>Enter your F&B type</Form.Label>
            <Form.Control
              required
              type="text"
              defaultValue={BasicInformation.otherbusinessType}
              onChange={(e) => {
                handleChange("otherbusinessType", e.target.value);
              }}
            />
          </Form.Group>
        ) : null}

        <Form.Group
          as={Col}
          sm={12}
          className="mt-3"
          controlId="validationCustom03">
          <Form.Label>F&B name</Form.Label>
          <Form.Control
            required
            type="text"
            defaultValue={BasicInformation.businessName}
            onChange={(e) => {
              handleChange("businessName", e.target.value);
            }}
          />
        </Form.Group>
        <div className="my-5">
          <Button
            type="submit"
            className="float-end btn btn-warning text-white"
            style={{backgroundColor:'#FCA311'}}
            >
            Next{" "}
            <FontAwesomeIcon icon={faArrowRight} style={{ color: "#ffffff" }} />
          </Button>
        </div>
      </Row>
    </Form>
  );
}

export default BasicInformation;
