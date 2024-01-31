import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Row, Modal, Form, Spinner } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import { IngredientsDataContext } from "./IngredienstsContext";
import "./Stock.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import 'jspdf-autotable';



const getCurrentMonthYear = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 to get the actual month number
  const currentYear = currentDate.getFullYear();
  return { currentMonth, currentYear };
}


const StockLayout = () => {

  //const [addItemError, setAddItemError] = useState(false)
  const [stockErrorStatement, setStockErrorStatement] = useState(false)
  const [planErrorStatement, setPlanErrorStatement] = useState(false)
  const [dateErrorStatement, setDateErrorStatement] = useState(false)
  const [existingDateErrorStatement, setExistingDateStatement] = useState(false)
  
  const { selectedIngredients } = useContext(IngredientsDataContext);
  const { user, commonApi } = useContext(UserContext);
  const [stocks, setStocks] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [firstDate, setFirstDate] = useState('')
  const [endDate1, setEndDate1] = useState('')


  const currency = commonApi.currency
  

  //console.log(selectedIngredients, "-----");
  useEffect(() => {
    axios
      .post("/Marie-ERP/api/stocks/selectingStock", {
        userId: user.userId ? user.userId : 7,
      })
      .then((res) => {
        setStocks(res.data);
        console.log(res, 'selecting stock');
      })
      .catch((err) => console.log(err));
  }, []);

  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

//  useEffect(() => {
//   axios
//     .post('/Marie-ERP/api/stocks/download' ,{
//       userId: 19,
//       from_date: '2024-01-01',
//       to_date:'2024-01-06'
//     })
//     .then((res) => {
//       console.log(res, 'Aashiq')
//     })
//  },[])  

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);


  const handleShow = () => setShowModal(true);

  const [showModal1, setShowModal1] = useState(false);

  const handleClose1 = () => {
    setShowModal1(false)
    setStockErrorStatement(false)
    setDateErrorStatement(false)
    setPlanErrorStatement(false)
    setExistingDateStatement(false)
  }
  
  const handleShow1 = () => setShowModal1(true);

  const [categorySelected, setCategorySelected] = useState("");
  const [ingredientSelected, setIngredientSelected] = useState("");
  const [ingredientId, setIngredientId] = useState('')
  

  //----------------------------------------------------
  const [stockCount, setStockCount] = useState("");
  const [planToBuyCount, setPlanToBuyCount] = useState("");
  
  const formatDate = (date) => {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    return `${yyyy}-${mm}-${dd}`;
};
  const currentDate = formatDate(new Date())
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const [refresh, setRefresh] = useState(false)
  // Function to handle ingredient selection
  const handleIngredientSelect = (category, ingredient, ingredientId) => {
    setCategorySelected(category);
    setIngredientSelected(ingredient);
    setIngredientId(ingredientId)
  };
 // console.log(categorySelected, ingredientSelected, 'Aashiq');
 const [allowStock, setAllowStock] = useState(true)

 const [download, setDownload] = useState()

  useEffect(() => {
    axios.post('/Marie-ERP/api/stocks/download',{
      userId : user.userId ? user.userId : 19, from_date : firstDate, to_date : endDate1
    })
    .then(response => {
     // console.log(response.data.data, 'download all')
      setDownload(response.data.data)
    })
    .catch(error => {console.log(error)})
  },[firstDate, endDate1])
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log({
          userId: user.userId ? user.userId : 7,
          category: categorySelected.toString(),
          item: ingredientId.toString(),
        }, 'Stock list');
  
        const response = await axios.post("/Marie-ERP/api/stocks/list", {
          userId: user.userId ? user.userId : 7,
          category: categorySelected.toString(),
          item: ingredientId.toString(),
        });


 // console.log(response);
     //   console.log(response.data.stocks.length - 1);
        const arraylength = response.data.stocks.length - 1;
        const stockss = response.data.stocks[arraylength]
     //   console.log(stockss.bought);
        
       
        if((stockss.bought === null || stockss.bought === '' || stockss.bought === undefined) || (stockss.pricePerUnit === null ||stockss.pricePerUnit === '' || stockss.pricePerUnit === undefined) || (stockss.stockCount === null ||stockss.stockCount === '' || stockss.stockCount === undefined) || (stockss.planToBuy === null ||stockss.planToBuy === '' || stockss.planToBuy === undefined)){
          setAllowStock(false)
        }else{setAllowStock(true)}

      //  console.log(allowStock);
        if (
          response.data.stocks &&
          response.data.stocks.isStock !== undefined &&
          response.data.stocks.isStock === false
        ) {
          setStockData('Please');
        } else {
          const sortedStocks = response.data.stocks.sort((a, b) => {
            return new Date(b.datecreated) - new Date(a.datecreated);
          });
          const stocksWithPriceDifferences = calculatePriceDifferencesPercentage(sortedStocks)
          setStockData(stocksWithPriceDifferences);
          setIsLoading(false);
        }
      } catch (error) {
      //  console.log(error);
        setStockData('Please');
        setIsLoading(false);
        setAllowStock(true)
      } 
    };
  
    fetchData(); // Calling the async function
    
  }, [ingredientSelected, categorySelected]);
  
  //console.log(calculatePriceDifferences, 'Differn')

  const calculatePriceDifferencesPercentage = (stocks) => {
    let stockWithDifferences = [...stocks]
    for (let i = 0; i < stocks.length; i++){
      if(i === stocks.length - 1) {
        stockWithDifferences[i] = { ...stockWithDifferences[i], priceDifference: null }
      } else {
        const price1 = parseFloat(stockWithDifferences[i].pricePerUnit);
        const price2 = parseFloat(stockWithDifferences[i + 1].pricePerUnit)
      //  console.log(price1, price2)
        const priceDifference = price1 - price2
      //  console.log(priceDifference, 'priceDifference')
        const priceDifferencePercentage = (priceDifference/price2)*100
        stockWithDifferences[i] = {...stockWithDifferences[i], priceDifferPercentage: priceDifferencePercentage.toFixed(0) }
      }
    }
  //  console.log(stockWithDifferences, 'hh')
    return stockWithDifferences
  }
 
  const deleteStock = (stockId) => {
    axios
      .post("/Marie-ERP/api/stocks/delete", {
        userId: user.userId ? user.userId : 7,
        stockId,
      })
      .then((response) => {
      //  console.log(response);
        if(response.status === 200){
          const fetchData = async () => {
            try {
              setIsLoading(true);
              console.log({
                userId: user.userId ? user.userId : 7,
                category: categorySelected.toString(),
                item: ingredientId.toString(),
              }, 'stock delete');
        
              const response = await axios.post("/Marie-ERP/api/stocks/list", {
                userId: user.userId ? user.userId : 7,
                category: categorySelected.toString(),
                item: ingredientId.toString(),
              });
      
      
       // console.log(response);
            //  console.log(response.data.stocks.length - 1);
              const arraylength = response.data.stocks.length - 1;
              const stockss = response.data.stocks[arraylength]
            //  console.log(stockss.bought);
              
             
              if((stockss.bought === null || stockss.bought === '' || stockss.bought === undefined) || (stockss.pricePerUnit === null ||stockss.pricePerUnit === '' || stockss.pricePerUnit === undefined) || (stockss.stockCount === null ||stockss.stockCount === '' || stockss.stockCount === undefined) || (stockss.planToBuy === null ||stockss.planToBuy === '' || stockss.planToBuy === undefined)){
                setAllowStock(false)
              }else{setAllowStock(true)}
      
            //  console.log(allowStock);
              if (
                response.data.stocks &&
                response.data.stocks.isStock !== undefined &&
                response.data.stocks.isStock === false
              ) {
                setStockData('Please');
              } else {
                const sortedStocks = response.data.stocks.sort((a, b) => {
                  return new Date(b.datecreated) - new Date(a.datecreated);
                });
                const stocksWithPriceDifferences = calculatePriceDifferencesPercentage(sortedStocks)
                setStockData(stocksWithPriceDifferences);
                setIsLoading(false);
              }
            } catch (error) {
            //  console.log(error);
              setStockData('Please');
              setIsLoading(false);
              setAllowStock(true)
            } 
          };
        
          fetchData();
        }
      })
      .catch((error) => console.log(error));
   // console.log(stockId, "delete");
  };


   // Function to save the edited values
   const handleSaveEdit = (stockId) => {
    // Implement your logic to update the API with editedValues
    // Upon successful update, update the UI accordingly
    
    
   // console.log("Edited Values:", editedValues); // This will show the edited values in the console

    console.log({
      userId: 7,
      stockId,
      ingredientsData: editedValues,
    });

    axios
      .post("/Marie-ERP/api/stocks/edit", {
        userId: user.userId ? user.userId : 7,
        stockId,
        ingredientsData: editedValues,
      })
      .then((response) => {
      //  console.log(response)
        if(response.status === 200){
          const fetchData = async () => {
            try {
              setIsLoading(true);
              console.log({
                userId: user.userId ? user.userId : 7,
                category: categorySelected.toString(),
                item: ingredientId.toString(),
              }, 'stock edit');
        
              const response = await axios.post("/Marie-ERP/api/stocks/list", {
                userId: user.userId ? user.userId : 7,
                category: categorySelected.toString(),
                item: ingredientId.toString(),
              });
      
      
      //  console.log(response);
             // console.log(response.data.stocks.length - 1);
              const arraylength = response.data.stocks.length - 1;
              const stockss = response.data.stocks[arraylength]
            //  console.log(stockss.bought);
              
             
              if((stockss.bought === null || stockss.bought === '' || stockss.bought === undefined) || (stockss.pricePerUnit === null ||stockss.pricePerUnit === '' || stockss.pricePerUnit === undefined) || (stockss.stockCount === null ||stockss.stockCount === '' || stockss.stockCount === undefined) || (stockss.planToBuy === null ||stockss.planToBuy === '' || stockss.planToBuy === undefined)){
                setAllowStock(false)
              }else{setAllowStock(true)}
      
             // console.log(allowStock);
              if (
                response.data.stocks &&
                response.data.stocks.isStock !== undefined &&
                response.data.stocks.isStock === false
              ) {
                setStockData('Please');
              } else {
                const sortedStocks = response.data.stocks.sort((a, b) => {
                  return new Date(b.datecreated) - new Date(a.datecreated);
                });
                const stocksWithPriceDifferences = calculatePriceDifferencesPercentage(sortedStocks)
                setStockData(stocksWithPriceDifferences);
                setIsLoading(false);
              }
            } catch (error) {
             // console.log(error);
              setStockData('Please');
              setIsLoading(false);
              setAllowStock(true)
            } 
          };
        
          fetchData();

        }
      })
      .catch((error) => console.log(error));
    toggleEditMode(stockId);
  };

  



  
  // Handlers for input changes
  const handleStockCountChange = (e) => {
    const value = e.target.value;
      setStockErrorStatement(false)
    if (value >= 0) {
      setStockCount(value);
    }
  };

  const handlePlanToBuyCountChange = (e) => {
    const value = e.target.value;
     setPlanErrorStatement(false)
    if (value >= 0) {
      setPlanToBuyCount(value);
    }
  };

  const handleDateChange = (e) => {
    setDateErrorStatement(false)
    setExistingDateStatement(false)
    setSelectedDate(e.target.value);
  };

  

