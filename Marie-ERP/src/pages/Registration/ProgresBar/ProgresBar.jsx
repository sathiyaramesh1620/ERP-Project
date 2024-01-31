import React from "react";
import "./ProgresBar.css";

const ProgresBar = ({ currentStep }) => {
  const steps = [
    "Basic Information",
    "Contact Information",
    "Operating Days",
    "Other Information",
    "Create a Password",
  ];
  return (
    <div>
      <section className="step-wizard">
        <ul className="step-wizard-list">
          {steps.map((steps, i) => {
            return (
              <li
                key={i}
                className={
                  currentStep - 1 === i
                    ? "step-wizard-item current-item"
                    : "step-wizard-item"
                }>
                <div className="mb-2">
                  <span
                    className="progress-count"
                    style={
                      currentStep - 1 >= i
                        ? {
                            background: "#FCA311",
                          }
                        : {
                            transform: "scale(.5)",
                          }
                    }>
                    {i + 1}
                  </span>
                </div>
                <div
                  style={
                    currentStep - 1 >= i
                      ? {
                          color: "#FCA311",
                        }
                      : null
                  }>
                  <span className="progress-label">{steps}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default ProgresBar;
