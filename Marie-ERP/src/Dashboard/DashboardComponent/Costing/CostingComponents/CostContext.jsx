import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'

export const CostDataContext = createContext();

const CostContext = ({children}) => {
    const [data, setData] = useState()
    const [monthYearr, setMonthYearr] = useState('')
   
    const [ftype, setFtype] = useState('')
    const [costItem, setCostItem] = useState([]);
    const [salesChan, setSalesChan] = useState([])
    const [sidesSelectedItems, setSideSelectedItems] = useState([]);
    const [premixTotal, setPremixTotal] = useState(0);
    const [mainsTotal, setMainsTotal] = useState(0);
    const [selectedSalesChannel, setSelectedSalesChannel] = useState("");
    const [PrepTotal, setPrepTotal] = useState('');
    const [ProdTotal, setProdTotal] = useState('');
    const [foodBev, setFoodBev] = useState([])
    //---------------------GENERAL------------------------------
    const [selectedItem, setSelectedItem] = useState("");
    const [selectedType, setselectedType] = useState("");
    const [preparation, setPreparation] = useState("");
    const [servings, setServings] = useState("")
   
    //----------------------SALES----------------------------------------
      const [salesVolume, setSalesVolume] = useState('')
      const [price, setPrice] = useState('')
      const [currency, setCurrency] = useState('')
      const [applyPriceToAllChannels, setApplyPriceToAllChannels] = useState(false)

      //---------------------------------------------
      const [premixIngredients, setPremixIngredients] = useState([])
      const [mainsIngredients, setMainsIngredients] = useState([])
      
      //---------------------------------------------
      const [costLabour, setCostLabour] = useState([]);
      const [SidesSave, setSidesSave] = useState([])

      return (
    <CostDataContext.Provider value={{
       data, setData,
       monthYearr, setMonthYearr,
      
       ftype,setFtype,
       costItem, setCostItem,
       salesChan, setSalesChan,
       sidesSelectedItems, setSideSelectedItems,
       premixTotal, setPremixTotal,
       mainsTotal, setMainsTotal,
       selectedSalesChannel, setSelectedSalesChannel,
       PrepTotal, setPrepTotal,
       ProdTotal, setProdTotal,
       foodBev, setFoodBev,
       
       selectedItem, setSelectedItem,
       selectedType, setselectedType,
       preparation, setPreparation,
       servings, setServings,

       salesVolume, setSalesVolume,
       price, setPrice,
       currency, setCurrency,
       applyPriceToAllChannels, setApplyPriceToAllChannels,

       premixIngredients, setPremixIngredients,
       mainsIngredients, setMainsIngredients,
       SidesSave, setSidesSave,
       costLabour, setCostLabour
       }}>

        {children}
    </CostDataContext.Provider>
  )
}

export default CostContext