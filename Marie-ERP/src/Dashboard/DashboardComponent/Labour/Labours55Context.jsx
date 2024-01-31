import React, { createContext, useState } from 'react';

export const LaboursDataContext = createContext();

const LaboursContext = ({ children }) => {
  //-------------------------------------------------------------------------------------------
  const [selectedDateTravel, setSelectedDateTravel] = useState()
  //-------------------------------------------------------------------------
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
  //------------------------------------------------------------------------
  return (
    <LaboursDataContext.Provider
      value={{ 
        selectedLabour, setSelectedLabour, 
        name, setName, 
        fulltime, setFullTime, 
        foreigner, setForeigner, 
        salary, setSalary,
        productivity, setProductivity,

        restDates, setRestDates,
        restDayCount, setRestDayCount,
        month, setMonth,
        year, setYear,
        
        activity, setActivity,

        openingBalance, setOpeningBalance,
        annual, setAnnual,
        
        selectedDateTravel, setSelectedDateTravel
      }}
    >
      {children}
    </LaboursDataContext.Provider>
  );
};

export default LaboursContext;
