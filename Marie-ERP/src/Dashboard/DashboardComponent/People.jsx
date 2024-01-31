import React, { useEffect, useState } from "react";
import { Container, Modal, Button, Form, Row, Col, Tab, Tabs } from "react-bootstrap";
import axios from "axios";



const People = () => {

  const [activeTab, setActiveTab] = useState("home");

  const [LabourNames, setLabourNames] = useState([])

  const [showModal, setShowModal] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    full_time: "",
    foreigner: "",
    salary:"",
    currency:"",
    productivity: ""
    
    // Add more fields as needed
  });

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the input for the "Productivity" field
    if (name === "productivity") {
      // Parse the input as a float to allow decimal values (e.g., 5.5 hours)
      const floatValue = parseFloat(value);
      
      // Check if the value is a valid number and within the range [0, 24]
      if (!isNaN(floatValue) && floatValue >= 1 && floatValue <= 24) {
        setEmployeeData({
          ...employeeData,
          [name]: floatValue,
        });
      } else {
        // If the value is invalid, you can show an error message or handle it as needed
        // For example, you can set an error state or display an error message.
        console.log("Invalid input for productivity.");
        // Optionally, set an error state or display an error message to the user.
      }
    } else {
      setEmployeeData({
        ...employeeData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send employeeData to the backend using Axios (customize the URL).
      const response = await axios.post("/Marie-ERP/api/insertLabour", employeeData);
      console.log(employeeData)
      // Handle the response as needed (e.g., show a success message).
      console.log("Data sent to the backend:", response.data);

      // After successfully sending the data, you can close the modal.
      handleCloseModal();
    } catch (error) {
      // Handle any errors (e.g., display an error message).
      console.error("Error sending data to the backend:", error);
    }
    handleCloseModal();
    handleNextTab();
  };

  const handleNextTab = () => {
    if (activeTab === "home") {
      setActiveTab("profile");
    } else if (activeTab === "profile") {
      setActiveTab("contact");
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === "contact") {
      setActiveTab("profile");
    } else if (activeTab === "profile") {
      setActiveTab("home");
    }
  };

  useEffect(() => {
    axios.post("/Marie-ERP/api/fetchLabour", {userId : "101"})
    .then(response => {
      console.log(response.data.data);
      setLabourNames(response.data.data);
    })
  }, [])

  return (
    <>
      <Container fluid>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
      <Tab eventKey="home" title="Employees">
        <div className="pt-5">
          <button className="btn btn-info text-white" onClick={handleShowModal}>
            Add employee
          </button>
          
          <div className="pt-3">
        {LabourNames.map(Labour => (
          <li style={{listStyle : 'none'}}><button className="btn" key={Labour.id}>{Labour.name}</button></li>
        ))}
        </div>

        </div>
      </Tab>

      <Tab eventKey="profile" title="Entitlements" className="mx-3">
        <div className="pt-5">
        <h6>Annual leave</h6>
        <h6>Rest days</h6>
        <h6>Overtime</h6></div>
      </Tab>

      <Tab eventKey="contact" title="Activities">
      <div className="pt-5">
        <h6>Procurement</h6>
        <h6>Storage</h6>
        <h6>Preparation - Food</h6>
        <h6>Ordering</h6>
        </div>
      </Tab>
    </Tabs>

   
      <Row className="pt-5">
        <Col >
        <button
        className="btn btn-primary"
        onClick={handlePreviousTab}
        disabled={activeTab === "home"}
      >
        Previous
      </button>
      </Col>

      <Col className="text-end">
      <button
        className="btn btn-primary mx-2"
        onClick={handleNextTab}
        disabled={activeTab === "contact"}
      >
        Next
      </button>
      </Col>
      </Row>
  

    </Container>

{/* -------------------------------------------------------------------------------------------------------------- */}
      <Modal scrollable show={showModal} onHide={handleCloseModal} >
        <Modal.Header closeButton >
          <Modal.Title >Employee details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
          <Form onSubmit={handleSubmit}>
    
              <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="name"
                value={employeeData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
           
              
             
              <Form.Group className="pt-3">
                <Form.Label>Full Time</Form.Label>
                <Form.Select
                required
                  name="full_time"
                  value={employeeData.full_time}
                  onChange={handleInputChange}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
           

            
              <Form.Group className="pt-3">
                <Form.Label>Foreigner</Form.Label>
                <Form.Select
                required
                  name="foreigner"
                  value={employeeData.foreigner}
                  onChange={handleInputChange}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
            

           <Row>
              <Col>
                <Form.Group className="pt-3">
                  <Form.Label>Salary </Form.Label>
                  <Form.Control
                    required
                    name="salary"
                    type="number"
                    value={employeeData.salary}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="pt-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Select
                    required
                    name="currency"
                    value={employeeData.currency}
                    onChange={handleInputChange}
                    defaultValue="MYR"
                  >
                    <option value="">Select currency</option> {/* Placeholder */}
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="MYR">MYR - Malaysian Ringgit</option>
                    {/* Add more currency options as needed */}
                  </Form.Select>
                </Form.Group>
              </Col>
              </Row>

            
              <Form.Group className="pt-3">
                <Form.Label>Productivity <span className="text-secondary">(excluding break)</span></Form.Label>
                <Form.Control
                  required
                  name="productivity"
                  type="number"
                  value={employeeData.productivity}
                  onChange={handleInputChange}
                  placeholder="Enter hours"
                >
                </Form.Control>
              </Form.Group>

            <div className="pt-3 text-center">
            <Button type="submit" className="w-50">
              Create employee
            </Button></div>
          </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default People;
