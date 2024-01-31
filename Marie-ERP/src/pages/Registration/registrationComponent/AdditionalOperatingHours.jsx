import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { UserRegistrationContext } from "../RegistrationContext";

const AdditionalOperatingHours = ({ day, handleDelete, data, id }) => {
  const { operatingDays, setOperatingDays } = useContext(
    UserRegistrationContext
  );

  const [fielData, setFieldData] = useState({
    id: id + 1,
    start: "",
    end: "",
  });

  const handleChange = (_key, _value) => {
    setFieldData({ ...fielData, [_key]: _value });
    console.log(fielData, "============");
    console.log(operatingDays[day][id + 1]);
  };

  function deleteObjectById(day, idToDelete) {
    setOperatingDays((prevDays) => ({
      ...prevDays,
      [day]: prevDays[day].filter((obj) => obj.id !== idToDelete),
    }));
  }

  function addOrChangeObject(day, objectToAddOrChange) {
    setOperatingDays((prevDays) => {
      const updatedDayArray = prevDays[day].map((obj) => {
        if (obj.id === objectToAddOrChange.id) {
          return { ...obj, ...objectToAddOrChange };
        }
        return obj;
      });

      if (!updatedDayArray.find((obj) => obj.id === objectToAddOrChange.id)) {
        updatedDayArray.push(objectToAddOrChange);
      }

      return {
        ...prevDays,
        [day]: updatedDayArray,
      };
    });
  }

  useEffect(() => {
    addOrChangeObject(day, fielData);
  }, [fielData]);


  return (
    <Row className="my-3">
      <Col
        className="d-flex justify-content-center align-items-center"
        sm={12}
        lg={4}>
        <Form.Control
          required
          type="time"
          className="border text-secondary text-center"
          defaultValue={
            operatingDays[day][id + 1]
              ? operatingDays[day][id + 1].start
              : "00:00"
          }
          onChange={(e) => {
            handleChange("start", e.target.value);
          }}
          onBlur={(e) => {
            handleChange("start", e.target.value);
          }}
        />
      </Col>
      <Col
        className="d-flex justify-content-center align-items-center"
        lg={2}
        sm={12}>
        <span>to</span>
      </Col>
      <Col className="d-flex justify-content-center align-items-center" lg={4}>
        <Form.Control
          required
          type="time"
          className="border  text-secondary text-center"
          defaultValue={
            operatingDays[day][id + 1]
              ? operatingDays[day][id + 1].end
              : "00:00"
          }
          onChange={(e) => {
            handleChange("end", e.target.value);
          }}
          onBlur={(e) => {
            handleChange("end", e.target.value);
          }}
        />
      </Col>
      <Col className="d-flex justify-content-center align-items-center" lg={1}>
        <div
          className="btn"
          onClick={() => {
            handleDelete(data);
            deleteObjectById(day, fielData.id);
          }}>
          <i className="fa-solid fa-x text-danger"></i>
        </div>
      </Col>
    </Row>
  );
  // return (
  //   <Row>
  //     <Col></Col>
  //     <Col className="mb-3">
  //       <Row>
  //         <Col className="d-flex justify-content-center align-items-center">
  //           <Form.Control
  //             required
  //             type="time"
  //             className="border text-secondary"
  //             defaultValue={
  //               operatingDays[day][id + 1]
  //                 ? operatingDays[day][id + 1].start
  //                 : "00:00"
  //             }
  //             onChange={(e) => {
  //               handleChange("start", e.target.value);
  //             }}
  //             onBlur={(e) => {
  //               handleChange("start", e.target.value);
  //             }}
  //           />
  //         </Col>
  //         <Col className="d-flex justify-content-center align-items-center">
  //           <span>to</span>
  //         </Col>
  //         <Col className="d-flex justify-content-center align-items-center">
  //           <Form.Control
  //             required
  //             type="time"
  //             className="border  text-secondary"
  //             defaultValue={
  //               operatingDays[day][id + 1]
  //                 ? operatingDays[day][id + 1].end
  //                 : "00:00"
  //             }
  //             onChange={(e) => {
  //               handleChange("end", e.target.value);
  //             }}
  //             onBlur={(e) => {
  //               handleChange("end", e.target.value);
  //             }}
  //           />
  //         </Col>
  //         <Col className="d-flex justify-content-center align-items-center">
  //           <div
  //             className="btn"
  //             onClick={() => {
  //               handleDelete(data);
  //               deleteObjectById(day, fielData.id);
  //             }}>
  //             <i className="fa-solid fa-x text-danger"></i>
  //           </div>
  //         </Col>
  //       </Row>
  //     </Col>
  //   </Row>
  // );
};

export default AdditionalOperatingHours;
