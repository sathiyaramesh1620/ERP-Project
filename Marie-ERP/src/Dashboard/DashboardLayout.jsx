import React, { useEffect, useState } from "react";
import Header from "./DashboardComponent/Header";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";

const DashboardLayout = () => {
  const [showModal, setShowModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [myStyle, setMyStyle] = useState("block");

  useEffect(() => {
    if (toggle) {
      setMyStyle("none");
    } else {
      setMyStyle("block");
    }
    console.log(myStyle);
  }, [toggle]);

// new code start
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

    // console.log(windowWidth);
// new code end

  return (
    <>
      <Header showModal={showModal} setShowModal={setShowModal} />
      <Container fluid className="ps-0">
        <div className="d-flex">
          <div
            className="d-none d-md-block"
            style={{
              width: `${
                toggle
                  ? "65px"
                  : windowWidth < 900
                  ? "230px"
                  : windowWidth < 1000
                  ? "210px"
                  : windowWidth < 1300
                  ? "210px"
                  : "200px"
              }`,
              // transition: "width 1s",
            }}>
            <div
              className="position-fixed vh-100 border shadow m-0 pt-2"
              style={{
                top: "4.5rem",
                width: `${toggle ? "" : "180px"}`,
                background: "white",
                zIndex: "999",
              }}>
              <Sidebar
                showModal={showModal}
                setShowModal={setShowModal}
                toggle={toggle}
                setToggle={setToggle}
                myStyle={myStyle}
              />
            </div>
          </div>

          <div
            className="w-100"
            style={{ marginTop: "5rem", transition: "margin 0.3s" }}>
            <Outlet />
          </div>
        </div>
      </Container>
    </>
  );
};

export default DashboardLayout;
