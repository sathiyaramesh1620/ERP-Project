import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import CostingHeader from "./CostingHeader";

const CostingLayout = () => {
  return (
    <Container fluid>
      <CostingHeader />
      <div className="mt-4">
        <Outlet />
      </div>
    </Container>
  );
};

export default CostingLayout;
