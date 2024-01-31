import React, {useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Table, NavLink } from 'react-bootstrap'
import LabourContextHelper from '../Hooks/LabourContextHelper'
import axios from 'axios'
import { UserContext } from '../../../../Context/UserContext'
import { LaboursDataContext } from '../LaboursContext'


function EditFormSummary() {
  const{name,fulltime, foreigner, salary,productivity, month, year, restDates, restDayCount, activity}=LabourContextHelper()
  const { user, commonApi } = useContext(UserContext);
  const {
    setRestDays,
    setUserDefineDays,
    setSelectedDate,
    setInputValues,
    annual,
    setAnnual,
    setName,
    setFullTime,
    setForeigner,
    setProductivity,
    setSalary,
    openingBalance,
    ffs,
    empId,
    setEmpId,
    userDefinedStatus,
    setuserDefinedStatus,
  } = useContext(LaboursDataContext);
 
  const navigate = useNavigate()

const handleSubmit = async () => {
  console.log({
    userId: user.userId ? user.userId : 5,
    employeeId: empId,
    name,
    fulltime,
    foreigner,
    salary,
    productivity,
    change:
      ffs.fulltime === fulltime &&
      ffs.foreigner === foreigner &&
      ffs.salary === salary
        ? false
        : true,
    activity,

    restDays: [
      {
        days: restDates,
        count: restDayCount,
        month,
        year,
        userDefined: userDefinedStatus,
        openingBalance,
        annual,
      },
    ],
  });

    await axios
      .post("/Marie-ERP/api/editLabour", {
        userId: user.userId ? user.userId : 5,
        name,
        employeeId: empId,
        fulltime,
        foreigner,
        salary,
        productivity,
        change:
          ffs.fulltime === fulltime &&
          ffs.foreigner === foreigner &&
          ffs.salary === salary
            ? false
            : true,
        activity,
        restDays: [
          {
            days: restDates,
            count: restDayCount,
            month,
            year,
            userDefined: userDefinedStatus,
            openingBalance,
            annual,
          },
        ],
      })
      .then((response) => {
        console.log("Edit Labour response :", response);
        if (response.status === 200) {
          
          setRestDays([]);
          setUserDefineDays([]);
          setSelectedDate(new Date());
          setInputValues({});
          setAnnual("");
          setName("");
          setFullTime("");
          setForeigner("");
          setProductivity("");
          setSalary("");
          setEmpId("");
          setuserDefinedStatus(false);
          navigate("/dashboard/labour/records");
        }
      })
      .catch((error) => console.log(error));

}

const color = {
  color1 : "#8fd2ff"
}

  return (
    <>
    <div>
      <Table bordered className='w-75 mx-5'>
        <tr>
          <th className='w-25  px-2' style={{backgroundColor : color.color1}}>Name</th>
          <td className='px-2'>{name}</td>
        </tr>
        <tr>
          <th className='w-25  px-2' style={{backgroundColor : color.color1}}>Full Time</th>
          <td className='px-2'>{fulltime}</td>
        </tr>
        <tr>
          <th className='w-25  px-2' style={{backgroundColor : color.color1}}>Foreigner</th>
          <td className='px-2'>{foreigner}</td>
        </tr>
        <tr>
          <th className='w-25  px-2' style={{backgroundColor : color.color1}}>Productivity</th>
          <td className='px-2'>{productivity}</td>
        </tr>
        <tr>
          <th className='w-25  px-2' style={{backgroundColor : color.color1}}>Salary</th>
          <td className='px-2'>{`${salary} ${commonApi.currency}`}</td>
        </tr>
      </Table>
    </div>

    <Row className="text-end mb-5">
            <Col>
            <Link to="/dashboard/labour/records/e/r/b/lt/la">
                <button
                  className="btn rounded-0 text-white px-4 mt-4 fs-5 mx-2 "
                  style={{ backgroundColor: "#002060" }}>
                <i className="fa-solid fa-chevron-left"></i> Prev 
                </button>
              </Link>

              <Link to="">
                <button
                  className="btn rounded-0 text-white px-4 mt-4 fs-5"
                  style={{ backgroundColor: "#002060" }}
                  onClick={handleSubmit}>
                  Save <i className="fa-solid fa-user-plus mx-2 "></i>
                </button>
              </Link>
            </Col>
          </Row>
    </>
  )
}

export default EditFormSummary;