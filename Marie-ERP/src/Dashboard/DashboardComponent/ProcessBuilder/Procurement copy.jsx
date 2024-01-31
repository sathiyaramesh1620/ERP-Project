import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import ChildTable from "./child/table/ChildTable";
import SelectedItems from "./child/selectedItems/SelectedItems";
import DefaultButton from "./child/defaultButton/DefaultButton";
// import styles from "./container/ContainerComp.module.css";

export default function ProcurementC({ processbuilder }) {
  const [processBuilderOutput, setProcessbuilderOutput] = useState([{}]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const defaultResources = ["Ingredients", "Labour"];

  // pagination start
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let currentItems;
  let totalPages;

  const filteredItem = processbuilder.activities.filter(
    (data) => data !== null
  );
  currentItems = filteredItem.slice(indexOfFirstItem, indexOfLastItem);

  totalPages = Math.ceil(filteredItem.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // pagination end

  useEffect(() => {
    if (processBuilderOutput && selectedItems) {
      const updatedArray = processBuilderOutput.map((e) => {
        return { ...e, "A. PROCUREMENT": selectedItems };
      });
      setProcessbuilderOutput(updatedArray);
    }
  }, [selectedItems]);

  if (processbuilder.activities) {
    var activityCode = processbuilder.activities[0].slice(
      0,
      processbuilder.activities[0].lastIndexOf(".")
    );

    var name = processbuilder.activities[0].slice(
      processbuilder.activities[0].indexOf(" ")
    );
  }

  const handleSelect = (item, category, data) => {
    const newEntry = `${category} - ${data}`;

    setSelectedItems((prevData) => {
      const itemEntries = prevData[`${item}`] || [];

      // Check if the new entry already exists for the item
      const entryIndex = itemEntries.indexOf(newEntry);

      if (entryIndex !== -1) {
        // If the entry exists, remove it
        itemEntries.splice(entryIndex, 1);
      } else {
        // If the entry doesn't exist, add it
        itemEntries.push(newEntry);
      }
      // Update the state with the modified entries
      return {
        ...prevData,
        [`${item}`]: itemEntries,
      };
    });

    console.log("handleSelect:", item, category, data, selectedItems);
  };

  return (
    <>
      {currentItems.map((item, i) => (
        <Container
          key={i}
          className="d-flex justify-content-around"
          style={{ minHeight: "80vh", flexDirection: "column" }}>
          {/* Activity code and name table */}
          <ChildTable activityCode={activityCode} name={item} />

          <Row className="mt-5">
            <h5>RESOURCES</h5>
            <div className="d-flex gap-4 flex-wrap justify-content-center justify-content-sm-start">
              {/* default value */}
              {defaultResources.map((data,index) => (
                <DefaultButton key={index} value={data} />
              ))}

              {selectedItems[`${item}`]
                ? selectedItems[`${item}`].map((e, i) => {
                    return (
                      <>
                        <SelectedItems
                          key={i}
                          categories={e.slice(0, e.lastIndexOf("-"))}
                          type={e.slice(e.lastIndexOf("-") + 1)}
                        />
                      </>
                    );
                  })
                : ""}
            </div>
          </Row>
          <Row>
            <Col className="d-flex justify-content-between mt-5">
              {/* Modal start */}
              <button
                className={`btn btn-warning fs-5`}
                onClick={() => setShowModal(!showModal)}>
                +
              </button>
              <Modal
                size=""
                scrollable
                show={showModal}
                onHide={() => setShowModal(!showModal)}>
                <Modal.Header closeButton>
                  <Modal.Title>Categories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* Render categories and their items in a table structure */}
                  {processbuilder.categories ? (
                    <>
                      {Object.keys(processbuilder.categories).map(
                        (category, index) => (
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
                              {processbuilder.categories[category].map(
                                (data, i) => (
                                  <tr key={i}>
                                    <td>{data}</td>
                                    <td className="w-25 text-center">
                                      <button
                                        className={
                                          selectedItems[`${item}`] &&
                                          selectedItems[`${item}`].includes(
                                            `${category} - ${data}`
                                          )
                                            ? "selected btn btn-success "
                                            : "select btn"
                                        }
                                        onClick={() => {
                                          // console.log(`${category} - ${item}`);
                                          handleSelect(item, category, data);
                                        }}>
                                        {/* {console.log(
                                          "selectedItems :",
                                          selectedItems, category, data
                                        )} */}
                                        {selectedItems[`${item}`] &&
                                        selectedItems[`${item}`].includes(
                                          `${category} - ${data}`
                                        )
                                          ? "Selected"
                                          : "Select"}
                                      </button>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        )
                      )}
                    </>
                  ) : (
                    <h3>data not exist</h3>
                  )}
                </Modal.Body>
              </Modal>
              {/* Modal end */}
              {/* next button */}
              <a onClick={handleNextPage} disabled={currentPage === totalPages}>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous Page
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}>
                  Next Page
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      ))}
    </>
  );
}
