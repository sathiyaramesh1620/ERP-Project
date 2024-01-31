import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, OverlayTrigger, Tooltip, Container, Modal } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import LabourContextHelper from '../Hooks/LabourContextHelper'
import { LaboursDataContext } from '../LaboursContext';


function EditRestDaysCopy() {
  const {restDates, setRestDates, restDayCount, setRestDayCount, setMonth, setYear}=LabourContextHelper()
  const {
    restDays,
    setRestDays,
    userDefineDays,
    setUserDefineDays,
    selectedDate,
    setSelectedDate,
    employeeId,
  } = useContext(LaboursDataContext);
  const [show, setShow] = useState(true);
  // const [isCalendarVisible, setCalendarVisible] = useState(false);
  // const [isUserDefineSelected, setUserDefineSelected] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const [restDays, setRestDays] = useState([]);
  // const [userDefineDays,  setUserDefineDays] = useState([]);

  // console.log(restDates, 'restDates');
  // console.log(restDayCount, 'restCount');


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

  const totalRestDays = restDays.length;
  const dayMonthYearStyles = {
    backgroundColor: selectedDate ? '#FFD555' : 'transparent',
    color: selectedDate ? '#002060' : 'white',
    padding: '2px',
  };
  useEffect(()=>{
    handleWeekendSelection();
  },[])

  useEffect(() => {
  

    const formattedRestDays = restDays.map(day =>
      day.toISOString().split('T')[0]
    );
  
    // Send the formattedRestDays array to the backend
    console.log(formattedRestDays[0]?.split('-')[0]);
    console.log(formattedRestDays[0]?.split('-')[1]);

    const fullMonth = restDays[0]?.toLocaleString('en-US', { month: 'long' });

    setMonth(fullMonth);
    setYear(formattedRestDays[0]?.split('-')[0])
    setRestDates(formattedRestDays)
    setRestDayCount(formattedRestDays.length)
  }, [restDays])
   
    
 

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
                // setUserDefineSelected(false);
                handleWeekendSelection();
                // setCalendarVisible(true);
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
                // setUserDefineSelected(true);
                // setCalendarVisible(true);
              }}>
              User Define
            </button>
          </div>
          {/* <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="calendar-tooltip">Toggle Calendar</Tooltip>}>
             <FontAwesomeIcon
              className="text-primary-emphasis fs-1 mt-3"
              style={{ cursor: "pointer" }}
              icon={faCalendarAlt}
              onClick={() => {
                setCalendarVisible(!isCalendarVisible);
                if (show) {
                  handleWeekendSelection();
                } else {
                  setRestDays([]);
                }
              }}
            />
          </OverlayTrigger> */}

          {/* {isCalendarVisible && ( */}
          <>
            <Row>
              <Col className="d-flex justify-content-end">
                <button className="btn fs-2">
                  {/* <i className="fa-regular fa-pen-to-square"></i> */}
                </button>
                <button className="btn fs-2">
                  {/* <i className="fa-regular fa-floppy-disk"></i> */}
                </button>
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
                    {show ? (
                      <ul className="d-flex list-unstyled flex-wrap row-gap-4 column-gap-4 mt-4 ">
                        {restDays.map((day) => (
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
                        ))}
                      </ul>
                    ) : (
                      <ul className="d-flex list-unstyled flex-wrap row-gap-4 column-gap-4 mt-4 ">
                        {userDefineDays.map((day) => (
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
                    )}
                  </div>
                </Col>
              </Row>

              {/* <div>
                  {show && (
                    <button
                      className="btn fw-bold  bg-opacity-75  bg-warning bg-gradient"
                      style={{ width: "242px", border: "1px solid #002060" }}
                      onClick={() => handleWeekendSelection()}>
                      Select Weekends
                    </button>
                  )}
                </div> */}

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
                  <span style={dayMonthYearStyles}> {totalRestDays}</span> days
                </p>
              </div>
            </div>
          </>
          {/* )} */}
          {/* {isUserDefineSelected && (
            <div>
              <h6 className="fs-6 mt-5">continuation</h6>
              <p className="fs-6 mt-5">
                Input the opening balances for a new joiner or you just
                onboarded Marie ERP.
              </p>
              <p className="fs-6 mt-3">
                These balances are days remaining for the calendar year.
              </p>
              <span
                className="p-2 me-1 d-inline-block fw-medium"
                style={{ width: "120px", backgroundColor: "#CDD4EA" }}>
                Annual
              </span>
              <span
                className="p-2 d-inline-block text-end fw-light"
                style={{ width: "140px", backgroundColor: "#CDD4EA" }}>
                days
              </span>
            </div>
          )} */}
        </div>
        {/* {isCalendarVisible  && ( */}
        {console.log("employeeId :", employeeId)}
        <Row className="text-end mb-5">
          <Col>
            <Link to={`/dashboard/labour/records/e/${employeeId}`}>
              <button
                className="btn rounded-0 text-white px-4 mt-4 fs-5 mx-2 "
                style={{ backgroundColor: "#002060" }}>
                <i className="fa-solid fa-chevron-left"></i> Prev
              </button>
            </Link>

            <Link to="b">
              <button
                className="btn rounded-0 text-white px-4 mt-4 fs-5"
                style={{ backgroundColor: "#002060" }}>
                Next <i className="fa-solid fa-chevron-right"></i>
              </button>
            </Link>
          </Col>
        </Row>
        {/* )} */}
      </Container>

      {/* <Row>
    <Col></Col>
    <Col className='text-end '><Link to='b'>Next</Link></Col>
  </Row> */}
    </>
  );
}

export default EditRestDaysCopy