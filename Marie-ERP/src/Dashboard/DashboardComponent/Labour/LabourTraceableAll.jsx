import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import axios from "axios";

function LabourTraceableAll() {
  const { user, commonApi } = useContext(UserContext);
  const { id } = useParams();

  const [traceable, setTraceable] = useState();

  // console.log(commonApi);
  const fetchUser = async () => {
    await axios
      .post("/Marie-ERP/api/fetchLabour", {
        userId: user.userId ? user.userId : 3,
        employeeId: id,
      })
      .then((response) => {
        console.log(
          "Traceable fetchLabour response : ",
          response
        );
        setTraceable(response.data.data[0]);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUser();
  }, [id, user.userId]);


  // traceables: {
  //           permit: 2,
  //           bonus: 2,
  //           epf: 2,
  //           socso: 2,
  //           eis: 2,
  //           medical: 2,
  //           insurance: 2,
  //           others: 2
  //         },
console.log(traceable)
  return (
    <>
      <div className="container mt-5">
        <h1>Traceable</h1>
        <div>
          <p>
            Traceable includes costs in association with employment such as
            permits,bonuses,medical etc.
          </p>
        </div>

        <Row className="mb-3">
          <Col className="text-center border py-3 me-3">
            Monthly Salary
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.salary}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
          <Col className="text-center border py-3 me-3">
            Bonuses
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.traceables?.bonus}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
          <Col className="text-center border py-3 me-3">
            EPF – Employer
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.traceables?.epf}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-center border py-3 me-3">
            SOCSO - Employer
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.traceables?.socso}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
          <Col className="text-center border py-3 me-3">
            EIS - Employer
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.traceables?.eis}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
          <Col className="text-center border py-3 me-3">
            Medical
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.traceables?.medical}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
        </Row>
        <Row>
          <Col className="text-center border py-3 me-3">
            Insurance
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.traceables?.insurance}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
          <Col className="text-center border py-3 me-3">
            Others
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.traceables?.others}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
          <Col className="text-center border py-3 me-3">
            Traceable
            <br />
            <span style={{ color: "#a56464", fontSize: "19px" }}>
              {traceable?.traceable}
            </span>{" "}
            <span
              style={{
                fontSize: "12px",
                color: "gray",
              }}>{`${commonApi.currency}`}</span>
          </Col>
        </Row>
        <Row className="text-end">
          <Col>
            <Link to="/dashboard/labour/records">
              <button
                className="btn rounded-0 text-white px-4 mt-4 fs-5"
                style={{ backgroundColor: "#002060" }}>
                Close
                {/* <i className="fa-solid fa-chevron-right"></i> */}
              </button>
            </Link>
          </Col>
        </Row>
      </div>
      {/* <Col className='text-end '><Link to='la'>Next</Link></Col> */}
    </>
  );
}

export default LabourTraceableAll;
