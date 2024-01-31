import React, { useEffect } from "react";
import "./Advertising.css";
import { Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import TableView from "./components/TableView";
import Select from "react-select";
import { useState } from "react";
import MonthYearPicker from "./components/MonthYearPicker";
import YearPicker from "./components/YearPicker";
import { RotatingLines } from "react-loader-spinner";
import { useContext } from "react";
import { OverheadsContext } from "./OverHeadsContext";
import { ToastContainer } from "react-toastify";
import { UserContext } from "../../../Context/UserContext";

import axios from "axios";
//import { axios } from "axios";

// const reportTypeOptions = [
//   { value: "Historical", label: "Historical" },
//   { value: "Management report", label: "Management Report" },
//   { value: "Audited report", label: "Audited Report" },
// ];

// const AnnTypeOptions = [
//   { value: "Annual", label: "Annual" },
//   { value: "Month", label: "Monthly" },
// ];

const Advertising = ({ onHandleClick, selected}) => {
  const { state, dispatcher, isLoading } = useContext(OverheadsContext);
  const [ categoryExpenditure, setCategoryExpenditure ] = useState([])
  const [ AnnTypeOptions, setAnnTypeOptions] = useState([])
  const [ reportTypeOptions, setReportTypeOptions ] = useState([])
  const [ reportDescription, setReportDescription ] = useState('Loading..')
  const [ shouldShowTableView, setShouldShowTableView ] = useState(true);

  const { user } = useContext(UserContext);

  const catogeries = Object.keys(selected)

  console.log(selected, 'BUILDER')

 useEffect(() => {
    axios.post('/Marie-ERP/api/overheads/init', {
      userId: user.userId ? user.userId : 3
    })
    .then((res) => {
      console.log(res, 'Line 99 Response')
      const cycles = res.data.data.cycle
      const reports = res.data.data.report
      const getReportDescription = res.data.data.description
      setAnnTypeOptions(cycles)
      setReportTypeOptions(reports)
      setReportDescription(getReportDescription[state.report])
      //console.log(cycles, reports, 'REPORTS AND CYCLES')
    })
  },[state.report])

  console.log(reportDescription)
  
  useEffect(() => {
    const key = state.category
    if(selected && key in selected) {
      setCategoryExpenditure(selected[key])
    }
  },[state.category])

  console.log(categoryExpenditure)

  

  useEffect(() => {
    setShouldShowTableView(true)
  },[setShouldShowTableView, shouldShowTableView])

  const handleEditCancel = () => {

  }

  return (
    <div style={{marginLeft:'20px'}}>
      <div>
      <h3
        style={{
          color: "#FCA311",
          width:"fit-content",
        }}>
        Overheads
        

      </h3>
      </div>
     
      <div
        className="d-flex justify-content-between"
        style={{
          color: "#14213D",
          
        }}>
        <div className="w-25">
          <Select
            defaultValue={
              state.category
                ? { value: state.category, label: state.category }
                : null
            }
            options={[...catogeries.map((val) => ({ value: val, label: val }))]}
            onChange={(e) => {
              dispatcher({ type: "categories", payload: e.value });
            }}
            styles={{
              option: (styles, { data, isFocused, isSelected }) => ({
                ...styles,
                background: isFocused
                  ? "#FCA311"
                  : isSelected
                  ? "#14213D"
                  : data.color,
              }),
            }}
          />
        </div>
         {/* <div className="w-25" style={{marginTop:"-19px"}}>
         {state.cycle === "Annual" ? (
           <YearPicker dispatcher={dispatcher} />
           ) : (
             <MonthYearPicker dispatcher={dispatcher} />
          )}
        </div> */}
      </div>
      {/* TODO: HEAD SECTION */}
      <Row className="mt-5 text-center mb-5 ">
        <Col>
          <p className="fw-bold pb-0 text-start">
            How do you want to report expenditure for {state.category.toLowerCase()} ?
          </p>
          <div style={{display: 'flex'}}>
          <Select className="w-75"
            // options={reportTypeOptions}
            options={[...reportTypeOptions.map((val) => ({value: val, label: val}))]}
            defaultValue={{ value: state.report, label: state.report }}
            styles={{
              option: (styles, { data, isFocused, isSelected }) => ({
                ...styles,
                background: isFocused
                  ? "#FCA311"
                  : isSelected
                  ? "#14213D"
                  : data.color,
              }),
            }}
            onChange={(e) => dispatcher({ type: "report", payload: e.value })}
          />
             <p  className='mt-2 ms-2 text-muted custom-report-expenditure' style={{cursor: 'pointer'}}>Info <FontAwesomeIcon icon={faCircleInfo} /></p>
             <div className='advertising-report-description'>
            {/* <p className='fw-bold m-0 p-0 ps-1' 
            style={{
              textAlign:'left'
            }}>
              Info:
            </p> */}
            <p> <span className='fw-bold'>{state.report}:</span> {reportDescription}</p>
          </div>
          </div>
          
          
          
        </Col>


        <Col>
          <p className="fw-bold text-start">Unit of Time</p>
          <div>
          <ToastContainer />
          </div>
          <Select className="w-75"
            options={[...AnnTypeOptions.map((val) => ({ value: val, label: val }))]}
            defaultValue={{ value: state.cycle, label: state.cycle }}
            onChange={(e) => {
              dispatcher({ type: "cycle", payload: e.value });
            }}
            styles={{
              option: (styles, { data, isFocused, isSelected }) => ({
                ...styles,
                background: isFocused
                  ? "#FCA311"
                  : isSelected
                  ? "#14213D"
                  : data.color,
              }),
            }}
          />
        </Col>
       
      </Row>
      {/* <section className="py-3 fs-6">
        <p>How do you want to report expenditure for advertising?</p>
        <div className="w-25">
          <Select
            options={reportTypeOptions}
            defaultValue={reportTypeOptions[0]}
            styles={{
              option: (styles, { data, isFocused, isSelected }) => ({
                ...styles,
                background: isFocused
                  ? "#FCA311"
                  : isSelected
                  ? "#14213D"
                  : data.color,
              }),
            }}
            onChange={(e) => dispatcher({ type: "report", payload: e.value })}
          />
        </div>
      </section>
      <section className="py-3 fs-6">
        <p>Report monthly or annual numbers ?</p>
        <div className="w-25">
          <Select
            options={AnnTypeOptions}
            defaultValue={AnnTypeOptions[0]}
            onChange={(e) => {
              handleAnnualChange(e.value);
              dispatcher({ type: "cycle", payload: e.value });
            }}
            styles={{
              option: (styles, { data, isFocused, isSelected }) => ({
                ...styles,
                background: isFocused
                  ? "#FCA311"
                  : isSelected
                  ? "#14213D"
                  : data.color,
              }),
            }}
          />
        </div>
      </section> */}
      {/* TODO: TABLE OVERHEADS */}
      {isLoading && (
        <div className="d-flex justify-content-center my-5">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      )}
      {state.category === "" ? (
        <p className="fs-4 text-center">Select any options to veiw table.</p>
      ) : null}

      {/* <p onClick={handleCancel}>Cancel</p> */}
      {!isLoading && state.category !== "" && shouldShowTableView &&
        <TableView 
          tableDatas={categoryExpenditure} 
          />}

      {/* {state.catagories === "" && (
        <h5>Please Choose any value in drop down to view data</h5>
      )} */}
      <Col
        className=""
        style={{
          marginTop: "70px",
        }}>
        <span className="me-auto">
          <Button
          style={{backgroundColor:'#FCA311'}}
            onClick={() => {
              onHandleClick(false);
              dispatcher({ type: "reset" });
            }}
            className=" btn btn-warning text-white"
            type="">
            
            <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#ffffff"}} />{" "}
            Back{" "}
          </Button>
        </span>
      </Col>
    </div>
  );
}

export default Advertising;
