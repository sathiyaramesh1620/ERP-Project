import React, {useContext, useEffect} from 'react'
import { Row, Col, Table, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
// import LabourContextHelper from '../Hooks/LabourContextHelper'
import { LaboursDataContext } from '../LaboursContext'


function EditBalanceLeave() {

  // const{openingBalance,setOpeningBalance,annual, setAnnual}=LabourContextHelper()
  const {openingBalance,setOpeningBalance,annual, setAnnual} =useContext(LaboursDataContext);

  useEffect(() => {
    (annual > 0) ? setOpeningBalance(true) : setOpeningBalance(false)
  }, [annual])

  // console.log(openingBalance, annual);

  return (
    <>
    <div className=''>
    <div>
      <p>Input the opening balances for a new joiner or you just onboarded Marie ERP.</p>
      <p>These balances are days remaining for the calendar year.</p>
    </div>
    
    <Table bordered className='w-50'>
      <tbody>
        <tr>
          <th className='pt-4 px-3 w-25' style={{backgroundColor : '#ccd5ea'}}>Annual</th>
          <td>
            <Form.Control type='number' value={annual} placeholder='no of days (optional)' onChange={(e) => setAnnual(e.target.value)}></Form.Control>
          </td>
        </tr>
      </tbody>
    </Table>
    </div>

    <Row className="text-end mb-5">
            <Col>
            <Link to="/dashboard/labour/records/e/r">
                <button
                  className="btn rounded-0 text-white px-4 mt-4 fs-5 mx-2 "
                  style={{ backgroundColor: "#002060" }}>
                <i className="fa-solid fa-chevron-left"></i> Prev 
                </button>
              </Link>

              <Link to="lt/la">
                <button
                  className="btn rounded-0 text-white px-4 mt-4 fs-5"
                  style={{ backgroundColor: "#002060" }}>
                  Next <i className="fa-solid fa-chevron-right"></i>
                </button>
              </Link>
            </Col>
          </Row>
    {/* <Row>
        <Col></Col>
        <Col className='text-end '><Link to='lt'>Next</Link></Col>
    </Row> */}
    </>
  )
}

export default EditBalanceLeave;