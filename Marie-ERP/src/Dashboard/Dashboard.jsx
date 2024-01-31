import React, { useContext,useState, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import loader from '/assets/loader.svg';
const Dashboard = () => {
  const { user } = useContext(UserContext);
  const nav = useNavigate();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user.token) {
      setMsg("Login success");
      setTimeout(() => {
        nav("/dashboard/home");
      }, 1000);
    } else {
      setMsg("Please Login...");
      setTimeout(() => {
        nav("/");
      }, 1000);
    }
  }, []);
  return (
    <>
      <Container
        className="d-flex justify-content-center align-items-center h-100">
          <img src={loader} alt="loader" />
        <div className="h1">{msg} <br/> Please wait...</div>
      </Container>
    </>
  );
};

export default Dashboard;