//console.log(ingredientId, "ingredientId");
  // Function to handle saving the inputs
  const handleSave = () => {
    // Validation: Check if the inputs are not empty
    console.log({
      userId: user.userId ? user.userId : 7,
      category: categorySelected,
      item: ingredientId.toString(),
      ingredientsData: {
        stockCount,
        planToBuy: planToBuyCount,
        date: selectedDate,
      },
    })
    
    if(addToItemValidate()){
      
      axios
      .post("/Marie-ERP/api/stocks/create", {
        userId: user.userId ? user.userId : 7,
        category: categorySelected,
        item: ingredientId.toString(),
        ingredientsData: {
          stockCount,
          planToBuy: planToBuyCount,
          date: selectedDate,
        },
      })
      .then((response) => 
      {
        //console.log(response)
        if(response.status === 200){
          const fetchData = async () => {
            try {
              setIsLoading(true);
              console.log({
                userId: user.userId ? user.userId : 7,
                category: categorySelected.toString(),
                item: ingredientId.toString(),
              });
        
              const response = await axios.post("/Marie-ERP/api/stocks/list", {
                userId: user.userId ? user.userId : 7,
                category: categorySelected.toString(),
                item: ingredientId.toString(),
              });
      
      
      //  console.log(response);
             // console.log(response.data.stocks.length - 1);
              const arraylength = response.data.stocks.length - 1;
              const stockss = response.data.stocks[arraylength]
             // console.log(stockss.bought);
              
             
              if((stockss.bought === null || stockss.bought === '' || stockss.bought === undefined) || (stockss.pricePerUnit === null ||stockss.pricePerUnit === '' || stockss.pricePerUnit === undefined) || (stockss.stockCount === null ||stockss.stockCount === '' || stockss.stockCount === undefined) || (stockss.planToBuy === null ||stockss.planToBuy === '' || stockss.planToBuy === undefined)){
                setAllowStock(false)
              }else{setAllowStock(true)}
      
             // console.log(allowStock);
              if (
                response.data.stocks &&
                response.data.stocks.isStock !== undefined &&
                response.data.stocks.isStock === false
              ) {
                setStockData('Please');
              } else {
                const sortedStocks = response.data.stocks.sort((a, b) => {
                  return new Date(b.datecreated) - new Date(a.datecreated);
                });
                const stocksWithPriceDifferences = calculatePriceDifferencesPercentage(sortedStocks)
                setStockData(stocksWithPriceDifferences);
                setIsLoading(false);
              }
            } catch (error) {
              //console.log(error);
              setStockData('Please');
              setIsLoading(false);
              setAllowStock(true)
            } 
          };
        
          fetchData();
        }
      })
      .catch((error) => console.log(error));
    handleClose1();

    // console.log({
    //   userId: user.userId ? user.userId : 7,
    //   category: categorySelected,
    //   item: ingredientId.toString(),
    //   ingredientsData: {
    //     stockCount,
    //     planToBuy: planToBuyCount,
    //     date: selectedDate,
    //   },
    // });
    // Clear inputs or close modal after successful saving
    setStockCount("");
    setPlanToBuyCount("");
    setSelectedDate(currentDate);

     // console.log('its validate')
    } else {
      return
    }

    if (
      stockCount.trim() === "" ||
      planToBuyCount.trim() === "" ||
      selectedDate.trim() === ""
    ) {
      // Handle empty inputs, show error message or take appropriate action
     // console.log("Please fill in this all fields.");
      return;
    }

    

  };

  const addToItemValidate = () => {
    let success = true
    
   if(stockCount.trim() === "") {
      setStockErrorStatement(true)
      console.log(stockErrorStatement)
      success = false
    } else {
      setStockErrorStatement(false)
    }

    if(planToBuyCount.trim() === ""){
      setPlanErrorStatement(true)
      success = false
    } else {
      setPlanErrorStatement(false)
    }

    if(selectedDate.trim() === "") {
      success = false
    } else {
      const currentDate = new Date()
      const inputDate = new Date(selectedDate)
      currentDate.setHours(0, 0, 0, 0)
      inputDate.setHours(0, 0, 0, 0)
      if (inputDate < currentDate) {
          setDateErrorStatement(true)
          setExistingDateStatement(false)
          success = false 
        } else {
            if(Array.isArray(stockData)) {
              const existingDate = stockData.some(obj => obj.datecreated === selectedDate) 
                if (existingDate) {
                  setExistingDateStatement(true);
                  setDateErrorStatement(false)
                  success = false;
                } else {
                  setDateErrorStatement(false)
                  setExistingDateStatement(false);
                  success = true; 
                }
              }
            } 
          }
    
    return success
  }
