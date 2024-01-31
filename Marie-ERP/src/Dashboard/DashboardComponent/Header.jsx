import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../Context/UserContext";
import "./Header.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Modal } from "react-bootstrap";

export default function Header({ showModal, setShowModal }) {
  const { user } = useContext(UserContext);

  const nav = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [newNotificationId, setNewNotificationId] = useState(4);
  const [deletedNotifications, setDeletedNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Function to add notifications
  const addNotification = (message, link = "#") => {
    // Check if a notification with the same message and link already exists
    const existingNotification = notifications.find(
      (notification) =>
        notification.message === message && notification.link === link
    );

    // If no existing notification is found, add the new notification
    if (!existingNotification) {
      const newNotification = {
        id: newNotificationId,
        message: message,
        link: link,
      };
      setNotifications([...notifications, newNotification]);
      setNewNotificationId(newNotificationId + 1);
    }
  };

  // Function to delete a single notification
  const deleteNotification = (id) => {
    const deletedNotification = notifications.find(
      (notification) => notification.id === id
    );
    setDeletedNotifications([deletedNotification, ...deletedNotifications]);
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
  };

  // Function to delete all notifications
  const deleteAllNotifications = () => {
    setDeletedNotifications([...deletedNotifications, ...notifications]);
    setNotifications([]);
  };

  // Function to undo delete for 3 seconds
  useEffect(() => {
    let undoTimeout;
    if (deletedNotifications.length > 0) {
      undoTimeout = setTimeout(() => {
        setDeletedNotifications([]);
      }, 3000);
    }
    return () => clearTimeout(undoTimeout);
  }, [deletedNotifications]);

  const undoDelete = () => {
    setNotifications([...notifications, ...deletedNotifications]);
    setDeletedNotifications([]);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  useEffect(() => {
    if (user.verificationStatus !== "1") {
      addNotification("Please verify your email", "/verifyemail");
    }
  }, []);

  const [showVerificationMessage, setShowVerificationMessage] = useState(true);

  useEffect(() => {
    // Check if the user is verified and if the message has been shown previously
    if (user.verificationStatus === "1" && showVerificationMessage) {
      // If verified and message hasn't been shown, display the message
      setShowVerificationMessage(false); // Set the state to prevent showing the message again
    }
  }, [user.verificationStatus, showVerificationMessage]);

  return (
    <>
      <div
        style={{ height: "70px" }}
        className="header-container d-flex fixed-top justify-content-between align-items-center py-2 mb-0 shadow border-bottom">
        <div className=" text-light d-flex flex-row">
          <div className="d-flex flex-row">
            <img
              className="rounded Restarunt-logo float-start mt-1"
              src="/fork-spoon.png"
              alt=""
              width={50}
              height={45}
            />
            <div className="px-3 mt-1">
              <span className="marie fw-bold">MARIE</span> <br />
              <span className="erp fw-bold">ERP</span>
            </div>
          </div>

          {/* <div className="h4 d-flex align-items-center mt-1 mb-0">
          {user && (
            <p className="px-3 pt-2">
              Welcome{" "}
              {user.restaurantName ? user.restaurantName : " to marie erp "} !
            </p>
          )}
        </div> */}
        </div>

        <div className="d-flex align-items-center">
          <div className="show-verified-status overflow-hidden  d-none d-md-flex">
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3 }}>
              {showVerificationMessage && user.verificationStatus === "1" ? (
                <>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-success mr-1"
                  />
                  <span className="text-success">Email verified</span>
                </>
              ) : (
                <div
                  onClick={() => {
                    nav("/verifyemail");
                  }}>
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="text-danger mr-2"
                  />
                  <span className="text-danger"> Email not verified</span>
                </div>
              )}
            </motion.div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="btn btn-link position-relative"
            onClick={toggleNotifications}>
            <i className="fa-solid fa-bell fa-lg text-light">
              {notifications.length > 0 && (
                // <span className="notification-badge">{notifications.length}</span>
                <span
                  style={{
                    fontSize: "1rem",
                    position: "absolute",
                    top: "-7px",
                    right: "-3px",
                    padding: "15px 10px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    transform: "scale(0.7)",
                  }}>
                  {notifications.length}
                </span>
              )}
            </i>
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ y: -1000 }}
                animate={{ y: 0 }}
                exit={{ y: -1000 }}
                className="notification-panel z-0">
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="d-flex justify-content-between rounded-1 p-3">
                        <Link
                          to={notification.link}
                          className="text-dark text-decoration-none">
                          {notification.message}
                        </Link>
                        <span
                          className="delete-button"
                          onClick={() => deleteNotification(notification.id)}>
                          {" "}
                          <span className="btn btn-close"></span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-notification-message p-3 ">
                    <p>No new notifications.</p>
                  </div>
                )}

                <div className="notification-buttons d-flex justify-content-between">
                  {notifications.length > 0 ? (
                    <button
                      className="btn btn-link text-danger"
                      onClick={deleteAllNotifications}>
                      Delete All
                    </button>
                  ) : null}
                  {deletedNotifications.length > 0 && (
                    <button className="btn btn-link text" onClick={undoDelete}>
                      Undo Delete
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* divider */}
          {/* <span
            style={{
              height: "30px",
              border: "solid 0.5px white",
              margin: "auto 5px",
            }}></span> */}

          <button className="btn btn-link" onClick={toggleProfile}>
            <i className="fa-regular fa-circle-user fa-xl text-light"></i>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ y: -1000 }}
                animate={{ y: 0 }}
                exit={{ y: -1000 }}
                className="profile-panel p-3">
                <div className="mb-2 w-100">
                  <div className="profile-logo d-flex justify-content-center align-items-center flex-column w-100">
                    <div>
                      <i className="fa-regular fa-circle-user fa-5x text-dark"></i>
                    </div>

                    <div>
                      {" "}
                      <p className="mb-0 mt-2 text-center">
                        {user.restaurantName}
                      </p>{" "}
                      {user.verificationStatus === "1" ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-success mr-1"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="text-danger mr-1"
                        />
                      )}
                      {user.verificationStatus === "1" ? (
                        <span className="text-success"> Verified</span>
                      ) : (
                        <span className="text-danger">Not Verified</span>
                      )}
                    </div>
                    {/*                     
                  <div className="col mt-4"> <span className="link ">Settings</span> </div>
                    <div className="col"> <span className="link btn btn-link link-danger">Logout</span> </div> */}
                  </div>

                  <div>
                    {/* <p className="mb-0">{user.clientMail}</p>

                  {user.planType === "1" && (
                    <p className="mb-0"> Basic plan </p>
                  )}
                  {user.planType === "2" && (
                    <p className="mb-0"> standard plan </p>
                  )}
                  {user.planType === "3" && <p className="mb-0"> pro plan </p>} */}
                  </div>
                </div>
                {/* Additional profile content goes here */}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="d-none d-md-block">
            {user && (
              <p
                style={{
                  color: "white",
                  paddingTop: "12.5px",
                }}>
                Welcome {user.restaurantName ? user.restaurantName : " User "} !
              </p>
            )}
          </div>

          {/* offcanvas button  start*/}
          <button
            className="btn text-white fs-1 ms-2 d-block d-md-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight">
            <i className="fa-solid fa-bars"></i>
          </button>
          {/* offcanvas button  end*/}
        </div>
      </div>

      {/* offcanvas start */}
      <div
        style={{ maxWidth: "250px" }}
        className="offcanvas offcanvas-end d-md-none"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <div className="">
            {user && (
              <h5
                className="offcanvas-title"
                id="offcanvasRightLabel"
                style={{
                  color: "black",
                  paddingTop: "12.5px",
                }}>
                Welcome {user.restaurantName ? user.restaurantName : " User "} !
              </h5>
            )}
          </div>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          {/* Sidebar menu items start */}
          <div className="h-100 ">
            <OffCanvasBody showModal={showModal} setShowModal={setShowModal} />
          </div>
          {/* Sidebar menu items end */}
        </div>
      </div>
      {/* offcanvas end */}
    </>
  );
}


