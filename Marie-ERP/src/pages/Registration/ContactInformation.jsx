import React, { useState, useContext } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { UserRegistrationContext } from "./RegistrationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faAddressCard,
  faPhoneVolume,
  faArrowRight,
  faArrowLeft,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { REGISTER_EMAIL_VALIDATION } from "../../API/Api";

function ContactInformation() {
  const POST_CODE_API =
    "https://app.zipcodebase.com/api/v1/search?apikey=81b4a800-4014-11ee-a4b5-adb669b8a556&";

  const [validatedField, setValidatedField] = useState({
    email: false,
    postCode: false,
  });
  const [error, setError] = useState(false);
  const [phone, setPhone] = useState(false);
  const [validated, setValidated] = useState(false);
  const { contactInformation, setContactInformation, setCurrentStep } =
    useContext(UserRegistrationContext);

  const phoneChange = (_key, value) => {
    setContactInformation({ ...contactInformation, [_key]: value });
    // if(_key=="phone" && _value.length > 10)

    if (
      value.match(
        /^((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/
      )
    ) {
      setPhone(false);
    } else {
      setPhone(true);
    }
  };

  const handleChange = (_key, _value) => {
    console.log(_value);
    console.log(contactInformation.pincode);
    setContactInformation({ ...contactInformation, [_key]: _value });
  };

  const onChange = (_key, _value) => {
    setContactInformation({ ...contactInformation, [_key]: _value });
    if (_value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const PostCodeValidation = (code) => {
    if (code.length < 5) {
      setValidatedField({ ...validatedField, postCode: true });
    } else if (code.length === 5) {
      axios.get(`${POST_CODE_API}codes=${code}&country=MY`).then((response) => {
        if (response.data.results[code]) {
          setContactInformation({
            ...contactInformation,
            state: response.data.results[code][0].state,
            country: "Malaysia",
          });
          setValidatedField({ ...validatedField, postCode: false });
        }
      });
    } else if (code.length === 6) {
      axios
        .get(`${POST_CODE_API}codes=${code}&country=IN`)
        .then((response) => {
          if (response.data.results[code]) {
            setContactInformation({
              ...contactInformation,
              state: response.data.results[code][0].state,
              country: "India",
            });
            setValidatedField({ ...validatedField, postCode: false });
          }
        })
        .catch((err) => {
          setValidatedField({ ...validatedField, postCode: true });
        });
    } else {
      setValidatedField({ ...validatedField, postCode: true });
    }
  };

  const emailValidation = (emailVal) => {
    axios
      .post('/Marie-ERP/api/email_validation',{
        email: emailVal,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data.status)
        if (res.data.status === 200) {
          setValidatedField({ ...validatedField, email: false });
        }
        else {
          setValidatedField({ ...validatedField, email: true });
        }
      })
      .catch((err) => {
        console.log(err)
        
      });
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || phone || error) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setCurrentStep(3);
    }
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} className='justify-content-center'>
      <Row className="mb-3 w-70 xs-w-90">
        <div className=" form_label-1">
          <span
            className=" p-1 rounded me-2 vh-1 pt-0 pb-0"
            style={{ height: "1px", background: "#14213D" }}></span>
          Contact Information
        </div>
        
        <Form.Group
          as={Col}
          xs={12}
          sm={12}
          md={5}
          className="mt-5 me-5 position-relative">
          <Form.Label>Email</Form.Label>

          <Form.Control
            required
            type="email"
            isInvalid={validatedField.email || error}
            defaultValue={contactInformation.email}
            onChange={(e) => {
              onChange("email", e.target.value);
              emailValidation(e.target.value)
            }}
            onBlur={(e) => {
              onChange("email",  e.target.value)
            }}
            // onBlur={(e) => {
            //   axios
            //     .post(REGISTER_EMAIL_VALIDATION, {
            //       email: e.target.value,
            //     })
            //     .then((res) => {
            //       console.log(res);
            //       if (res.data.status === 200) {
            //         setValidatedField({ ...validatedField, email: false });
            //       }
            //       else {
            //         setValidatedField({ ...validatedField, email: true });
            //       }
            //     })
            //     .catch((err) => {
            //       setValidatedField({ ...validatedField, email: true })
            //     });
                
            // }}
            style={{ paddingLeft: "40px", textTransform: "lowercase" }}
          />

          <span
            style={{
              position: "absolute",
              top: "70%",
              transform: "translateY(-50%)",
              left: "26px",
              fontSize: "19px",
            }}>
            <FontAwesomeIcon icon={faEnvelope} />
          </span>

          {validatedField.email ? (
            <p className="text-danger" style={{ position: "absolute" }}>
              Email already exist
            </p>
          ) : error ? (
            <p className="text-danger" style={{ position: "absolute" }}>
              Enter a valid email
            </p>
          ) : null}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={12}
          sm={12}
          md={5}
          className="mt-5 position-relative ">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            required
            isInvalid={phone}
            type="number"
            minLength={4}
            maxLength={10} // Set the maximum length to 10 characters
            defaultValue={contactInformation.phone}
            onChange={(e) => phoneChange("phone", e.target.value)}
            style={{ paddingLeft: "40px" }}
          />
          {phone ? (
            <p className="text-danger mt-0 " style={{ position: "absolute" }}>
              Enter a valid phone number
            </p>
          ) : null}

          <span
            style={{
              position: "absolute",
              top: "70%",
              transform: "translateY(-50%)",
              left: "26px",
              fontSize: "19px",
            }}>
            <FontAwesomeIcon icon={faPhone}/>
          </span>
        </Form.Group>

        <Form.Group as={Col} xs={12} sm={12} md={5} className="mt-5 me-5">
          <Form.Label>Country</Form.Label>
          <Form.Select
            required
            type="text"
            onChange={(e) => handleChange("country", e.target.value)}
            value={contactInformation.country}>
            <option value="India">India</option>
            <option value="Malaysia">Malaysia</option>
          </Form.Select>
        </Form.Group>

        <Form.Group
          as={Col}
          xs={12}
          sm={12}
          md={5}
          className="mt-5  position-relative ">
          <Form.Label>F&B Address</Form.Label>
          <Form.Control
            required
            type="text"
            minLength="8"
            maxLength="100"
            defaultValue={contactInformation.address}
            onChange={(e) => handleChange("address", e.target.value)}
            style={{ paddingLeft: "40px" }}
          />
          <span
            style={{
              position: "absolute",
              top: "70%",
              transform: "translateY(-50%)",
              left: "26px",
              fontSize: "19px",
            }}>
            <FontAwesomeIcon icon={faAddressCard} />
          </span>
        </Form.Group>
        <Form.Group as={Col} xs={12} sm={12} md={5} className="mt-5 me-5">
          <Form.Label>Postcode</Form.Label>
          <Form.Control
            required
            type="number"
            isInvalid={validatedField.postCode}
            defaultValue={contactInformation.pincode}
            onChange={(e) => {
              handleChange("pincode", e.target.value);
              PostCodeValidation(e.target.value);
            }}
            onBlur={(e) => {
              handleChange("pincode", e.target.value);
            }}
          />
          <Form.Control.Feedback
            type="invalid"
            style={{ position: "relative" }}>
            Invalid Postcode
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} xs={12} sm={12} md={5} className="mt-5  ">
          <Form.Label>State</Form.Label>
          <Form.Control
            required
            type="text"
            defaultValue={contactInformation.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row className="my-5">
        <Col className="d-flex">
          <Button
            className="btn-2 border-secondary"
            onClick={() => {
              setCurrentStep(1);
            }}>
            {" "}
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ color: "#ffffff" }}
            />{" "}
            Back{" "}
          </Button>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button
            className="btn text-white"
            type="submit"
            style={{ backgroundColor: "#FCA311" }}>
            Next{" "}
            <FontAwesomeIcon icon={faArrowRight} style={{ color: "#ffffff" }} />{" "}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ContactInformation;

