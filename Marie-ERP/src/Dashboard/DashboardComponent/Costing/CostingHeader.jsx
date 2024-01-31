import React from 'react'
import { Row, Col } from "react-bootstrap";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { CostDataContext } from './CostingComponents/CostContext';

const formatHeaderText = (text) => {
  if (!text) {
    return '';
  }

  const words = text.split(' ');
  const initials = words.map((word) => word[0]);
  return initials.join('');
};

const handleCancelClick = () => {
  sessionStorage.clear();
  // Perform other actions (if any) related to canceling
  // Redirect to the desired page using history.push or Link from 'react-router-dom'
};

const CostingHeader = () => {
  const location = useLocation(); // Use useLocation hook from react-router-dom
  const { data, setData} = useContext(CostDataContext)
  const formattedText = formatHeaderText(data);
  return (
    <>
    <div className='d-flex justify-content-between '>
    <section className='d-flex d-inline mx-3'>
    <div className="circle  fs-3 pt-4" style={{width : '100px', height : '90px'}}> {formattedText}</div>
    <div className=' mx-3' style={{paddingTop: '30px'}}><h4>{data || 'Select an item'}</h4></div>
    </section>
    <section>
      <Link to='/dashboard/costing'><button onClick={handleCancelClick} className='btn mx-4 mt-3'>Cancel</button></Link>
    </section></div>
    <section className='mt-5'>
    <Row>
      <Col>
        <Row className="h-100 align-content-center p-0 ">
          <Col>
          <NavLink
                  className={location?.pathname === '/dashboard/cost/general' ? 'fw-bold border-bottom border-warning border-3 nav-link p-2 text-center' : 'sales-header-link nav-link p-2 text-center'}
                  to={'/dashboard/cost/general'}
                >
                  General
                </NavLink>
          </Col>
          <Col>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center"
                  : "sales-header-link nav-link p-2 text-center"
              }
              to={"/dashboard/cost/costsales"}>
              Sales
            </NavLink>
          </Col>

          <Col>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center"
                  : "sales-header-link nav-link p-2 text-center"
              }
              to={"/dashboard/cost/sides"}>
              Sides
            </NavLink>
          </Col>
          <Col>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center"
                  : "sales-header-link nav-link p-2 text-center"
              }
              to={"/dashboard/cost/costingredients"}>
              Ingredients
            </NavLink>
          </Col>
          <Col>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center"
                  : "sales-header-link nav-link p-2 text-center"
              }
              to={"/dashboard/cost/directlabour"}>
              Direct Labour
            </NavLink>
          </Col>
          <Col>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center"
                  : "sales-header-link nav-link p-2 text-center"
              }
              to={"/dashboard/cost/costoverheads"}>
              Overheads
            </NavLink>
          </Col>

          <Col>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center"
                  : "sales-header-link nav-link p-2 text-center"
              }
              to={"/dashboard/cost/performance"}>
              Performance
            </NavLink>
          </Col>
        </Row>
      </Col>
    </Row>
    
  </section>
  </>
  )
}

export default CostingHeader