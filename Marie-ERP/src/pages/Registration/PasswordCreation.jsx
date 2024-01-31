import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { REGISTRATION_API } from "../../API/Api";
import { UserRegistrationContext } from "./RegistrationContext";
import { UserContext } from "../../Context/UserContext";
import PasswordStrengthMeter from "./PasswordStrengthMeter/PasswordStrengthMeter";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const PasswordCreation = () => {
  const nav = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const {
    BasicInformation,
    contactInformation,
    otherInformation,
    operatingDays,
    userDetails,
    setCurrentStep,
  } = useContext(UserRegistrationContext);

  const [passwordNotMatch, setPasswordNotMatch] = useState(false);

  const validationSchema = Yup.object().shape({
    new_password: Yup.string()
      .min(5, "Password must be at least 5 characters long")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const postRegistration = (values, { setSubmitting }) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: '/Marie-ERP/api/registration',
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        BasicInformation,
        contactInformation,
        operatingDays,
        otherInformation,
        plan_type: userDetails.plan_id,
        password: values.new_password,
      }),
    };

    axios(config)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setUser(response.data);
          nav("/payment");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      
  };

  return (
    <div className="pb-1" xs={12} sm={12} md={12} lg={6}>
      <div className="d-flex  flex-column pb-3 text-center login-page-right-side">
        <div className="w-50 mx-auto">
          <div className="form_label  fw-medium "><span className=" p-1 rounded me-2 vh-1 pt-0 pb-0" style={{ height:"1px" , background: "#14213D" }} ></span>Create a Password</div>
        </div>
      </div>
      <Formik
        initialValues={{
          new_password: "",
          confirm_password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (values.new_password === values.confirm_password) {
            postRegistration(values, { setSubmitting });
          } else {
            setPasswordNotMatch(true);
            setSubmitting(false);
          }
        }}>
        {({ handleSubmit, handleChange,handlePasswordChange, values,value, isSubmitting }) => (
          <Form className="w-50 mx-auto mt-3">
            <label htmlFor="new_password">
              <strong>Password</strong>
            </label>
            <div className="input-icons my-2">
              <i className="fa-solid fa-lock icon"></i>
              <i
                className={
                  values.showPassword
                    ? "fa-solid fa-eye icon-show-password"
                    : "fa-solid fa-eye-slash icon-show-password"
                }
                onClick={() =>
                  handleChange({
                    target: {
                      name: "showPassword",
                      value: !values.showPassword,
                    },
                  })
                }></i>
              <Field
                type={values.showPassword ? "text" : "password"}
                id="new_password"
                name="new_password"
                className="input-field form-control px-5"
                required
              />
              {values.new_password && (
                <PasswordStrengthMeter passwordData={values.new_password} />
              )}
            </div>
            <ErrorMessage
              name="new_password"
              component="div"
              className="text-danger"
            />

            <label htmlFor="confirm_password" className="mt-4">
              <strong>Confirm your password</strong>
            </label>
            <div className="input-icons my-2">
              <i className="fa-solid fa-lock icon"></i>
              <i
                className={
                  values.setPassword
                    ? "fa-solid fa-eye icon-show-password"
                    : "fa-solid fa-eye-slash icon-show-password"
                }
                onClick={() =>
                  handleChange({
                    target: {
                      name: "setPassword",
                      value: !values.setPassword,
                    },
                  })
                }></i>
              <Field
                type={values.setPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                className="input-field form-control px-5"
                required
              />
              {values.confirm_password && (
                <PasswordStrengthMeter passwordData={values.confirm_password} />
              )}
            </div>
            <ErrorMessage
              name="confirm_password"
              component="div"
              className="fs-6 text-danger"
            />

            {passwordNotMatch && (
              <p className="fs-6 text-danger">
                Password and Confirm password not match
              </p>
            )}

            <div className="mt-4 float-start">
              <Button
                className="btn-2"
                onClick={() => {
                  setCurrentStep(4);
                }}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{ color: "#ffffff" }}
                />{" "}
                Back
              </Button>
            </div>
            <div className="mt-4 float-end">
              <Button type="submit" disabled={isSubmitting} className="btn text-white"
              style={{backgroundColor:'#FCA311'}}
              >
                {isSubmitting ? "Submitting..." : "Finish"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PasswordCreation;