// const existingDate = () => {
//   return stockData.some(obj => obj.datecreated === selectedDate)
// }
 

  const getFormattedDate = (dateString) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);

    // Get the day name and date value
    const dayName = days[date.getDay()];
    const dateValue = date.getDate();

    return { dayName, dateValue };
  };

  const [editMode, setEditMode] = useState(null);
  const [editedValues, setEditedValues] = useState({
    stockCount: "",
    planToBuy: "",
    bought: "",
    pricePerUnit: "",
    // Add other fields as required
  });

  // Function to handle editing mode for a specific stock item
  const toggleEditMode = (stockId) => {
    setEditMode(stockId === editMode ? null : stockId);
    // Reset editedValues when exiting edit mode
   // console.log(stockId)
    if (stockId !== editMode) {
      const selectedStock = stockData.find(stock => stock.id === stockId);
      if (selectedStock) {
        setEditedValues({
          stockCount: selectedStock.stockCount,
          planToBuy: selectedStock.planToBuy,
          bought: selectedStock.bought,
          pricePerUnit: selectedStock.pricePerUnit,
          // Set other fields as required based on your data structure
        });
      }
    } else {
      setEditedValues({
        stockCount: "",
        planToBuy: "",
        bought: "",
        pricePerUnit: "",
        // Reset other fields as required
      });
    }
  };
  

  // Function to handle input changes in edit mode
  const handleEditInputChange = (e, field) => {
    const { value } = e.target;
    if (value >= 0) {
      
      setEditedValues(prevState => ({
        ...prevState,
        [field]: value
      }));
    }
  };

 

  const handleCancelEdit = () => {
    setEditMode(null); // Set editMode to null or a default value to exit edit mode
  };


