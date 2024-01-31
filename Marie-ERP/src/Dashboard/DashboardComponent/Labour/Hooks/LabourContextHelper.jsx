import React, { useContext } from 'react'
import LaboursContext, { LaboursDataContext } from '../LaboursContext'

const LabourContextHelper = () => {
    const {
      setName,name,
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
    } = useContext(LaboursDataContext)
 
 
    return {setName,name,
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
    }
}

export default LabourContextHelper