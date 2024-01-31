import React, { useState, useEffect, useContext } from "react";
import {
  Col,
  ListGroup,
  Row,
  Table,
  Modal,
  Button,
  Card,
  Form,
  Container,
  Offcanvas,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LaboursContext from "./LaboursContext";
import ReactPaginate from "react-paginate";
import ContentLoader from "react-content-loader";
import LabourContextHelper from './Hooks/LabourContextHelper'
import SearchImage from "/assets/line-chart.gif";
import "./labour.css";
import "chartjs-plugin-datalabels";
import { ResponsivePie } from "@nivo/pie";
import { UserContext }  from "../../../Context/UserContext";
import Nodata from "/assets/No data.gif";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Outlet } from "react-router-dom";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { LaboursDataContext } from "./LaboursContext";

function Labour() {
  const { user } = useContext(UserContext)
  const{selectedDateTravel, setSelectedDateTravel}= useContext(LaboursDataContext)
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [summary, setSummary] = useState({
    overtime : '',
    percent : '',
    restdays : [],
    working : '',
    others : [],
    otherLeaveData : [],
    restLeaveData : [],
    annualLeaveData : []
  })

  const [showOthers, setShowOthers] = useState(false);
  const handleCloseOthers = () => setShowOthers(false);
  const handleShowOthers = () => setShowOthers(true);

  const [showOthers1, setShowOthers1] = useState(false);
  const handleCloseOthers1 = () => setShowOthers1(false);
  const handleShowOthers1 = () => setShowOthers1(true);

  const [showOthers2, setShowOthers2] = useState(false);
  const handleCloseOthers2 = () => setShowOthers2(false);
  const handleShowOthers2 = () => setShowOthers2(true);


  console.log(selectedDate);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(!show);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleMonthChange = (newMonth) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newMonth);
    setSelectedDate(newDate);
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (newYear) => {
    const currentYear = new Date().getFullYear();
    const minYear = 2023;

    if (newYear >= minYear && newYear <= currentYear) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(newYear);
      setSelectedDate(newDate);
      setCurrentYear(newYear);
    }
  };


  
  const generateCalendarTable = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const rows = [];
    
    // Days of the week
    const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  
    for (let i = 0; i < daysOfWeek.length; i++) {
      const cells = [];
      const dayOfWeek = daysOfWeek[i];
  
      // Header cell with the day abbreviation
      cells.push(
        <th key={`header-${i}`} className="mt-2 bg-black text-white">
          {dayOfWeek}
        </th>
      );
  
      // Calculate the starting day of the month
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      const offset = i - firstDayOfMonth;
      
      // Cells with dates for the corresponding day
      for (let j = 1 + offset; j <= daysInMonth; j += 7) {
        const currentDate = new Date(currentYear, currentMonth, j);
        const isCurrentDate =
          currentDate.toDateString() === selectedDate.toDateString();
  
        cells.push(
          <td
            key={`${dayOfWeek}-${j}`}
            style={{
              backgroundColor: isCurrentDate ? "yellow" : "transparent",
            }}
            onClick={() => { 
              handleDateClick(currentDate)
            handleShow1() }}
          >
            {j > 0 ? j : ""}
          </td>
        );
      }
  
      rows.push(<tr key={dayOfWeek}>{cells}</tr>);
    }
  
    return rows;
  };
  
  console.log(selectedDateTravel, 'seletedDateTravel');
  
  const handleDateClick = (newDate) => {
    setSelectedDate(newDate);
    setSelectedDateTravel(newDate)
  };

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);


  useEffect(() => {
    const monthLong = selectedDate.toLocaleString("default", { month: "long" });
  const year = selectedDate.getFullYear();
  const date = selectedDate.toLocaleDateString("en-CA");
  
  console.log(monthLong, year, date);
    axios
      .post('/Marie-ERP/api/homeScreen', {
        userId: user.userId ? user.userId : 3,
        month: monthLong,
        year: year,
        day: date
      })
      .then(response => {
        console.log(response?.data?.data?.summary, 'homescreen');
        const responseData = response?.data?.data?.summary;
        // Assuming response.data.data is an array
        setSummary({
          overtime: responseData.overtime,
          percent: responseData.percent.toFixed(2),
          restdays: responseData.restDays || [], // Provide a default empty array
          restLeaveData: responseData.restDays || [], // Provide a default empty array
          others: responseData.others || [], // Provide a default empty array
          otherLeaveData: responseData.others || [], // Provide a default empty array
          working: responseData.working_count,
          annualLeaveData: responseData.annual,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedDate]);
  
console.log(summary.restdays?.length, 'summary');
  
  const style = {
    one : '#ccd4eb',
    two : '#e8eaf4'
  }

  return (
    <>
      <div className=" ">
        <span className="fs-3 mx-3">Calendar</span>
        <p className="fs-5 mx-3 mt-2">Manage your HR duties.</p>
      </div>


      <button className="btn" onClick={handleShow}>
              <i className="fa-solid fs-3 fa-bars"></i>
            </button>
      

      <Row>
        {show && (
        <Col lg={2}>
        <div className="d-flex flex-column justify-content-start">
            <Link to="setup" className="fs-5 btn">
              Setup
            </Link>
            <Link to="records" className="fs-5 btn">
              Records
            </Link>
            {/* <Link to="apply" className="fs-5 btn">
              Apply
            </Link>
            <Link to="summary" className="fs-5 btn">
              Summary
            </Link> */}
          </div>
        </Col>
        )}
        
        <Col>
        <div className="mt-3">
        <Row>
          <Col lg={6} className="mx-5 d-flex justify-content-end me-5">
            <GrFormPrevious
              className="bg-body-secondary mt-2"
              onClick={() => handleYearChange(currentYear - 1)}
            />
            <p className="fs-5">{currentYear}</p>
            <GrFormNext
              className="bg-body-secondary mt-2"
              onClick={() => handleYearChange(currentYear + 1)}
            />
          </Col>
        </Row>

        <Row>
          <Col lg={3} className="mx-3">
           
          </Col>
          <Col lg={3} className="text-end">
            <p className="fs-5">
              {selectedDate.getDate()} {""}
              {selectedDate.toLocaleString("default", { month: "long" })}
            </p>
            <p className="fs-5 text-secondary">
              {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
                selectedDate
              )}
            </p>
          </Col>
        </Row>
        <Row>
          <Col lg={6} className="mx-4 ">
            <div className="d-flex justify-content-between fs-5 ">
              <GrFormPrevious
                className="bg-body-secondary"
                onClick={() => handleMonthChange(currentMonth - 1)}
              />
              <p>
                {selectedDate.toLocaleString("default", { month: "long" })}{" "}
                {currentYear}
              </p>
              <GrFormNext
                className="bg-body-secondary "
                onClick={() => handleMonthChange(currentMonth + 1)}
              />
            </div>
            <Table bordered striped className="text-center">
              <tbody>{generateCalendarTable()}</tbody>
            </Table>

            {/* <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        locale="en-US"
        showNeighboringMonth={true}
        minDate={new Date('2022-11-01')}
        maxDate={new Date('2024-12-31')}
      /> */}
          </Col>
          <Col className="mx-2 mt-5">
        <Table bordered className='border-1 border-white'>
            <tbody >
              {/* {summary?.map((sum, i) => ( */}
                <>
              <tr>
                <th style={{backgroundColor : style.one}} className='px-3 border-2 '>Leave</th>
                <td style={{backgroundColor : style.one}}></td>
              </tr>

              <tr>
                <th style={{backgroundColor : style.two}} className='text-center  border-2'>Annual</th>
                <td style={{backgroundColor : style.two}}>{summary?.annualLeaveData?.length} <button className="btn" onClick={() => handleShowOthers2()}>{summary?.annualLeaveData?.length > 1 ? 'People' : 'Person'}</button></td>
              </tr>

              <tr>
                <th style={{backgroundColor : style.one}} className='text-center  border-2'>Others</th>
                <td style={{backgroundColor : style.one}}>{summary?.others?.length}  <button className="btn" onClick={() => handleShowOthers()}>{summary.others.length > 1 ? 'People' : 'Person'}</button></td>
              </tr>

              <tr>
                <th style={{backgroundColor : style.two}} className='px-3  border-2'>Restdays</th>
                <td style={{backgroundColor : style.two}}>{summary?.restdays?.length} <button className="btn" onClick={() => handleShowOthers1()}>{summary?.restdays?.length > 1 ? 'People' : 'Person'}</button></td>
              </tr>

              <tr>
                <th style={{backgroundColor : style.one}} className='px-3  border-2'>Working</th>
                <td style={{backgroundColor : style.one}}>{summary?.working} {summary?.working > 1 ? "People" : 'Person'} ({(summary?.percent)} {`% of total workforce`})</td>
              </tr>

              <tr>
                <th style={{backgroundColor : style.two}} className='px-3  border-2'>Overtime Claims</th>
                <td style={{backgroundColor : style.two}}>{summary?.overtime} hours for the month</td>
              </tr>
              </>
              {/* ))} */}
            </tbody>
          </Table>
        
        </Col>
        </Row>
      </div>
        </Col>

       
      </Row>

      <Modal show={showOthers} onHide={handleCloseOthers}>
  <Modal.Header closeButton>
    <Modal.Title>Others Leave</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  {summary.otherLeaveData.length == 0 ? (<>No person take other leave today</>) : (
    <>
    {summary.otherLeaveData.map((item, index) => (
      <p key={index}>{item}</p>
    ))}</> )}
  </Modal.Body>
</Modal>

<Modal show={showOthers1} onHide={handleCloseOthers1}>
  <Modal.Header closeButton>
    <Modal.Title>Restdays Leave</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {summary.restLeaveData.length == 0 ? (<>No person take rest leave today</>) : (
      <>
    {summary.restLeaveData.map((item, index) => (
      <p key={index}>{item}</p>
    ))} </>)}
  </Modal.Body>
</Modal>

<Modal show={showOthers2} onHide={handleCloseOthers2}>
  <Modal.Header closeButton>
    <Modal.Title>Annual Leave</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {summary.annualLeaveData.length == 0 ? (<>No person take annual leave today</>) : (
      <>
    {summary.annualLeaveData.map((item, index) => (
      <p key={index}>{item}</p>
    ))} </>)}
  </Modal.Body>
</Modal>
      
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Go to</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {selectedDate.toLocaleString().split(', ')[0]} */}
          <Link to="apply" className="fs-5 btn">
              Apply
            </Link>
           
          
          </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default Labour;



