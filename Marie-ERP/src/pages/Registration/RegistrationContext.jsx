import React, { createContext, useState } from "react";

export const UserRegistrationContext = createContext();

const RegistrationContext = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [BasicInformation, setBasicInformation] = useState({
    businessType: "",
    otherbusinessType: "",
    businessName: "",
  });
  
  const [contactInformation, setContactInformation] = useState({
    email: "",
    phone: "",
    address: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [otherInformation, setOtherInformation] = useState({
    dineInCapacity: "",
    typeOfCuisine: "",
    channels:"",
    currentMonth: " ",
    currentYear: " ",
  });

  const [operatingDays, setOperatingDays] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const [userDetails, setUserDetails] = useState({
    email: contactInformation.email,
    plan_id: "",
  });

  return (
    <UserRegistrationContext.Provider
      value={{
        BasicInformation,
        setBasicInformation,
        contactInformation,
        setContactInformation,
        otherInformation,
        setOtherInformation,
        operatingDays,
        setOperatingDays,
        currentStep,
        setCurrentStep,
        userDetails,
        setUserDetails,
      }}>
      {children}
    </UserRegistrationContext.Provider>
  );
};

export default RegistrationContext;