const generatePDF = () => {
  try {
    const pdf = new jsPDF();

    const categories = Object.keys(download.category || {});

    const headerStyles = { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign: 'left' };
    const subHeaderStyles = { fillColor: [189, 195, 199], textColor: 0, fontStyle: 'bold', halign: 'right' };
    const bodyStyles = { textColor: 0 };

    categories.forEach(categoryKey => {
      const category = download.category[categoryKey];

      // Print main category heading on the left side
      pdf.setFontSize(16);
      pdf.setTextColor(0);
      //pdf.text(20, pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 20 : 10, categoryKey);

      Object.keys(category.stock).forEach(stockName => {
        const stocks = category.stock[stockName].stocks || [];

        // Print subcategory heading on the right side
        pdf.setTextColor(0);
       // pdf.text(180, pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 20 : 10, stockName);

        const headers = ['No','Category', 'Item', 'Stock', 'PlanToBuy', 'Bought', 'Price', 'Consumption', 'ClosingStock', 'Date'];
        const stockData = stocks.map((stock, index) => [
          `${index + 1}`,
          `${stock.category}`,
          `${stock.item}`,
          `${stock.stockCount || ''}`,
          `${stock.planToBuy || ''}`,
          `${stock.bought || ''}`,
          `${stock.pricePerUnit || ''}`,
          `${stock.consumption || ''}`,
          `${stock.closingStock || ''}`,
          `${stock.datecreated || ''}`,
          
        ]);

        pdf.autoTable({
          head: [headers],
          body: stockData,
          theme: 'striped',
          styles: {
            header: headerStyles,
            body: bodyStyles,
            cell : {align : 'center'}
          },
          columnStyles: {
            0: { cellWidth: 10 }, // Adjust column width for the "NO" column
            // Add more styles for other columns if needed
          }
        });
        
      });
    });

    pdf.save(`Stock_Report.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};



const getFormattedDate1 = (dateString) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const date = new Date(dateString);

  const monthName = months[date.getMonth()].substr(0, 3);
  const dateValue = date.getDate();
  const year = date.getFullYear().toString().substr(-2);

  return `${monthName} ${year}`;
};

const [draggedButton, setDraggedButton] = useState(null);

  const handleDragStart = (e, button, category) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedButton({ ...button, category: category });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetButton, buttons, category) => {
    e.preventDefault();

    if (
      !draggedButton ||
      draggedButton.ingredientId === targetButton.ingredientId ||
      draggedButton.category !== category
    ) {
      return;
    }

    const draggedButtonIndex = buttons.findIndex(
      (button) => button.ingredientId === draggedButton.ingredientId
    );
    const targetButtonIndex = buttons.findIndex(
      (button) => button.ingredientId === targetButton.ingredientId
    );

    const updatedButtons = [...buttons];
    updatedButtons.splice(draggedButtonIndex, 1);
    updatedButtons.splice(targetButtonIndex, 0, draggedButton);

    const updatedForStocks = stocks.selectedData.map((stock) => {
      if (stock.category === category) {
           const updatedArray = {
             userId: stocks.userId,
             category: stock.category,
             data: updatedButtons,
           };
          //  console.log(updatedArray)
          const response = axios.post("/Marie-ERP/api/stocks/dragDrop", {
            userId: user.userId ? user.userId : 7,
            data: updatedArray.data,
            category: updatedArray.category
          });
          console.log(response, "response", updatedArray);
        return {
          ...stock,
          ingredients: updatedButtons,
          
        };
      } else {
        return stock;
      }

    });
const allUpdated = {
  userId: user.userId ? user.userId : 7,
  selectedData: updatedForStocks,
};
// console.log(updatedForStocks)
    const updatedJsonString = JSON.stringify(allUpdated);
    localStorage.setItem("ordered_items", updatedJsonString);
    const getItems = localStorage.getItem("ordered_items");
    const storedData = JSON.parse(getItems);
    setStocks(storedData);
    // console.log(stocks, "stocks")
// console.log(storedData, "storedData");

    // setStocks(updatedArray);
    setDraggedButton(null);
  };



const [monthYear, setMonthYear] = useState(getCurrentMonthYear());
const { currentMonth, currentYear } = monthYear;

const filterStockDataByMonthYear = (stockData, selectedMonth, selectedYear) => {
  if (!stockData || !Array.isArray(stockData)) {
    return [];
  }

  const filteredStockData = stockData.filter((stock) => {
    if (!stock.datecreated) {
      return false;
    }

    const stockDate = new Date(stock.datecreated);
    const stockMonth = stockDate.getMonth() + 1; // Months are zero-based
    const stockYear = stockDate.getFullYear();

    return stockMonth === selectedMonth && stockYear === selectedYear;
  });

  return filteredStockData;
};

const handleMonthChange = (e) => {
  const selectedDate = new Date(e.target.value);
  const selectedMonth = selectedDate.getMonth() + 1;
  const selectedYear = selectedDate.getFullYear();
  setMonthYear({ currentMonth: selectedMonth, currentYear: selectedYear });
};

// Usage: Call this function passing stockData, currentMonth, and currentYear
const selectedMonth = monthYear.currentMonth;
const selectedYear = monthYear.currentYear;
const filteredData = filterStockDataByMonthYear(stockData, selectedMonth, selectedYear);



//console.log(stocks, 'AAA')
//console.log(stockData); 

//To checking price difference value type is in number   
function isValidateNumber(value) {
  const number = parseFloat(value)
  return !isNaN(number) && isFinite(number) && number !== -100;
}

 const [unit, setUnit] = useState('kg')
useEffect(() => {
let unit = filteredData[0]?.unit
setUnit(unit)
}, [filteredData])

console.log(unit, 'unit');

  return (
    <>
      {/* Header */}
      <Row className=" p-1 text-start">
        <Col sm={2} className=" d-flex ">
          <button
            className="btn  fs-5 text-dark  rounded-2"
            onClick={toggleMenu}>
            <i className="fa-solid fs-5 fa-bars mx-2"></i> 
          </button>
          <button className={'btn p-2'} onClick={handleShow}>
                  <i className="fs-4 mx-2 fa-solid fa-download"></i>
          </button>
        </Col>
      </Row>

      <>
      
      <Row className=" ">
      {showMenu && (
            <Col lg={2} className="  text-start">
              <div className=" mt-2 ">
                {Array.isArray(stocks.selectedData) &&
                stocks.selectedData.length > 0 ? (
                  stocks.selectedData?.map((category, i) => (
                    <div key={i}>
                      <h4 className=" py-2 mt-3 rounded-2 text-start">
                        {category.category}
                      </h4>
                      {/* Mapping ingredients */}
                      <ul style={{ listStyle: "none" }} className="">
                        {category.ingredients?.map((ingredient, index) => (
                          <li key={index}>
                            <button
                              className={
                                ingredientSelected === ingredient.ingredient
                                  ? "custom-stockcard-category-ingredient-active"
                                  : "custom-stockcard-category-ingredient"
                              }
                              draggable
                              onDragStart={(e) =>
                                handleDragStart(
                                  e,
                                  ingredient,
                                  category.category
                                )
                              }
                              onDragOver={(e) => handleDragOver(e)}
                              onDrop={(e) => {
                                handleDrop(
                                  e,
                                  ingredient,
                                  category.ingredients,
                                  category.category
                                );
                              }}
                              onClick={() =>
                                handleIngredientSelect(
                                  category.category,
                                  ingredient.ingredient,
                                  ingredient.ingredientId
                                )
                              }>
                              {/* {console.log(category.category)} */}
                              {/* {console.log(
                                "category : ",
                                category.category
                              )} */}
                              {index + 1}. {ingredient.ingredient}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p>No stocks available</p>
                )}
              </div>
            </Col>
          )}
   
  

          {ingredientSelected.length > 0 && (
            <Col lg={showMenu ? 10 : 12} className="">
              <div className="d-flex justify-content-between mt-2">
                <p style={{fontSize : '37.33333333333333px', color : '#012160'}}>{ingredientSelected}</p>
                <div className="d-flex justify-content-end ">
                <div className="mx-2 " > <Form.Control
          type="month"
          className="inputM"
          value={`${currentYear}-${String(currentMonth).padStart(2, '0')}`}
          onChange={handleMonthChange}
        /></div>
                <div>
                
                <button className={`btn px-3 text-white link ${allowStock ? '' : ' d-none '}`} style={{backgroundColor : '#012160', fontSize : '20px'}} onClick={handleShow1}>
                  +
                </button>
                <button className={`btn px-3 text-white link ${allowStock ? 'd-none' : ''}`} style={{backgroundColor : '#012160', fontSize : '20px'}}>+</button>
                </div></div>
              </div>
              
                {
                  isLoading ? (
                    <>
                    <div className="w-100 mt-3">
                      <span className="placeholder col-3 bg-primary p-3"></span>
                      <span className="placeholder col-3 bg-primary p-3"></span>
                      <span className="placeholder col-3 bg-primary p-3"></span>
                      <span className="placeholder col-3 bg-primary p-3"></span>
          
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
          
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
          
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
          
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                      <span className="placeholder col-3 p-3 mt-1"></span>
                    </div>
                  </> // Show loading indicator while fetching data
                  ) : (
                   <>
              {stockData !== "Please" ? (
                filteredData.length > 0 ?
                filteredData.map((stock, index) => (
                  <>
                    <Row key={index} className="mt-5">
                      <Col 
                      style={{backgroundColor : (index == 0 || (index % 2 == 0)) ? '#e5e5e5' : 'white'}}
                      className= 'colun shadow-sm mx-1'>
                        <Row className="text-center fw-bold">
                          <Col lg={2} className="mb-3">
                            {editMode === stock.id ? (
                              <>
                                <p className="mt-4 text-secondary">
                                  STOCKCOUNT
                                </p>
                                <Form.Control
                                  type="number"
                                  className=" border-3 border-black"
                                  value={editedValues.stockCount || ''}
                                  onChange={(e) =>
                                    handleEditInputChange(e, "stockCount")
                                  }
                                />
                              </>
                            ) : (
                              <>
                                <p className={`mt-4 text-secondary ${(stock.stockCount == '' || stock.stockCount === null || stock.stockCount === undefined ) ? 'text-danger' : ''}`}>
                                  STOCKCOUNT
                                </p>
                                <div className="d-flex justify-content-center">
                                  <h1 className={`mt-2 px-1 bighead`}>
                                    {stock.stockCount}
                                    <span
                                    className="fs-4"
                                    style={{ marginTop: showMenu ? '48%' : '38%' }}
                                   >
                                    {stock.unit}
                                  </span>
                                  </h1>
                                  
                                </div>
                              </>
                            )}
                          </Col>

                          <Col lg={2} className="">
                            {editMode === stock.id ? (
                              <>
                                <p className="mt-4 text-secondary">
                                  PLAN TO BUY
                                </p>
                                <Form.Control
                                  type="number"
                                  className=" border-3 border-black"
                                  value={editedValues.planToBuy}
                                  onChange={(e) =>
                                    handleEditInputChange(e, "planToBuy")
                                  }
                                />
                              </>
                            ) : (
                              <>
                                <p className={`mt-4 text-secondary ${(stock.planToBuy == '' || stock.planToBuy === null || stock.planToBuy === undefined) ? 'text-danger' : ''}`}>
                                  PLAN TO BUY
                                </p>
                                <div className="d-flex justify-content-center">
                                  <h1
                                    className=" px-1 bighead1"
                                    style={{ marginTop: showMenu ? '26%' : '22%' }}>
                                    {stock.planToBuy}
                                    <span
                                      className="fs-4"
                                      style={{ marginTop: showMenu ? '44%' : '37%' }}>
                                      {stock.unit}
                                    </span>
                                  </h1>
                                  
                                </div>
                              </>
                            )}
                          </Col>
                          {/* Repeat similar blocks for other stock details */}

                          <Col lg={2} >
                            <Row>
                              <Col className=''>
                                {editMode === stock.id ? (
                                  <>
                                    <p className="mt-4 text-secondary">
                                      BOUGHT
                                    </p>
                                    <Form.Control
                                      type="number"
                                      className=" border-3 border-black"
                                      value={editedValues.bought}
                                      onChange={(e) =>
                                        handleEditInputChange(e, "bought")
                                      }
                                    />
                                  </>
                                ) : (
                                  <>
                                    <p className={`mt-4 text-secondary ${(stock.bought == '' || stock.bought === null || stock.bought === undefined) ? 'text-danger' : ''}`}>
                                      BOUGHT
                                    </p>
                                    <div className="d-flex justify-content-center">
                                      <h1 className="mt-0 px-1 ">
                                        {stock.bought}
                                        <span
                                          className="fs-5"
                                          //style={{ marginTop: "12%" }}>
                                          >
                                          {stock.unit}
                                        </span>
                                      </h1>
                                      
                                    </div>
                                  </>
                                )}
                              </Col>
                            </Row>
                            <Row>
                              <Col className=''>
                                <p
                                  className="mt-3 text-secondary tex-center"
                                  // style={{ marginLeft: "27%" }}>
                                  >
                                  CONSUMPTION
                                </p>
                                <div className="d-flex justify-content-center">
                                  <h2 className="text-secondary px-1 fs-1">
                                    {stock.consumption}
                                    <span className='fs-6' style={{ marginTop: "13%" }}>{stock.unit}</span>
                                  </h2>
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={4}>
                            <Row>
                              <Col className=''>
                                {editMode === stock.id ? (
                                  <>
                                    <p className="mt-4 text-secondary">
                                      PAID PER UNIT
                                    </p>
                                    <Form.Control
                                      type="number"
                                      className=" border-3 border-black"
                                      value={editedValues.pricePerUnit}
                                      onChange={(e) =>
                                        handleEditInputChange(e, "pricePerUnit")
                                      }
                                    />
                                  </>
                                ) : (
                                  <>
                                    <p
                                      className={`mt-4 text-secondary ${(stock.pricePerUnit == '' || stock.pricePerUnit === null || stock.pricePerUnit === undefined) ? 'text-danger' : ''}`}
                                      style={{ marginLeft: "%" }}>
                                      PAID PER UNIT
                                    </p>
                                    <div className="d-flex justify-content-center">
                                      <h2>
                                        <span
                                          className="fs-5 me-1"
                                          style={{ marginTop: "5.8%" }}>
                                          {currency}
                                        </span>
                                        {stock.pricePerUnit}
                                        {isValidateNumber(stock.priceDifferPercentage) && ( 
                                        <span style={{
                                            width:'150px',
                                            //marginTop: '25px',
                                            fontSize:'12px'}}
                                          className={stock.priceDifferPercentage < 0 ? 'text-success ms-1': stock.priceDifferPercentage > 0 ? 'text-danger ms-1' : 'text-primary ms-1'}>
                                          {stock.priceDifferPercentage > 0 && <span>+</span>}{stock.priceDifferPercentage}% from last purchase
                                        </span>
                                      )}
                                  </h2>
                                      {/* <span 
                                      className={(stock.pricePerUnit/100) > 0 ? 'more mt-4' : 'less mt-4'}>
                                   {`${(stock.pricePerUnit/100) > 0 ? '+' : '-'}`}     {`${stock.pricePerUnit/100}`}
                                        
                                        </span> */}
                                    
                                    </div>
                                  </>
                                )}
                              </Col>
                            </Row>
                            <Row>
                              <Col className=''>
                                <p
                                  className="mt-4 text-secondary"
                                  style={{ marginLeft: "4%" }}>
                                  CLOSING STOCK
                                </p>
                                <div className="d-flex justify-content-center">
                                  <h2 className="text-secondary px-1 fs-1">
                                    {stock.closingStock}
                                    <span className='fs-6' style={{ marginTop: "6%" }}>{stock.unit}</span>
                                  </h2>
                                  
                                </div>
                                
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={2} className="d-flex flex-column justify-content-end">
                            <div className="">
                              <h1 className="text-center  bighead1">
                                {getFormattedDate(stock.datecreated).dateValue}
                              </h1>
                              <h4 className="text-center">{getFormattedDate1(stock.datecreated)}</h4>
                              <h5 className="text-center text-secondary">
                                {getFormattedDate(stock.datecreated).dayName}
                              </h5>
                            </div>
                            <Row>
                              <Col className="text-center">
                                {editMode === stock.id ? (
                                  <div className=" mt-2">
                                    <Button
                                      className="btn btn-warning"
                                      onClick={() => handleSaveEdit(stock.id)}>
                                      Save
                                    </Button>
                                    <Button onClick={handleCancelEdit}>
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <button
                                    className={
                                      stock.consumption && stock.closingStock
                                        ? "btn disabled fs-5 border-0"
                                        : "btn fs-5"
                                    }
                                    onClick={() => toggleEditMode(stock.id)}>
                                    <i
                                      className="fa-solid fa-pencil"
                                      style={{ color: "#12326d" }}></i>
                                  </button>
                                )}

                                {editMode === stock.id ? (
                                  ""
                                ) : (
                                  <>
                                    <button
                                      className={
                                        stock.consumption && stock.closingStock
                                          ? "btn disabled fs-5 border-0"
                                          : "btn fs-5"
                                      }
                                      onClick={() => deleteStock(stock.id)}>
                                      <i
                                        class="fa-solid fa-trash"
                                        style={{ color: "#940000" }}></i>
                                    </button>
                                  </>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                )) : (<div><h2 className="mt-3 text-center text-secondary">
                No data found in this month & year
              </h2></div>)
              ) : (
                <div>
                  <h1 className="mt-3 text-center text-secondary">
                    Please add stock
                  </h1>
                </div>
              )}</>)}
            </Col>
          )}


          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Download</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" onChange={(e) => setFirstDate(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group className="mt-4">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" onChange={(e) => setEndDate1(e.target.value)}></Form.Control>
              </Form.Group>

              <div className="text-end mt-2">
               
                <Button
                  className={`btn btn-warning rounded-2 fs-5 text-white border-0 mt-4 w-100 ${firstDate && endDate1 ? '' : 'disabled '}`}
                  onClick={generatePDF}
                  >
                  Download
                </Button>
              </div>
            </Modal.Body>
          </Modal>

          <Modal show={showModal1} onHide={handleClose1}>
            <Modal.Header closeButton>
              <Modal.Title>{ingredientSelected}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col> <Form.Label>Enter stock count</Form.Label>
                <Form.Control
                  type="number"
                  // placeholder="Enter stock count"
                  value={stockCount}
                  onChange={handleStockCountChange}
                  className="mb-1"
                  required
                /></Col>
                {unit && (
                  <Col>
                  <Form.Label>Unit of M</Form.Label>
                <Form.Control
                  type="text"
                  // placeholder="Enter stock count"
                  value={unit}
                  
                  className="mb-1"
                  readOnly
                /></Col>)}
               </Row>
                {stockErrorStatement && (
                  <p className='text-danger' style={{position:'absolute', fontSize:'12px'}}>
                    This field is required
                  </p>)}
                  <Row>
                    <Col><Form.Label className='mt-4'>Plan to buy</Form.Label>
                <Form.Control
                  type="number"
                  //placeholder="Planning to buy count"
                  value={planToBuyCount}
                  onChange={handlePlanToBuyCountChange}
                  className="mb-1"
                  required
                /></Col>
                {unit && (
                    <Col><Form.Label className='mt-4'>Unit of M</Form.Label>
                <Form.Control
                  type="text"
                  //placeholder="Planning to buy count"
                  value={unit}
                  readOnly
                  className="mb-1"
                 
                /></Col>)}
                  </Row>
                
                {planErrorStatement && (
                  <p className='text-danger' style={{position:'absolute', fontSize:'12px'}}>
                    This field is required
                  </p>)}
                {/* <p className='text-danger' style={{position:'relative'}}>Fill this field</p> */}
                <Form.Label className='mt-4'>Enter stockcount date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="mb-1"
                  required
                />
                {dateErrorStatement && (
                  <p className='text-danger' style={{position:'absolute', fontSize:'12px'}}> 
                    Ensure the selected date is in the future.
                  </p> )}
                {existingDateErrorStatement && (
                  <p className='text-danger'style={{position:'absolute', fontSize:'12px'}}>
                    Stock entry has already been recorded for the selected date
                  </p> )}
                <div className="text-end mt-2">
                  <Button
                    className="btn btn-warning"
                    onClick={() => {
                      handleSave();
                    }}>
                    Save
                  </Button>
                </div>
                
              </Form>
            </Modal.Body>
          </Modal>
        </Row>
      </>
    </>
  );
};

export default StockLayout
