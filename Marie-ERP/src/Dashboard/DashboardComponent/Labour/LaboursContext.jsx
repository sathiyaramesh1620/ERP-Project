import React, { createContext, useState } from 'react';

export const LaboursDataContext = createContext();

const LaboursContext = ({ children }) => {
  const [selectedDateTravel, setSelectedDateTravel] = useState()
  const [selectedLabour, setSelectedLabour] = useState([]);
  const [name, setName] = useState('');
  const [fulltime, setFullTime] = useState('');
  const [foreigner, setForeigner] = useState('');
  const [salary, setSalary] = useState('');
  const [productivity, setProductivity] = useState('');
  
  const [restDates, setRestDates] = useState([])
  const [restDayCount, setRestDayCount] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  
  const[activity, setActivity] = useState({})
  
  const[openingBalance, setOpeningBalance] = useState(false)
  const[annual, setAnnual] = useState('')
  const [restDays,setRestDays] = useState([])
  const [userDefineDays,  setUserDefineDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [inputValues, setInputValues] = useState({});
  const [activityData, setActivityData] = useState([]);
  const [empId, setEmpId] = useState("");
  const [ffs, setffs] = useState({});
  const [userDefinedStatus, setuserDefinedStatus] = useState(false);

  return (
    <LaboursDataContext.Provider
      value={{
        selectedLabour,
        setSelectedLabour,
        name,
        setName,
        fulltime,
        setFullTime,
        foreigner,
        setForeigner,
        salary,
        setSalary,
        productivity,
        setProductivity,

        restDates,
        setRestDates,
        restDayCount,
        setRestDayCount,
        month,
        setMonth,
        year,
        setYear,

        activity,
        setActivity,

        openingBalance,
        setOpeningBalance,
        annual,
        setAnnual,
        
        restDays,
        setRestDays,
        userDefineDays,
        setUserDefineDays,
        selectedDate,
        setSelectedDate,
        inputValues,
        setInputValues,
        selectedDateTravel, setSelectedDateTravel,
        activityData,
        setActivityData,
        empId, setEmpId,
        ffs,
        setffs,
        userDefinedStatus,
        setuserDefinedStatus,
      }}>
      {children}
    </LaboursDataContext.Provider>
  );
};

export default LaboursContext;
