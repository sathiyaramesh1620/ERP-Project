import { useReducer } from "react";
import { createContext } from "react";
import moment from "moment";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import { useState } from "react";
import axios from "axios";
import { set } from "lodash";

const day = new Date();
const month = moment(day).format("MMMM");
const year = moment(day).format("YYYY");
const OverheadsContext = createContext();

//const [processBuilder, setProcessBuilder] = useState([])


// const processBuilder = [
//   "A-PROCUREMENT",
//   "B-STORAGE",
//   "C1-PREPARATION-FOOD",
//   "C2-PREPARATION-BEVERAGES",
//   "D1-COOKING-FOOD",
//   "D2-MIXING-BEVERAGES",
//   "E1-DINE-IN-ORDERING",
//   "E2-DELIVERY-PLATFORM-ORDERING",
//   "E3-TELEPHONE-ORDERING",
//   "E4-ONLINE ORDERING",
//   "E5-TAKEAWAY ORDERING",
//   "F1-DINE-IN-PRESENTATION",
//   "F2-DELIVERY-PLATFORM-PACKAGING",
//   "F3-TELEPHONE-PACKAGING",
//   "F4-ONLINE PACKAGING",
//   "F5-TAKEAWAY PACKAGING",
//   "G1-DINE-IN-SERVING",
//   "G2-DELIVERY-PLATFORM-SERVING",
//   "G3-TELEPHONE-SERVING",
//   "G4-ONLINE SERVING",
//   "G5-TAKEAWAY SERVING",
//   "H1-DINE-IN-PAYING",
//   "H2-DELIVERY-PLATFORM-PAYING",
//   "H3-TELEPHONE-PAYING",
//   "H4-ONLINE PAYING",
//   "H5-TAKEAWAY PAYING",
//   "I-CLEANING",
//   "J-FACILITY-MANAGEMENT",
//   "K-EMPLOYEE-WELFARE",
//   "L-ADMINISTRATIVE",
// ];

const initialState = {
  category: "",
  report: "Historical",
  cycle: "Annual",
  month,
  year,
  data: {},
};

const initialRowData = {
  expenditure: "",
  spent: "",
  extrapolation: "",
  processBuilderRelationship: {},
};

//TODO: reducer function

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "fetch":
      return { ...state , data: { ...payload } };
    case "nodatafound":
      return {
        ...state,
        data: {},
      };
    case "categories":
      console.log(payload);
      return { ...state, category: payload };
    case "report":
      console.log(payload);
      return { ...state, report: payload };
    case "cycle":
      console.log(payload);
      return { ...state, cycle: payload };
    case "date":
      console.log(payload);
      const month1 = moment(payload).format("MMMM");
      const year1 = moment(payload).format("YYYY");
      return { ...state, month: month1, year: year1 };
    case "rowData":
      return {
        ...state,
        data: {
          ...state.data,
          [payload.index]: {
            ...state.data[payload.index],
            expenditure: payload.expenditure,
            spent: payload.spent,
            extrapolation: Math.floor(Number(payload.spent) / 12),
          },
        },
      };
    case "ProcessBuilderSelect":
      let newObj = {};
      payload.value.map((val) => {
        newObj = { ...newObj, [val]: "" };
      });

      return {
        ...state,
        data: {
          ...state.data,
          [payload.index]: {
            ...state.data[payload.index],
            processBuilderRelationship: newObj,
          },
        },
      };
    case "ProcessBuilder":
      console.log(action);

      return {
        ...state,
        data: {
          ...state.data,
          [payload.index]: {
            ...state.data[payload.index],
            processBuilderRelationship: {
              ...state.data[payload.index].processBuilderRelationship,
              [payload.key]: payload.value,
            },
          },
        },
      };
    case "reset":
      return { ...state, category: "", data: {} };
    case "delete":
      return payload;
    default:
      return state;
  }
}

function OverHeadsProvider({ children }) {
  const [state, dispatcher] = useReducer(reducer, initialState);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState({});
  const [totalRowData, setTotalRowData] = useState({});
  const [processBuilder, setProcessBuilder] = useState([])
  const [trigger, setTrigger] = useState(true)

  useEffect(() => {
    axios.post('/Marie-ERP/api/processBuilder/fetch', {
        userId: user.userId ? user.userId : 3
      })
      .then((res) => {
        console.log(res, 'Response')
        const builder = res.data.data.processBuilder.data.data.activity
        //const keys = Object.keys(builder)
        setProcessBuilder(builder)
      }) 
      .catch((err) => console.log(err))
  },[])
  

  

  function handleSave(index, rowData) {
    setTotalRowData({ ...totalRowData, [index]: rowData });
    const newData = {
      ...state,
      data: { ...totalRowData, [index]: rowData },
    };
    dispatcher({ type: "savedData", payload: newData });
    async function storeData() {
      try {
        const res = await axios.post("/Marie-ERP/api/overheads/store", {
          ...newData,
          userId: user.userId ? user.userId : "90",
        });

        console.log(res, "AAAA")
      } catch (error) {
        console.log(error);
      }
    }
    storeData();
  }

  useEffect(function () {
    // fetch items from api or session
    async function fetchItem() {
      const sessionCat = sessionStorage.getItem("overheadsCat");
      try {
        if (sessionCat) {
          const sessionData = JSON.parse(sessionCat);
          setTableData(sessionData);
        } else {
          const res = await axios.post("/Marie-ERP/api/overheads/categories");
          console.log('session ', res.data.categories)
          setTableData(res.data.categories);
          sessionStorage.setItem("overheadsCat",JSON.stringify(res.data.categories))
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
    fetchItem();
  }, []);

  useEffect(
    function () {
      // fetch table data from api
      async function fetchTableDate() {
        try {
          setIsLoading(true);
          console.log("start");
          if (state.category) {
            const res = await axios.post("/Marie-ERP/api/overheads/fetch", {
              userId: user.userId ? user.userId : "90",
              category: state.category,
              // month: state.month,
              // year: state.year,
            });
            console.log('datas' , res.data.data.datas);
            
            if (res.data.data.datas) console.log("data found");
            dispatcher({ type: "fetch", payload: res.data.data.datas});
            setIsLoading(false);
            if (!res.data.data.datas) {
              console.log("nodata");
              dispatcher({ type: "nodatafound" });
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchTableDate();
    },
    [state.category, setTrigger, trigger]
  );

  return (
    <OverheadsContext.Provider
      value={{
        state,
        dispatcher,
        isLoading,
        setIsLoading,
        tableData,
        setTableData,
        processBuilder,
        totalRowData,
        setTotalRowData,
        handleSave,
        initialRowData,
        trigger,
        setTrigger,
      }}>
      {children}
    </OverheadsContext.Provider>
  );
}

export { OverheadsContext , OverHeadsProvider };
