import React, { useContext, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../../Context/UserContext";
import LabourContextHelper from "../Hooks/LabourContextHelper";

function LabourCreate() {
  const { commonApi} = useContext(UserContext)
  const {
    setName,
    setFullTime,
    fulltime,
    setForeigner,
    setSalary,
    setProductivity,
    name,
    foreigner,
    salary,
    productivity,
  } = LabourContextHelper();

  const navigate = useNavigate();

  console.log(fulltime, "fulltime");

  const handleNext = () => {
    {
      name && fulltime && foreigner && productivity && salary
        ? navigate("r")
        : toast.error("Please fill all the fields", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
    }
  };
  return (
    <>
      <p className="fs-3">Add a name</p>
      <p>Describe your new F&B worker.</p>

      <Row className="mt-5">
        <Col>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>Full Time</Form.Label>
            <Form.Select
              onChange={(e) => setFullTime(e.target.value)}
              value={fulltime}>
              <option>select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Form.Group>
            <Form.Label>Foreigner</Form.Label>
            <Form.Select
              onChange={(e) => setForeigner(e.target.value)}
              value={foreigner}>
              <option>select a option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>
                  Productive Hours (per day and excluding breaks)
                </Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setProductivity(e.target.value)}
                  value={productivity}
                />
              </Form.Group>
            </Col>
            <Col lg={4} className="pt-5">
              <span>hours</span>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Monthly Salary</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setSalary(e.target.value)}
                  value={salary}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Currency</Form.Label>
                <Form.Control readOnly type="text" value={commonApi.currency} />
              </Form.Group>
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>

      <Row className="text-end mb-5">
        <Col>
          <button
            onClick={handleNext}
            className="btn rounded-0 text-white px-4 mt-4 fs-5"
            style={{ backgroundColor: "#002060" }}>
            Next <i className="fa-solid fa-chevron-right"></i>
          </button>
        </Col>
      </Row>

      {/* <Row>
        <Col></Col>
        <Col className='text-end '><Link to='r'>Next</Link></Col>
    </Row> */}
      <ToastContainer />
    </>
  );
}

export default LabourCreate;
