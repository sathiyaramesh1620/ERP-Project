import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./ProcessBuilder.css";
import { Row, Col, Button, Modal, Table } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../../Context/UserContext";

export default function ProcessBuilder() {
  const [allInputData, setAllInputData] = useState([null]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const {user} = useContext(UserContext)
  // this is final value
  const [newValue, setNewValue] = useState({});


  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    axios
      .post("/Marie-ERP/api/processBuilder/init", {
        userId: user.userId ? user.userId : 3,
        month: "January",
        year: "2024",
      })
      .then((response) => {
        console.log(response, 'process builder');
        setAllInputData(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);
  // console.log(allInputData);

  const handleDivClick = (divId) => {
    const targetDiv = document.getElementById(divId);
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelect = (category, item) => {
    const selectedItem = `${category} - ${item}`;
    const index = selectedItems.indexOf(selectedItem);
    if (index === -1) {
      setSelectedItems([...selectedItems, selectedItem]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

   const handleSelec = (selectData, value) => {
     setNewValue((prevValue) => {
       if (prevValue[selectData]) {
         const updatedArray = prevValue[selectData].includes(value)
           ? prevValue[selectData].filter((item) => item !== value)
           : [...prevValue[selectData], value];

         return {
           ...prevValue,
           [selectData]: updatedArray.length > 0 ? updatedArray : undefined,
         };
       } else {
         return {
           ...prevValue,
           [selectData]: [value],
         };
       }
     });
   };
  //console.log("newValue :", newValue);


  console.log({data : {
    activity : [allInputData.activities],
    values : {newValue}
  }});
  const handleSubmit = () => {
    axios.post('/Marie-ERP/api/processBuilder/sav', {
      data : {
        activity : [allInputData.activities],
        values : {newValue}
      }
    })
  }

  return (
    <>
      <div className="text-end d-flex justify-content-end mx-3 mt-2 mb-0">
        <Button variant="success mx-3" onClick={handleSubmit}>
          Save
        </Button>
        <Link to="/dashboard/settings">
          <button className="btn btn-danger">
            <i
              className="fa-sharp fa-solid fa-xmark fa-xl"
              style={{ color: "#ffffff" }}></i>
          </button>
        </Link>
      </div>
      <hr />

      <Row>
        <Col lg={9} className="scrollable-column">
          {allInputData && allInputData.activities != null ? (
            <>
              {allInputData.activities.map((data, i) => {
                if (data) {
                  return (
                    <div key={i} id={data} className="full-page-container">
                      <div className="d-flex justify-content-between ">
                        <h3 className="mx-5">{data}</h3>
                        <button
                          className="btn btn-warning fs-5"
                          onClick={handleShow}>
                          +
                        </button>
                      </div>
                      <>
                        <h4 className="mx-4 mt-5">EXPENDITURES</h4>
                        <div className="pb-4">
                          <div className="mt-3 mx-4">
                            {selectedItems.map((selected, index) => (
                              <button
                                key={index}
                                  className={`m-2 btn btn-primary ${newValue[data] && newValue[data].includes(selected)
                                    ? "btn-success"
                                    : ""
                                }`}
                                onClick={() => handleSelec(data, selected)}>
                                {selected}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    </div>
                  );
                }
              })}
            </>
          ) : (
            <div>No data available</div>
          )}
        </Col>
        {/* container column left end */}

        {/* container column right start */}
        <Col lg={3} className="scrollable-column bg-light ">
          <div className=" mt-3">
            <h3>Activities :</h3>
            <ul>
              {allInputData.activities != null ? (
                <>
                  {allInputData.activities.map((data, i) => {
                    return (
                      <li
                        key={i}
                        style={{
                          fontWeight: "normal",
                          textDecoration: "underline",
                          listStyle: "none",
                        }}>
                        <button
                          className="btn btn-link"
                          onClick={() => handleDivClick(data)}
                          style={{ textDecoration: "none" }}>
                          {data}
                        </button>
                      </li>
                    );
                  })}
                </>
              ) : (
                <li>No data available</li>
              )}
            </ul>
          </div>
        </Col>
        {/* container column right end */}
      </Row>

      <Modal size="" scrollable show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Render categories and their items in a table structure */}
          {allInputData.categories ? (
            <>
              {Object.keys(allInputData.categories).map((category, index) => (
                <Table striped bordered hover key={index}>
                  <thead>
                    <tr>
                      <th>
                        <h3 className="">{category}</h3>
                      </th>
                      <th className="text-center">
                        <h3>Action</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInputData.categories[category].map((item, i) => (
                      <tr key={i}>
                        <td>{item}</td>
                        <td className="w-25 text-center">
                          <button
                            className={
                              selectedItems.includes(`${category} - ${item}`)
                                ? "selected btn btn-success "
                                : "select btn"
                            }
                            onClick={() => {
                              // console.log(`${category} - ${item}`);
                              handleSelect(category, item);
                            }}>
                            {selectedItems.includes(`${category} - ${item}`)
                              ? "Selected"
                              : "Select"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ))}
            </>
          ) : (
            <h3>data not exist</h3>
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

// export default ProcessBuilder;
