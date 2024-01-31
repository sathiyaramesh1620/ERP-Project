import React from "react";
import { useContext, useState } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import { IngredientsDataContext } from "./IngredienstsContext";

const Pantry = () => {
  const { selectedIngredients } = useContext(IngredientsDataContext);
  

  return (
    <>
    <Row className="mt-4">
      <Col sm={2} className="border-end">
     
      <div
          className="mt-2 text-start mx-2 px-3 fs-4 border-bottom text-white rounded-1 " style={{backgroundColor : '#14213d'}}>
          Groups
        </div>
          {selectedIngredients.map((page, i) => {
            return (
               <NavLink
               key={i}
                 className={({ isActive }) =>
                   isActive ? "fw-bold text-start isActive mt-2 nav-link my-1 " : "text start nav-link my-1"
                 }
                 to={`/dashboard/ingredients/pantry/${page}`} >
                 <div className="lnk">
                   <p className=" my-2 px-3 text-start">
                  {i + 1}. {page}
                   </p>
                 </div>
               </NavLink>
            );
          })}
      </Col>
      <Col sm={10} className="">
        {/* <h3 className="mx-3">Pick your ingredients from the table</h3> */}
        <Outlet />
      </Col>
    </Row>

</>
//   <>
    
//     <Row className="mt-4">
//     <Col lg={3} className="border-end">
//       <div
//         className="mt-2 text-start mx-2 px-3 fs-4 border-bottom text-white rounded-1 "
//         style={{ backgroundColor: "#14213d" }}>
//         Groups
//       </div>
//       {selectedIngredients.map((page, i) => {
//         return (
//           <NavLink
//             key={i}
//             className={({ isActive }) =>
//               isActive
//                 ? "fw-bold text-start isActive mt-2 nav-link my-1 "
//                 : "text start nav-link my-1"
//             }
//             to={`/dashboard/ingredients/pantry/${page}`}>
//             <div className="lnk">
//               <p className=" my-2 px-3 text-start">
//                 {i + 1}. {page}
//               </p>
//             </div>
//           </NavLink>
//         );
//       })}
//     </Col>
    
//     <Col lg={9} className="">
//       {/* <h3 className="mx-3">Pick your ingredients from the table</h3> */}
//       <Outlet />
//     </Col>
//   </Row>
  
// </>
  );
};

export default Pantry;
