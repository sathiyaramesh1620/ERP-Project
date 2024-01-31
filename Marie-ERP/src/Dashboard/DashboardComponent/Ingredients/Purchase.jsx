import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";

const Purchase = () => {
  const { user } = useContext(UserContext);
  const [stocks, setStocks] = useState({});
  const [showMenu, setShowMenu] = useState(true); // State to control the visibility of the first column

  useEffect(() => {
    axios
      .post("/Marie-ERP/api/stocks/selectingStock", {
        userId: user.userId,
      })
      .then((res) => setStocks(res.data))
      .catch((err) => console.log(err));
  }, [user.userId]);

  return (
    <Row className="mt-1">
      {/* Header with menu icon */}
      <Col sm={2} className="header">
        <Button
          variant="light"
          onClick={() => setShowMenu(!showMenu)}
          className="menu-icon btn p-2 w-100 text-dark   rounded-2"
        >
           <i class="fa-solid fa-bars"></i>  Categories
        </Button>
      </Col>

      {/* First column with categories */}
      {showMenu && (
        <Col sm={2} className="border-end">
          {stocks.selectedData?.map((page, i) => {
            return (
              <NavLink
                key={i}
                className={({ isActive }) =>
                  isActive ? "fw-bold isActive nav-link my-1" : "nav-link my-1"
                }
                to={`/dashboard/ingredients/purchasing/${page.category}`}
              >
                <div className="lnk">
                  <p className="my-1 mx-auto">{page.category}</p>
                </div>
              </NavLink>
            );
          })}
        </Col>
      )}

      {/* Main content */}
      <Col sm={showMenu ? 10 : 12} className="">
        <Outlet />
      </Col>
    </Row>
  );
};

export default Purchase;
