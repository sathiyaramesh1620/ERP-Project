import React from "react";
import { Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const IngredientsHeader = () => {
 
  let item = sessionStorage.getItem('currentItem');
  
  if (item == null || undefined) { item = 'Vegetables' }
  else{ item = sessionStorage.getItem('currentItem')}

  return (
    <Row className="nav align-content-center p-0 text-center  mb-2 border-bottom  ">
      <Col className="">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center text-dark"
              : "sales-header-link nav-link p-2 text-center text-dark"
          }
          to={"/dashboard/ingredients/"}>
         Groups
        </NavLink>
      </Col>
      <Col>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center text-dark"
              : "sales-header-link nav-link p-2 text-center text-dark"
          }
          to={`/dashboard/ingredients/pantry/${item}`}>
          Storeroom
        </NavLink>
      </Col>
      <Col>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center text-dark"
              : "sales-header-link nav-link p-2 text-center text-dark"
          }
          to={"/dashboard/ingredients/stocktake"}>
          Stockcards
        </NavLink>
      </Col>
      {/* <Col>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "fw-bold border-bottom border-warning border-3 nav-link p-2 text-center text-dark"
              : "sales-header-link nav-link p-2 text-center text-dark"
          }
          to={"/dashboard/ingredients/purchasing"}>
          Purchase
        </NavLink>
      </Col> */}
    </Row>
  );
};

export default IngredientsHeader;
