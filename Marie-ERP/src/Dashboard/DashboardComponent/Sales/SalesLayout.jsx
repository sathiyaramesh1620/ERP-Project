import React from "react";
import { Container } from "react-bootstrap";
import SalesHeader from "./SalesHeader";
import { Outlet } from "react-router-dom";

const SalesLayout = () => {
  return (
    <Container fluid>
      <SalesHeader />
      <div className="mt-4">
        <Outlet />
      </div>
    </Container>
  );
};

export default SalesLayout;
