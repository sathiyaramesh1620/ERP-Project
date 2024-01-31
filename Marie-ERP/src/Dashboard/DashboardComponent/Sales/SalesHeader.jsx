import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { SalesDataContext } from "./SalesContext";
import { Col, Row } from "react-bootstrap";
import "./SalesHeader.css";
const SalesHeader = () => {
  const [years, setYears] = useState([]);
  const { selectedMMYYYY, setSelectedMMYYYY } = useContext(SalesDataContext);
 


  const handleMonthChange = (value) => {
    setSelectedMMYYYY((prev) => {
      return { ...prev, month: value };
    });
  };

  const handleYearChange = (value) => {
    setSelectedMMYYYY((prev) => {
      return { ...prev, year: value };
    });
  };

  useEffect(() => {
    setSelectedMMYYYY((prev) => {
      return {
        ...prev,
        month: months[new Date().getMonth()],
        year: new Date().getFullYear(),
      };
    });

    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from(
      { length: 8 },
      (_, index) => currentYear - index
    );
    setYears(yearsArray);
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <Row>
        <Col xxl={7} xl={7} lg={6}>
          <Row className="h-100 p-0 mb-4">
            <Col>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "fw-bold nav-link p-2 navBack rounded-3 text-center"
                    : "sales-header-link nav-link p-2 text-center"
                }
                to={"/dashboard/sales/"}
                >
                Channel type
              </NavLink>
            </Col>
            <Col>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "fw-bold navBack rounded-3 nav-link p-2 text-center"
                    : "sales-header-link nav-link p-2 text-center"
                }
                to={"/dashboard/sales/salesbychannel"}>
                Sales by channel
              </NavLink>
            </Col>
            <Col>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "fw-bold navBack rounded-3 nav-link p-2 text-center"
                    : "sales-header-link nav-link p-2 text-center"
                }
                to={"/dashboard/sales/salesbymenu"}>
                Sales by menu
              </NavLink>
            </Col>
          </Row>
        </Col>
        
        <Row>
        <Col lg={5} className="mt-2">
          <div className="d-flex align-items-center px-2">
            <select
              className="form-select me-2"
              value={selectedMMYYYY.month}
              onChange={(e) => handleMonthChange(e.target.value)}>
              {months.map((month, index) => (
                <option
                  className="form-select-custom"
                  key={index}
                  value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-custom"
              value={selectedMMYYYY.year}
              onChange={(e) => handleYearChange(e.target.value)}>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </Col>
        </Row>
      </Row>
    </>
  );
};

export default SalesHeader;
