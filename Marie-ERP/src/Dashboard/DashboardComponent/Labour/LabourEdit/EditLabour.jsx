import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

import LabourContextHelper from "../Hooks/LabourContextHelper";
import { UserContext } from "../../../../Context/UserContext";
import axios from "axios";
import { LaboursDataContext } from "../LaboursContext";

function EditEditLabour() {
  const { id } = useParams();
  const { user, commonApi } = useContext(UserContext);

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
  const {
    setUserDefineDays,
    setEmpId,
    setAnnual,
    setInputValues,
    ffs,
    setffs,
  } = useContext(LaboursDataContext);

  const navigate = useNavigate();

  // const sampleData = {
  //   userId: "51",
  //   name: "onemore",
  //   fulltime: "no",
  //   foreigner: "no",
  //   salary: "3333333333333333333333",
  //   productivity: "3",
  //   activity: [
  //     { activity: "B. STORAGE", percentage: "40" },

  //     { activity: "C1.  PREPARATION - FOOD", percentage: "60" },
  //   ],
  //   restDays: [
  //     {
  //       days:[
  //         "2024-01-16",
  //         "2024-01-09",
  //         "2024-01-08",
  //       ],
  //       count: 6,
  //       month: "January",
  //       year: "2024",
  //       openingBalance: true,
  //       annual: "33",
  //       userDefined: true,
  //     },
  //   ],
  // };

  // useEffect(()=>{
  // sampleData.restDays.map((e) => {
  //   if (e.userDefined) {
  //     const conDates = e.days.map((ds)=>new Date(ds));
  //     setUserDefineDays(conDates);
  //   }
  //   console.log(e);
  // });
  // },[])

  const fetchUser = async () => {
    await axios
      .post("/Marie-ERP/api/fetchLabour", {
        userId: user.userId ? user.userId : 3,
        employeeId: id,
      })
      .then((response) => {
        console.log("edit fetchLabour response : ", response);
        setEmpId(response.data.data[0].e_id);
        setName(response.data.data[0].name);
        setFullTime(response.data.data[0].fulltime);
        setForeigner(response.data.data[0].foreigner);
        setProductivity(response.data.data[0].productivity);
        setSalary(response.data.data[0].salary);
        // setAnnual()
        response.data.data[0].activity.map((e) => {
          const [activityCode, activitaData] = e.activity.split(". ");
          setInputValues((prevalue) => ({
            ...prevalue,
            [activityCode]: parseInt(e.percentage),
          }));
        });

        const udDays = response?.data?.data[0]?.data?.days
          ?.map((uday) => {
            if (response?.data?.data[0]?.data?.userDefined) {
              console.log("i am in");
              return new Date(uday) || [];
            }
            console.log("i am out");
            return [""];
          })
          .filter(Boolean); // Filter out undefined values

          udDays !== undefined ? setUserDefineDays(udDays) : "";        

        setAnnual(response.data.data[0].annual);

        setffs({
          fulltime: response.data.data[0].fulltime,
          foreigner: response.data.data[0].foreigner,
          salary: response.data.data[0].salary,
        });
      })
      .catch((error) => console.log(error));
  };

  // console.log("ffs :", ffs);
  useEffect(() => {
    fetchUser();
  }, [
    id,
    user.userId,
    // setName,
    // setFullTime,
    // setForeigner,
    // setProductivity,
    // setSalary,
    // setInputValues,
  ]);

  // console.log(name);
  // console.log(fulltime);

  const handleNext = () => {
    if (name && fulltime && foreigner && productivity && salary) {
      navigate("/dashboard/labour/records/e/r", { replace: true });
    } else {
      toast.error("Please fill all the fields", {
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
              <option value="">select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {console.log(fulltime)}
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

export default EditEditLabour;
