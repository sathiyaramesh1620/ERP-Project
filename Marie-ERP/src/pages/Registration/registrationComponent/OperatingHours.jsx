import React, { useContext, useEffect, useState } from "react";
import {
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { UserRegistrationContext } from "../RegistrationContext";
import AdditionalOperatingHours from "./AdditionalOperatingHours";

const OperatingHours = ({ Day,key }) => {
  const { operatingDays, setOperatingDays } = useContext(
    UserRegistrationContext
  );

  const AddHoursId = new Date();
  const [values, setValues] = useState([]);

  const [fielData, setFieldData] = useState({
    id: 0,
    start: "",
    end: "",
  });

  function handleAdd() {
    setValues([...values, AddHoursId]);
  }

  function handleDelete(_data) {
    setValues(values.filter((data) => data !== _data));
  }

  function handleChange(_key, _value) {
    setFieldData({ ...fielData, [_key]: _value });
    // setOperatingDays({...operatingDays, [Day] : addDataInContext()})
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
    addOrChangeObject(Day, fielData);
  }, [fielData]);


  return (
    <Form className="mx-md-5 px-lg-5 px-3 border border-3 rounded-3 my-3">
      <Form.Group>
        <Row className="py-3">
          <Col
            className="d-flex justify-content-lg-start justify-content-center mb-2 align-items-center"
            sm={12}
            lg={3}>
            <Form.Check // prettier-ignore
              id={Day}
              label={Day}
              key={key}
            />
          </Col>
          <Col lg={9} sm={12}>
            <Row>
              <Col
                className="d-flex justify-content-center align-items-center flex-column mx-2"
                xs={5}
                lg={4}>
                <Form.Label
                  className="text-secondary fw-light mx-auto"
                  style={{
                    marginBottom: "2px",
                    zIndex: 99,
                    marginLeft: "-30px",
                  }}>
                  Start at
                </Form.Label>
                <Form.Control
                  required
                  type="time"
                  className="border text-secondary text-center"
                  style={{
                    fontSize: '14px'
                  }}
                  defaultValue={
                    operatingDays[Day][0]
                      ? operatingDays[Day][0].start
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
                className="d-flex justify-content-center align-items-end pb-3 ms-1"
                xs={1}
                lg={2}>
                <span>to</span>
              </Col>
              <Col
                className="d-flex justify-content-center align-items-center flex-column"
                xs={5}
                lg={4}>
                <Form.Label
                  className="text-secondary fw-light mx-auto"
                  style={{
                    marginBottom: "2px",
                    zIndex: 99,
                    marginLeft: "-55px",
                  }}>
                  End at
                </Form.Label>
                <Form.Control
                  required
                  type="time"
                  className="border text-secondary text-center mx-auto text-sm"
                  style={{
                    fontSize: '14px'
                  }}
                  defaultValue={
                    operatingDays[Day][0] ? operatingDays[Day][0].end : "00:00"
                  }
                  onBlur={(e) => {
                    handleChange("end", e.target.value);
                  }}
                  onChange={(e) => {
                    handleChange("end", e.target.value);
                  }}
                />
              </Col>
              <Col
                className="d-flex justify-content-center align-items-end pb-2"
                sm={12}
                lg={1}>
                <div className="btn" onClick={handleAdd}>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip`}>
                        Add Break <strong></strong>
                      </Tooltip>
                    }>
                    <i className="fa-solid fa-plus"></i>
                  </OverlayTrigger>
                </div>
              </Col>
            </Row>

            {values &&
              values.map((data, i) => {
                return (
                  <AdditionalOperatingHours
                    key={i}
                    handleDelete={handleDelete}
                    data={data}
                    day={Day}
                    id={i}
                  />
                );
              })}
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
  // return (
  //   <div>
  //     <Form className="mx-md-5 px-md-5 border border-3 rounded-3 mt-2" xs={12}>
  //       <Form.Group className="">
  //         <Row className="py-3">
  //           <Col 
  //             className="d-flex justify-content-start align-items-center"
  //             sm={12}
  //             lg={3}>
  //             <Form.Check // prettier-ignore
  //               id={Day}
  //               label={Day}
  //               key = {key}
  //             /> 
               
  //           </Col>
  //           <Col>
  //             <Row>
  //               <Col className="d-flex justify-content-center align-items-center flex-column"
  //               sm={12}
  //               lg={3}>
  //                 <Form.Label
  //                   className="text-secondary fw-light text-center mx-auto  "
  //                   style={{ marginBottom: "2px", zIndex: 99 ,marginLeft:"-30px"}}
  //                 >
  //                   Start at
  //                 </Form.Label>
  //                 <Form.Control
  //                   required
  //                   type="time"
  //                   className="border text-secondary text-center"
  //                   defaultValue={
  //                     operatingDays[Day][0]
  //                       ? operatingDays[Day][0].start
  //                       : "00:00"
  //                   }
  //                   onChange={(e) => {
  //                     handleChange("start", e.target.value);
  //                   }}
  //                   onBlur={(e) => {
  //                     handleChange("start", e.target.value);
  //                   }}
  //                 />
  //               </Col>
  //               <Col className="d-flex justify-content-center align-items-end pb-3 ms-1">
  //                 <span>to</span>
  //               </Col>
  //               <Col className="d-flex justify-content-center align-items-center flex-column">
  //                 <Form.Label
  //                   className="text-secondary fw-light mx-auto"
  //                   style={{ marginBottom: "2px", zIndex: 99 ,marginLeft : "-55px"}}
  //                 >
  //                   End at
  //                 </Form.Label>
  //                 <Form.Control
  //                   required
  //                   type="time"
                    
  //                   className="border text-secondary"
  //                   defaultValue={
  //                     operatingDays[Day][0]
  //                       ? operatingDays[Day][0].end
  //                       : "00:00"
  //                   }
  //                   onBlur={(e) => {
  //                     handleChange("end", e.target.value);
  //                   }}
  //                   onChange={(e) => {
  //                     handleChange("end", e.target.value);
  //                   }}
  //                 />
  //               </Col>
  //               <Col className="d-flex justify-content-center align-items-end pb-2">
  //                 <div className="btn" onClick={handleAdd}>
  //                   <OverlayTrigger
  //                     placement="top"
  //                     overlay={
  //                       <Tooltip id={`tooltip`}>
  //                         Add Break <strong></strong>
  //                       </Tooltip>
  //                     }
  //                   >
                     
  //                   <i className="fa-solid fa-plus"></i>
  //                   </OverlayTrigger>

  //                 </div>
  //               </Col>
  //             </Row>
  //           </Col>
  //         </Row>
  //         {values.map((data, i) => {
  //           return (
  //             <AdditionalOperatingHours
  //               key={i}
  //               handleDelete={handleDelete}
  //               data={data}
  //               day={Day}
  //               id={i}
  //             />
  //           );
  //         })}
  //       </Form.Group>
  //     </Form>
  //   </div>
  // );
};

export default OperatingHours;
