import React, { useContext } from "react";
import CurrentStep from "./CurrentStep";
import ProgresBar from "./ProgresBar/ProgresBar";
import { Col, Container, Row } from "react-bootstrap";
import { UserRegistrationContext } from "./RegistrationContext";

const Registration = () => {
  const { currentStep } = useContext(UserRegistrationContext);

 
  return (
    <section className="main-container">
      <div className="NavBar container-fluid shadow d-flex justify-content-between align-items-center py-2">
        {/* <div className="img-container d-flex justify-content-between align-items-center py-2">
          <img
            src="/Restaruntlogo.jpg"
            alt="Logo"
            style={{ width: "60px", height: "50px", borderRadius: "10px" }}
          />
          <div style={{ marginRight: "auto" }} className="ms-3">
            <span className="d-block fw-bolder fs-4">MARIE</span>
            ERP
          </div>
          <div>
            <div>Let's Make It Happen Together!</div>
          </div>
        </div> */}
        <img
          src="/fork-spoon.png"
          alt="Logo"
          style={{
            width: "60px",
            height: "50px",
            borderRadius: "10px",
            padding: "5px",
          }}
        />
        <div className="d-flex flex-column align-items-center fw-bold pe-5">
          <span>MARIE</span>
          <span style={{ fontSize: ".8rem" }}>ERP</span>
        </div>
        <div></div>
      </div>
      <Container>
        {/* <div className="text-center   fs-3 fw-bold  mt-4 ">
          Register
        </div> */}
        <Row
          style={{
            minHeight: "90vh",
          }}>
          <Col sm={12} className="mt-5">
            <ProgresBar currentStep={currentStep} />
          </Col>
          <Col xs={12} sm={12}>
            <CurrentStep _step={currentStep} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Registration;
