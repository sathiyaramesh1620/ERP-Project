import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import LabourContextHelper from "./Hooks/LabourContextHelper";
import { LaboursDataContext } from "./LaboursContext";
import { UserContext } from "../../../Context/UserContext";
import axios from "axios";

function RestDaysHome() {
  const {
    restDates,
    setRestDates,
    restDayCount,
    setRestDayCount,
    setMonth,
    setYear,
  } = LabourContextHelper();

  const {
    userDefineDays,
    setUserDefineDays,
    userDefinedStatus,
    setuserDefinedStatus,
    empId,
    month,
    year,
    setEmpId,
  } = useContext(LaboursDataContext);

  const { user } = useContext(UserContext);
  const [show, setShow] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [restDays, setRestDays] = useState([]);

  const navigate = useNavigate();
  const {id} = useParams();

  const fetchUser = async () => {
    await axios
      .post("/Marie-ERP/api/fetchLabour", {
        userId: user.userId ? user.userId : 3,
        employeeId: id,
      })
      .then((response) => {
        console.log(
          "RestDays fetchLabour response : ",
          response.data.data[0].e_id
        );
        setEmpId(response.data.data[0].e_id);
        const udDays = response?.data?.data[0]?.data?.days
          ?.map((uday) => {
            if (response?.data?.data[0]?.data?.userDefined) {
              console.log("i am in");
              return new Date(uday) || [];
            }
            console.log("i am out");
          })
          .filter(Boolean); // Filter out undefined values

        udDays !== undefined ? setUserDefineDays(udDays) : "";
      })
      .catch((error) => console.log(error));
  };
    useEffect(() => {
      fetchUser();
    }, [id, user.userId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleWeekendSelection = () => {
    const weekends = [];
    const currentDate = new Date(selectedDate);
    currentDate.setDate(1); // Move to the first day of the month

    while (currentDate.getMonth() === selectedDate.getMonth()) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setRestDays(weekends);
  };

  useEffect(() => {
    handleWeekendSelection();
  }, []);

  const handleUserDefineSelection = (date) => {
    if (date) {
      const isDateSelected = userDefineDays.some(
        (selectedDate) => selectedDate.toDateString() === date.toDateString()
      );
      if (!isDateSelected) {
        setUserDefineDays([...userDefineDays, date]);
      } else {
        const updatedRestDays = userDefineDays.filter(
          (selectedDate) => selectedDate.toDateString() !== date.toDateString()
        );
        setUserDefineDays(updatedRestDays);
      }
    }
  };

  const dayMonthYearStyles = {
    backgroundColor: selectedDate ? "#FFD555" : "transparent",
    color: selectedDate ? "#002060" : "white",
    padding: "2px",
  };

  useEffect(() => {
    const formattedRestDays = restDays.map(
      (day) => day.toISOString().split("T")[0]
    );

    const formattedUserDefinedDays = userDefineDays.map(
      (day) => day.toISOString().split("T")[0]
    );

    const fullMonth = restDays[0]?.toLocaleString("en-US", { month: "long" });

    setMonth(fullMonth);
    setYear(
      show
        ? formattedRestDays[0]?.split("-")[0]
        : formattedUserDefinedDays[0]?.split("-")[0]
    );
    setRestDates(show ? formattedRestDays : formattedUserDefinedDays);
    setRestDayCount(
      show ? formattedRestDays.length : formattedUserDefinedDays.length
    );

    show ? setuserDefinedStatus(false) : setuserDefinedStatus(true);
  }, [restDays, userDefineDays, show]);

  const handleSubmit = async () => {
    console.log("response : ", {
      userId: user.userId ? user.userId : 5,
      employeeId: empId,
      restDays: [
        {
          days: restDates,
          count: restDayCount,
          month,
          year,
          userDefined: userDefinedStatus,
        },
      ],
    });
    await axios
      .post("/Marie-ERP/api/restDays", {
        userId: user.userId ? user.userId : 5,
        employeeId: empId,
        restDays: [
          {
            days: restDates,
            count: restDayCount,
            month,
            year,
            userDefined: userDefinedStatus,
          },
        ],
      })
      .then((response) => {
        console.log(response, "insertLabour");
        if (response.status === 200) {
          setRestDays([]);
          setUserDefineDays([]);
          setSelectedDate(new Date());
          setuserDefinedStatus(false);
          navigate("/dashboard/labour/records");
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <Container>
        <div>
          <div>
            <p className="fs-3">Restdays</p>
          </div>
          {show ? (
            <p>Decide on worker restdays schedule for the upcoming month.</p>
          ) : (
            <p>Decide on restday schedule for the upcoming month.</p>
          )}

          <div>
            <button
              className={`btn rounded-0 border border-black  ${
                show ? "text-white" : "text-black"
              }`}
              style={{ backgroundColor: show ? "#002060" : "white" }}
              onClick={() => {
                setShow(true);
                handleWeekendSelection();
              }}>
              Weekends
            </button>
            <button
              className={`btn rounded-0 border border-black ${
                show ? "text-black" : "text-white"
              }`}
              style={{ backgroundColor: show ? "white" : "#002060" }}
              onClick={() => {
                setShow(false);
                handleUserDefineSelection();
              }}>
              User Define
            </button>
          </div>
          <>
            <Row>
              <Col className="d-flex justify-content-end">
                <button className="btn fs-2"></button>
                <button className="btn fs-2"></button>
              </Col>
            </Row>
            <div>
              <Row>
                <Col>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    onSelect={
                      show ? handleWeekendSelection : handleUserDefineSelection
                    }
                    inline
                  />
                </Col>

                <Col>
                  <div className="">
                    <h2
                      className="border-bottom border-warning border-3  d-inline"
                      style={{ color: "#002026" }}>
                      Selected Rest Days:
                    </h2>
                    <ul className="d-flex list-unstyled flex-wrap row-gap-4 column-gap-4 mt-4 ">
                      {show
                        ? restDays.map((day) => (
                            <li
                              style={{ borderLeft: "5px solid #002060" }}
                              className={`bg-opacity-75 bg-warning bg-gradient p-2   ${
                                selectedDate && restDays.includes(day)
                                  ? "selected-day"
                                  : ""
                              }`}
                              key={day.toISOString()}>
                              {day.toDateString()}
                            </li>
                          ))
                        : userDefineDays.map((day) => (
                            <li
                              style={{ borderLeft: "5px solid #002060" }}
                              className={`bg-opacity-75 bg-warning bg-gradient p-2   ${
                                selectedDate && userDefineDays.includes(day)
                                  ? "selected-day"
                                  : ""
                              }`}
                              key={day.toISOString()}>
                              {day.toDateString()}
                            </li>
                          ))}
                    </ul>
                  </div>
                </Col>
              </Row>

              <div className="text-start mt-5 ">
                <p
                  className=" fw-bolder fs-5  text-center  "
                  style={{ backgroundColor: "#002060", color: "#FFD555" }}>
                  Total restdays for{" "}
                  <span style={dayMonthYearStyles}>
                    {selectedDate?.toLocaleString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <p
                  className="fw-bolder fs-5  text-center "
                  style={{ backgroundColor: "#002060", color: "#FFD555" }}>
                  <span style={dayMonthYearStyles}> {restDayCount}</span> days
                </p>
              </div>
            </div>
          </>
        </div>

        <Row className="text-end mb-5">
          <Col>
            <button
              className="btn rounded-0 text-white px-4 mt-4 fs-5"
              style={{ backgroundColor: "#002060" }}
              onClick={handleSubmit}>
              Save <i className="fa-solid fa-chevron-right"></i>
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RestDaysHome;
