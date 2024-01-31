import React, { useContext } from "react";
import OperatingHours from "./registrationComponent/OperatingHours";
import { Button, Col, Container, Row } from "react-bootstrap";
import { UserRegistrationContext } from "./RegistrationContext";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OperatingDays = () => {
  const { setCurrentStep } = useContext(UserRegistrationContext);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Container className="mx-md-5 px-md-5">
      <div className="form_label  fw-medium pb-3 ps-5">
        <span
          className=" p-1 rounded me-2 vh-1 pt-0 pb-0"
          style={{ height: "1px", background: "#14213D" }}></span>
        Operating Days
      </div>
      {days.map((days, id) => {
        return (
          <span className="">
            <OperatingHours key={id} Day={days} />
          </span>
        );
      })}

      <Row className="mt-5 px-2 mb-5">
        <Col className="d-flex gap-5 px-5">
          <Button
            className="btn-2"
            onClick={() => {
              setCurrentStep(2);
            }}>
            {" "}
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ color: "#ffffff" }}
            />{" "}
            Back{" "}
          </Button>
        </Col>
        <Col className="d-flex justify-content-end px-5">
          <Button
            className="btn text-white"
            style={{ backgroundColor: "#FCA311" }}
            onClick={() => {
              setCurrentStep(4);
            }}
            type="submit">
            Next{" "}
            <FontAwesomeIcon icon={faArrowRight} style={{ color: "fffff" }} />{" "}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default OperatingDays;
  // return (
  //   <div>
  //     <div className="d-flex justify-content-center align-items-center ">
  //       <Container className="mx-5 px-5">
  //         <div className="form_label  fw-medium pb-3 ps-5">
  //           <span
  //             className=" p-1 rounded me-2 vh-1 pt-0 pb-0"
  //             style={{ height: "1px", background: "#14213D" }}></span>
  //           Operating Days
  //         </div>
  //         {days.map((days, id) => {
  //           return (
  //             <span className="">
  //               <OperatingHours key={id} Day={days} />
  //             </span>
  //           );
  //         })}

  //         <Row className="mt-5 px-2 mb-5">
  //           <Col className="d-flex gap-5 px-5">
  //             <Button
  //               className="btn-2"
  //               onClick={() => {
  //                 setCurrentStep(2);
  //               }}>
  //               {" "}
  //               <FontAwesomeIcon
  //                 icon={faArrowLeft}
  //                 style={{ color: "#ffffff" }}
  //               />{" "}
  //               Back{" "}
  //             </Button>
  //           </Col>
  //           <Col className="d-flex justify-content-end px-5">
  //             <Button
  //               className="btn text-white"
  //           style={{backgroundColor:'#FCA311'}}
  //               onClick={() => {
  //                 setCurrentStep(4);
  //               }}
  //               type="submit">
  //               Next{" "}
  //               <FontAwesomeIcon
  //                 icon={faArrowRight}
  //                 style={{ color: "fffff" }}
  //               />{" "}
  //             </Button> 
  //           </Col>
  //         </Row>
  //       </Container>
  //     </div>
  //   </div>
  // );
// };

// export default OperatingDays;