const OffCanvasBody = ({ showModal, setShowModal }) => {
  const sidebarColor = "#14213D";
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    setShowModal(false);
    logout();
  };
  return (
    <div className="h-100 m-0">
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
            <li className="nav-item w-100">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "fw-bold isActive nav-link" : "nav-link"
                }
                to={"/dashboard/home"}>
                <div className="lnk">
                  <div className="px-2">
                    <i
                      className="fa-solid fa-house-chimney"
                      style={{ color: sidebarColor }}></i>
                  </div>

                  <p id="hme">Home</p>
                </div>
              </NavLink>
            </li>

            {user.planType === "1" ? (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "fw-bold isActive nav-link" : "nav-link"
                  }
                  to={"/dashboard/sales"}>
                  <div className="lnk">
                    <div className="px-2">
                      <i
                        className="fa-solid fa-arrow-trend-up"
                        style={{ color: sidebarColor }}></i>
                    </div>
                    <p>Sales</p>
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
                  <div className="px-2">
                    <i
                      className="fa-solid fa-user-group"
                      style={{ color: sidebarColor }}></i>
                  </div>
                  <p id="ppl">Labour</p>
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
                  <div className="px-2">
                    <i
                      className="fa-solid fa-mug-hot"
                      style={{ color: sidebarColor }}></i>
                  </div>
                  <p>Ingredients</p>
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
                  <div className="px-2">
                    <i
                      className="fa-solid fa-screwdriver-wrench"
                      style={{ color: sidebarColor }}></i>
                  </div>
                  <p>Overheads</p>
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
                  <div className="px-2">
                    <i
                      className="fa-solid fa-dollar-sign"
                      style={{ color: sidebarColor }}></i>
                  </div>
                  <p>Costing</p>
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
                <p className="ms-3">Profile</p>
              </div>
            </NavLink>
          </li> */}

            <li className="nav-item d-block-inline">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "fw-bold isActive nav-link " : "nav-link"
                }
                to={"/dashboard/settings"}>
                <div className="lnk text-center">
                  <div className="px-2">
                    <i
                      className={"fa-solid fa-gear"}
                      style={{ color: sidebarColor }}></i>
                  </div>
                  <p>Settings</p>
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
                  <div className="px-2">
                    <i
                      className="fa-solid fa-arrow-right-from-bracket"
                      style={{ color: sidebarColor }}></i>
                  </div>

                  <p>Logout</p>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Logout Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">
              Logout Confirmation
            </Modal.Title>
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
    </div>
  );
};
