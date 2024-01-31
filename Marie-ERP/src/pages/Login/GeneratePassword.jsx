import "./login.css";
import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import CustomAlert from "../../Components/CustomAlert";
import { CREATE_PASSWORD_API } from "../../API/Api";

const GeneratePassword = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [passwordData, setPasswordData] = useState({
    user_id: id,
    email: "",
    new_password: "",
    confirm_password: "",
  });

  const handleFormChange = (keyName, value) => {
    setPasswordData({ ...passwordData, [keyName]: value });
  };

  const postGeneratePassword = async (passwordData) => {
    try {
      const response = await axios.post(
        CREATE_PASSWORD_API,
        passwordData
      );
      if (response.status === 200) {
        nav("/");
      }
      console.log(response);
    } catch (err) {
      console.log(err);
      alert("Invalid");
    }
  };

  const handleFormSubmit = () => {
    if (passwordData.new_password === passwordData.confirm_password) {
      postGeneratePassword(passwordData);
    } else {
      setPasswordNotMatch(true);
      setTimeout(() => {
        setPasswordNotMatch(false);
      }, 5000);
    }
  };
  return (
    <Row className="flex-md-row-reverse">
      <Col className="py-2" xs={12} sm={12} md={12} lg={6}>
        <div className="d-flex-justify-content-center align-items-center flex-column py-3 text-center login-page-right-side">
          <div className="">
            <img
              src="/Restaruntlogo.jpg"
              alt=" "
              width={130}
              height={100}
              className="my-4 login-page-logo"
            />
            <div className="h2 mt-4 login-page-right-heading">
              Create New Password{" "}
              <i
                className="fa-solid fa-hand-point-right ms-3"
                style={{
                  color: "#fc5711",
                  width: "20px",
                  transform: "rotateZ(90deg)",
                }}
              ></i>
            </div>
          </div>
        </div>
        <Form
          className="px-1 px-sm-2 px-md-5 px-lg-4 px-xl-5 mx-lg-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="email" className="ForgotPass-label">
            <strong>Email</strong>
          </label>
          <div className="input-icons my-2">
            <i className="fa-solid fa-envelope icon"></i>
            <input
              className="input-field"
              type="text"
              id="email"
              required
              onChange={(e) => {
                handleFormChange("email", e.target.value);
              }}
            />
          </div>
          <label htmlFor="password" className="ForgotPass-label">
            <strong>Password</strong>
          </label>
          <div className="input-icons my-2">
            <i className="fa-solid fa-lock icon"></i>
            {showPassword.password ? (
              <i
                className="fa-solid fa-eye icon-show-password"
                onClick={() =>
                  setShowPassword({ ...showPassword, password: false })
                }
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye-slash icon-show-password"
                onClick={() =>
                  setShowPassword({ ...showPassword, password: true })
                }
              ></i>
            )}
            <input
              className="input-field"
              type={showPassword.password ? "text" : "password"}
              id="password"
              required
              onChange={(e) => {
                handleFormChange("new_password", e.target.value);
              }}
            />
          </div>

          <label htmlFor="confirmPassword" className="ForgotPass-label">
            <strong>Confirm Password</strong>
          </label>
          <div className="input-icons my-2">
            <i className="fa-solid fa-lock icon"></i>
            {showPassword.confirmPassword ? (
              <i
                className="fa-solid fa-eye icon-show-password"
                onClick={() =>
                  setShowPassword({ ...showPassword, confirmPassword: false })
                }
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye-slash icon-show-password"
                onClick={() =>
                  setShowPassword({ ...showPassword, confirmPassword: true })
                }
              ></i>
            )}
            <input
              className="input-field"
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              required
              onChange={(e) => {
                handleFormChange("confirm_password", e.target.value);
              }}
            />
          </div>

          <div className="mt-4">
            <button className="btn-base w-100 py-2" onClick={handleFormSubmit}>
              <div className="h4 fw-bolder text-light">Generate Password</div>
            </button>
          </div>

          {passwordNotMatch ? (
            <div className="custom-alert">
              <CustomAlert
                heading="Invalid"
                message="Password and ConfirmPasword must be same"
              />
            </div>
          ) : null}
        </Form>
      </Col>
      <Col xs={12} sm={12} md={12} lg={6} className="login-left-side">
        <div>
          <div className="login-left-triangle px-5 d-flex justify-content-center align-items-center">
            <div className="login-left-side-text text-light">
              <div className="h1">
                Food Is Our Common <br />
                Ground,
              </div>
              <p>Nothing brings people together like good food</p>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default GeneratePassword;
