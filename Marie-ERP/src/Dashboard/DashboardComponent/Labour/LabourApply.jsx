import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Container,
  Row,
  Col,
  Form,
  Spinner
} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { FaInfoCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserContext } from "../../../Context/UserContext";
import LabourContextHelper from './Hooks/LabourContextHelper'
import { Link } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import { toast, ToastContainer } from 'react-toastify';


const LabourApply = () => {

  let currentDate = new Date();

// Get the current year
let currentYear = currentDate?.getFullYear();

// Get the current month
// Note: Months are zero-indexed, so we add 1 to get the actual month
let currentMonthIndex = currentDate?.getMonth();
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentMonth = months[currentMonthIndex];

// Get the current day
let currentDay = currentDate?.getDate();

// console.log(currentYear + "-" + (currentMonthIndex + 1).toString().padStart(2, '0') + "-" + currentDay.toString().padStart(2, '0'));
// console.log(currentMonth);
// console.log(currentYear);

  const { user } = useContext(UserContext);
  const{selectedDateTravel, setSelectedDateTravel}=LabourContextHelper()

  const [show, setShow] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState()
  const [overTime, setOverTime] = useState(0)
  const [leaveType, setLeaveType] = useState('')
  const [month, setMonth] = useState()
  const [year, setYear] = useState()
  const [date, setDate] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
 
  const [selectedDates1, setSelectedDates1] = useState([]);

  const handleDateSelection = (selectedDate) => {
    // Check if the date is already selected
    if (selectedDates1.includes(selectedDate)) {
      // If selected, remove it from the array
      setSelectedDates1(selectedDates1.filter((date) => date !== selectedDate));
    } else {
      // If not selected, add it to the array
      setSelectedDates1([...selectedDates1, selectedDate]);
    }
  };

  const handleToDate = (e) => {
    if (new Date(e) > new Date(fromDate)) {
      setToDate(e);
    } else {
      alert("To date must be greater than From date");
    }
  };

  // console.log(selectedDateTravel, 'selectedDateTravel');

  const [tableData, setTableData] = useState([]);
  

 useEffect(() => {
  if (selectedDateTravel) {
    const adjustedDate = new Date(selectedDateTravel.getTime() - selectedDateTravel.getTimezoneOffset() * 60000);
    localStorage.setItem('selectedDateTravel', adjustedDate.toISOString());
  }
  
  // Retrieving the stored value and converting it back to a Date object
  if (!selectedDateTravel) {
    const storedDate = localStorage.getItem('selectedDateTravel');
    setSelectedDateTravel(storedDate ? new Date(storedDate) : null);
  }
 }, [selectedDateTravel, month, year, date])


console.log(selectedDateTravel, 'seledsfasdfasfd');
  console.log(month, year, date);
  useEffect(() => {



    if (selectedDateTravel) {
      // If selectedDateTravel is available, use its values
      const selectedYear = selectedDateTravel?.getFullYear();
      const selectedMonth = selectedDateTravel?.toLocaleDateString('en-US', { month: 'long' });
      const selectedDate = `${selectedYear}-${(selectedDateTravel?.getMonth() + 1)?.toString()?.padStart(2, '0')}-${selectedDateTravel?.getDate()?.toString()?.padStart(2, '0')}`;
  
      setYear(selectedYear);
      setMonth(selectedMonth);
      setDate(selectedDate);
    } else {
      // Otherwise, use current date values
      setYear(currentYear);
      setMonth(currentMonth);
      setDate(currentYear + "-" + (currentMonthIndex + 1).toString().padStart(2, '0') + "-" + currentDay.toString().padStart(2, '0'));
    }
  }, [selectedDateTravel, month, year, date]);

  
  const fetchLabourList = async () => {
    setLoading(true)
    console.log({
      month,
      userId: user.userId ? user.userId : 2,
      day: date,
      year,
    }, 'attendance');

    if(month && year && date){
    await axios
      .post("/Marie-ERP/api/attendance", {
        month,
        userId: user.userId ? user.userId : 2,
        day: date,
        year,
      })
      .then((response) => {
        console.log(response.data);
        setTableData(response.data.data);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
        if(error){
          setError(true)
          setLoading(false)
        }
        
        });
      }
  };

  useEffect(() => {
    fetchLabourList();
  }, [selectedDateTravel, month, year, date]);

console.log(leaveType, 'leaveType');

  const applyLeave = async () => {
    console.log({
      userId : user.userId ? user.userId : 2,
      employeeId,
      month,
      year,
      day : selectedDates1,
      name : leaveType
    }, 'leaveApply');
    if(leaveType.length > 2 && selectedDates1.length > 0){
    await axios.post('/Marie-ERP/api/leaveSave', {
      userId : user.userId ? user.userId : 2,
      employeeId,
      month,
      year,
      day : selectedDates1,
      name : leaveType
    })
    .then(response => {
      console.log(response)
      if(response.status === 200) {
        fetchLabourList()
        setShow(!show)
        setLeaveType('')
        setSelectedDates1([])
        toast.success('Leave applied successfully!');
      }
    })
    .catch(error => console.log(error))
  }
  else{
    toast.error('Please fill all the necessary data!');
  }
}

  const [editedOvertime, setEditedOvertime] = useState(0);

  // New state to store the index of the row being edited
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  // Function to handle the "Edit" button click
  const handleEdit = (index) => {
    setEditingRowIndex(index);
    setEditedOvertime(tableData[index]?.overtime || 0);
  };

  // Function to handle the "Save" button click after editing
  const handleSave = async (index) => {
    

    console.log({
      userId: user.userId ? user.userId : 2,
      employeeId,
      month,
      year,
      day: date,
      hours: editedOvertime,
    });
    await axios
      .post("/Marie-ERP/api/overtimeSave", {
        userId: user.userId ? user.userId : 2,
        employeeId,
        month,
        year,
        day: date,
        hours: editedOvertime,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          // Update the tableData with the new overtime value
      fetchLabourList()
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // Reset editing state
    setEditingRowIndex(null);
  };

 
  
  

 

  return (
    
    <div className="container">
      <ToastContainer />
      <Row>
        <h3 style={{color : '#fca311'}}>Labour</h3>
        <h4>Apply</h4>
        <p>Regulate leave days and overtime claims for workers.</p>
      </Row>

      <Row className="mt-3">
        <Col lg={2}>
            <p className="fs-5 mx-1">{year}</p>
            <h3>{`${date?.split('-')[2]} ${month?.slice(0, 3)}`}</h3>
            <h5 className="text-secondary mb-4">{new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</h5>

            <div className="">
            <Form.Select className="" value={selectedDateTravel?.toISOString().substring(0, 10)} onChange={(e) => setSelectedDateTravel(new Date(e.target.value))}>
  <option value='' >Select a date</option>
  {Array.from({ length: new Date(selectedDateTravel?.getFullYear(), selectedDateTravel?.getMonth() + 1, 0)?.getDate() || 0 }, (_, index) => {
    const day = index + 1;
    const formattedDate = new Date(selectedDateTravel?.getFullYear(), selectedDateTravel?.getMonth(), day);
    const dateString = formattedDate.toISOString().substring(0, 10);
    return <option key={dateString} value={dateString}>{dateString}</option>;
  })}
</Form.Select>

</div>

        </Col>
        <Col>
        {loading ? (<>
          <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <Spinner animation="border" variant="warning" role="status">
          
          </Spinner><span className="mx-3"><b>Marie - ERP</b></span>
        </div>
        </>) : (
          <>
          {error ? (
          <><h4>Please add Labour</h4>
          <p>Go to <Link to='/dashboard/labour/records'>Records page</Link></p></>) : (
        <Table bordered responsive className="mb-5 mt-0">
        <thead className="text-center fw-light">
          <tr>
            <th
              className="text-white border border-3 broder-white fw-medium align-middle"
              style={{ backgroundColor: "#4472C4" }}
              rowSpan={2}>
              No
            </th>
            <th
              className="text-white border border-3 broder-white fw-medium align-middle"
              style={{ backgroundColor: "#4472C4" }}
              rowSpan={2}>
              Name
            </th>
            <th
              className="text-white border border-3 broder-white fw-medium align-middle"
              style={{ backgroundColor: "#4472C4" }}
              rowSpan={2}>
              <div>
                Claims for Overtime
                <FaInfoCircle className="ms-1" />
              </div>
            </th>
            <th
              className="text-white border border-3 broder-white fw-medium align-middle"
              style={{ backgroundColor: "#4472C4" }}
              rowSpan={2}>
              <div>
                Apply for Leave
                <FaInfoCircle className="ms-1" />
              </div>
            </th>
            <th
              colSpan="2"
              className="text-white border border-3 broder-white fw-medium align-middle"
              style={{ backgroundColor: "#4472C4" }}>
              Remaining
            </th>
            <th
              className="fw-medium border border-3 broder-white text-white align-middle"
              style={{ backgroundColor: "#4472C4" }}
              rowSpan={2}>
              Today's Work Status
            </th>
            <th
              className="fw-medium border border-3 broder-white text-white align-middle"
              style={{ backgroundColor: "#4472C4" }}
              rowSpan={2}>
              Action
            </th>
          </tr>
          <tr>
            <td
              className="text-black border border-3 broder-white align-middle"
              style={{ backgroundColor: "#CDD4EA" }}>
              Annual <br /> Leave
            </td>
            <td
              className="text-black border border-3 broder-white align-middle"
              style={{ backgroundColor: "#CDD4EA" }}>
              Restdays
            </td>
          </tr>
        </thead>

        <tbody className="fw-light">
          {tableData?.map((row, index) => (
            <tr key={row.e_id} >
              <td style={{backgroundColor : (index % 2 === 0) ? '#e9eaf5' : '#CDD4EA'}} className="align-middle text-center border border-3 border-white">{index + 1}</td>
              <td style={{backgroundColor : (index % 2 === 0) ? '#e9eaf5' : '#CDD4EA'}} className="align-middle text-center border border-3 border-white">{row.name ? row.name : "-"}</td>
              <td style={{backgroundColor : (index % 2 === 0) ? '#e9eaf5' : '#CDD4EA'}} className="align-middle text-center col-1 border border-3 border-white">
              {editingRowIndex === index ? (
                <Form.Control
                  type="number"
                  placeholder="OT"
                  value={editedOvertime}
                  onChange={(e) => setEditedOvertime(e.target.value)}
                />
              ) : (
                <>{row.overtime ? row.overtime : '-'}</>
              )}
              </td>
              <td style={{backgroundColor : (index % 2 === 0) ? '#e9eaf5' : '#CDD4EA'}} className="border border-3 border-white align-middle text-center col-1">
                <>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setShow(!show)
                    setEmployeeId(row.e_id)}}
                    className="d-flex mx-4 align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </Button>

                 
                  {/* <DatePicker
                      selected={row.startDate}
                      onChange={(date) => handleDateChange(row.id, date)}
                      selectsStart
                      placeholderText="Start Date"
                    /> */}
                </>
              </td>
              <td style={{backgroundColor : (index % 2 === 0) ? '#e9eaf5' : '#CDD4EA'}} className="border border-3 border-white align-middle text-center">{row.annual_leave_balance ? row.annual_leave_balance  : '-'}</td>
              <td style={{backgroundColor : (index % 2 === 0) ? '#e9eaf5' : '#CDD4EA'}} className="border border-3 border-white align-middle text-center">{row.restDays_balance ? row.restDays_balance : '-'}</td>
              <td style={{backgroundColor : (index % 2 === 0) ? '#e9eaf5' : '#CDD4EA'}} className={`border border-3 border-white text-center align-middle col-2`}>
                <div 
                style={{
                  backgroundColor : (row.today_work_status == 'Annual' || row.today_work_status == 'RD') ? 'orange' : (row.today_work_status == 'Others' ? 'red' : 'blue'), 
                  borderRadius : '0px', 
                  padding : '15px', 
                  color : 'white'}} 
                
                className="fw-bold ">{(row.today_work_status == 'RD' ? 'Restday' : (row.today_work_status == 'Annual' ? 'Annual' : (row.today_work_status == 'Others' ? 'Other' : 'Working') ))}</div>
              </td>
              <td style={{backgroundColor : (index % 2 === 0) ? '#e9eaf5' : '#CDD4EA'}} className="border border-3 border-white align-middle text-center col-2 p-3">
              <Button
                variant="warning"
                className="me-2 bg-gradient text-black"
                onClick={() =>{ 
                  handleEdit(index)
                  setEmployeeId(row.e_id)}}
              >
                Edit
              </Button>
                <Button
                  variant="black"
                  className="bg-black bg-gradient text-white"
                  onClick={() => handleSave(row.id)}
                >
                  Save
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
      </>
      )}
        </Col>
      </Row>
      

      <Modal show={show} onHide={() => setShow(!show)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Apply for Leave</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Container>
            <Row>
              <Form.Select className="mb-3 " value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value=''>type of leave</option>
                <option value='Annual'>Annual</option>
                <option value='Others'>Other</option>
              </Form.Select>
            </Row>
            {leaveType.length > 0 && (
            <Row>
              <Col xs={12} md={6}>
                <ReactDatePicker
                  selected={fromDate}
                  onChange={(date) => {
                    setFromDate(date);
                    handleDateSelection(date.toISOString().substring(0, 10));
                  }}
                  selectsStart
                  placeholderText="Select Dates"
                  inline
                />
              </Col>
              <Col className="mx-3">
                {selectedDates1.length > 0 && (
                  <>
              <h5 className="text-center">Selected Dates</h5>
              {selectedDates1.map((date) => (
                  <div className="mt-3" key={date}><p className="text-center rounded-3 " style={{backgroundColor : 'rgb(255, 210, 64)'}}>{date}</p></div>
                ))} 
                </>)}
              </Col>
            </Row>
            )}
          </Container>
                    </Modal.Body>
                    <Modal.Footer>
                      <button variant="success" disabled={leaveType.length == 0 || selectedDates1.length == 0} className="btn btn-success w-100" onClick={() => {
                        
                        applyLeave()}}>
                        Apply
                      </button>
                    </Modal.Footer>
                  </Modal>
    </div>
  );
};

export default LabourApply;
