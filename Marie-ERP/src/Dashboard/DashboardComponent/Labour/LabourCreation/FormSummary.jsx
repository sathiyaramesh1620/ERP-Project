import React, {useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Table, NavLink } from 'react-bootstrap'
import LabourContextHelper from '../Hooks/LabourContextHelper'
import axios from 'axios'
import { UserContext } from '../../../../Context/UserContext'
import { LaboursDataContext } from '../LaboursContext'


function FormSummary() {
  const{name,fulltime, foreigner, salary,productivity, month, year, restDates, restDayCount, activity}=LabourContextHelper()
  const { user, commonApi } = useContext(UserContext);
  const {
    setRestDays,
    setUserDefineDays,
    setSelectedDate,
    setInputValues,
    openingBalance,
    setOpeningBalance,
    annual,
    setAnnual,
    setName,
    setFullTime,
    setForeigner,
    setProductivity,
    setSalary,
    userDefinedStatus,
    setuserDefinedStatus,
  } = useContext(LaboursDataContext);
 
  const navigate = useNavigate()

const handleSubmit = async () => {
  // console.log({
  //   userId: user.userId ? user.userId : 5,
  //   name,
  //   fulltime,
  //   foreigner,
  //   salary,
  //   productivity,

  //   activity,

  //   restDays: [
  //     {
  //       days: restDates,
  //       count: restDayCount,
  //       month,
  //       year,
  //       openingBalance,
  //       annual,
  //       userDefined: userDefinedStatus,
  //     },
  //   ],
  // });

    await axios
      .post("/Marie-ERP/api/insertLabour", {
        userId: user.userId ? user.userId : 5,
        name,
        fulltime,
        foreigner,
        salary,
        productivity,

        activity,
        restDays: [
          {
            days: restDates,
            count: restDayCount,
            month,
            year,
            openingBalance,
            annual,
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
          setInputValues({});
          setAnnual("");
          setName("");
          setFullTime("");
          setForeigner("");
          setProductivity("");
          setSalary("");
          setuserDefinedStatus(false);
          setOpeningBalance(false);
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
        {/* <tr>
        <th className='w-25  px-2' style={{backgroundColor : color.color1}}>Activites</th>
        <td className='px-2'>{activity.activity}</td>
        </tr> */}
      </Table>
    </div>

    <Row className="text-end mb-5">
            <Col>
            <Link to="/dashboard/labour/records/c/r/b/lt/la">
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
                  Create <i className="fa-solid fa-user-plus mx-2 "></i>
                </button>
              </Link>
            </Col>
          </Row>
    </>
  )
}

export default FormSummary