import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { Button, Modal, Accordion } from "react-bootstrap";

const sidebarColor = "#14213D";

const Sidebar = ({ showModal, setShowModal, toggle, setToggle, myStyle }) => {
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    setShowModal(false);
    logout();
  };

  return (
    <>
      {/* <div className="py-3 mx-4">
        <img
          className="rounded Restarunt-logo float-start"
          src="/Restaruntlogo.jpg"
          alt=""
          width={45}
        />
        <div className="mx-5 px-2">
          <span className="marie fw-bolder">MARIE</span> <br />
          <span className="erp fw-bolder">ERP</span>
        </div>
        </div> */}

      <div className=" align-items-start  ">
        <ul className="navbar-nav">
          <li className="nav-item w-100" style={{ listStyle: "none" }}>
            <div className="lnk" onClick={() => setToggle(!toggle)}>
              <div className="px-2">
                <i
                  className={
                    toggle ? "fa-solid fa-bars" : "ps-2 fa-solid fa-bars"
                  }
                  style={{ fontSize: "22px" }}></i>
              </div>
            </div>
          </li>

          <li className="nav-item w-100">
            <NavLink
              className={({ isActive }) =>
                isActive ? "fw-bold isActive nav-link" : "nav-link"
              }
              to={"/dashboard/home"}>
              <div className="lnk">
                <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                  <i
                    className={
                      toggle
                        ? "fa-solid fa-house-chimney"
                        : "ps-2 fa-solid fa-house-chimney"
                    }
                    style={{ color: sidebarColor }}></i>
                </div>

                <p className="ps-2" style={{ display: `${myStyle}` }} id="hme">
                  Home
                </p>
              </div>
            </NavLink>
          </li>
          {toggle ? "" : ""}

          {user.planType === "1" ? (
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "fw-bold isActive nav-link" : "nav-link"
                }
                to={"/dashboard/sales"}>
                <div className="lnk">
                  <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                    <i
                      className={
                        toggle
                          ? "fa-solid fa-arrow-trend-up"
                          : " ps-2 fa-solid fa-arrow-trend-up"
                      }
                      style={{ color: sidebarColor }}></i>
                  </div>
                  <p className="ps-2" style={{ display: `${myStyle}` }}>
                    Sales
                  </p>
                </div>
              </NavLink>
            </li>
          ) : null}
          <li className="nav-item d-block-inline">
            <NavLink
              className={({ isActive }) =>
                isActive ? "fw-bold isActive nav-link" : "nav-link"
              }
              to={"/dashboard/labour"}>
              <div className="lnk">
                <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                  <i
                    className={
                      toggle
                        ? "fa-solid fa-user-group"
                        : "ps-2 fa-solid fa-user-group"
                    }
                    style={{ color: sidebarColor }}></i>
                </div>
                <p className="ps-2" style={{ display: `${myStyle}` }} id="ppl">
                  Labour
                </p>
              </div>
            </NavLink>
          </li>
          <li className="nav-item d-block-inline">
            <NavLink
              className={({ isActive }) =>
                isActive ? "fw-bold isActive nav-link activee" : "nav-link"
              }
              to={"/dashboard/ingredients/"}>
              <div className="lnk">
                <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                  <i
                    className={
                      toggle
                        ? "fa-solid fa-mug-hot"
                        : "ps-2 fa-solid fa-mug-hot"
                    }
                    style={{ color: sidebarColor }}></i>
                </div>
                <p className="ps-2" style={{ display: `${myStyle}` }}>
                  Ingredients
                </p>
              </div>
            </NavLink>
          </li>

          <li className="nav-item d-block-inline">
            <NavLink
              className={({ isActive }) =>
                isActive ? "fw-bold isActive nav-link" : "nav-link"
              }
              to={"/dashboard/overheads"}>
              <div className="lnk">
                <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                  <i
                    className={
                      toggle
                        ? "fa-solid fa-screwdriver-wrench"
                        : "ps-2 fa-solid fa-screwdriver-wrench"
                    }
                    style={{ color: sidebarColor }}></i>
                </div>
                <p className="ps-2" style={{ display: `${myStyle}` }}>
                  Overheads
                </p>
              </div>
            </NavLink>
          </li>

          <li className="nav-item d-block-inline">
            <NavLink
              className={({ isActive }) =>
                isActive ? "fw-bold isActive nav-link" : "nav-link"
              }
              to={"/dashboard/costing"}>
              <div className="lnk" id="dol">
                <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                  <i
                    className={
                      toggle
                        ? "fa-solid fa-dollar-sign"
                        : "px-2 fa-solid fa-dollar-sign"
                    }
                    style={{ color: sidebarColor }}></i>
                </div>
                <p className="ps-2" style={{ display: `${myStyle}` }}>
                  Costing
                </p>
              </div>
            </NavLink>
          </li>

          {/* <li className="nav-item d-block-inline">
            <NavLink
              className={({ isActive }) =>
                isActive ? "fw-bold isActive nav-link" : "nav-link"
              }
              to={"/dashboard/profile"}>
              <div className="lnk">
                <i
                  className="fa-solid fa-circle-user ms-4 me-1 mt-1"
                  style={{ color: sidebarColor }}></i>
                <p className="ps-2" className="ms-3">Profile</p>
              </div>
            </NavLink>
          </li> */}
              <li className="nav-item d-block-inline">
            <NavLink
              className={({ isActive }) =>
                isActive ? "fw-bold isActive nav-link" : "nav-link"
              }
              to={"/dashboard/settings"}>
              <div className="lnk" id="dol">
                <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                  <i
                    className={
                      toggle
                        ? "fa-solid fa-microchip"
                        : "px-2 fa-solid fa-microchip"
                    }
                    style={{ color: sidebarColor }}></i>
                </div>
                <p className="ps-2" style={{ display: `${myStyle}` }}>
                  Process
                </p>
              </div>
            </NavLink>
          </li>


          <li className="nav-item d-block-inline">
            <NavLink
              className={({ isActive }) =>
                isActive ? "fw-bold isActive nav-link" : "nav-link"
              }
              to={"/dashboard/faq"}>
              <div className="lnk" id="dol">
                <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                  <i
                    className={
                      toggle
                        ? "fa-regular fa-circle-question"
                        : "px-2 fa-regular fa-circle-question"
                    }
                    style={{ color: sidebarColor }}></i>
                </div>
                <p className="ps-2" style={{ display: `${myStyle}` }}>
                  FAQ
                </p>
              </div>
            </NavLink>
          </li>



          <li className="nav-item d-block-inline ">
            <NavLink
              className={({ isActive }) =>
                isActive ? " nav-link" : "nav-link"
              }
              onClick={() => setShowModal(true)}>
              <div className="lnk ">
                <div className="px-2" style={{ width: toggle ? "" : "45px" }}>
                  <i
                    className={
                      toggle
                        ? "fa-solid fa-arrow-right-from-bracket"
                        : "ps-2 fa-solid fa-arrow-right-from-bracket"
                    }
                    style={{ color: sidebarColor }}></i>
                </div>

                <p className="ps-2" style={{ display: `${myStyle}` }}>
                  Logout
                </p>
              </div>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Sidebar;
