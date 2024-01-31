import { useContext } from "react";
import { OverheadsContext } from "../OverHeadsContext";
import { UserContext } from "../../../../Context/UserContext";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPenToSquare, FaRegFloppyDisk, FaTrashCan } from "react-icons/fa6";
//import { IoCloseCircleOutline } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { PiFloppyDiskBold } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { CiSaveUp2 } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {
  faCircleXmark,
  faFloppyDisk,
  faPenToSquare,
  faSmileWink,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import InputValue from "./InputValue";
import DisplayInputValue from "./DisplayInputValue";
import MutiselectProcessBuilder from "./MutiselectProcessBuilder";
import { Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import axios from "axios";
import { Tab } from "@mui/material";

const TableViewRow = ({ val, index, isEdit, setIsEdit }) => {
  
  //console.log(val)
  //console.log(name, "NAME")
  const {
    state,
    dispatcher,
    totalRowData,
    setTotalRowData,
    processBuilder,
    initialRowData,
    setTrigger
  } = useContext(OverheadsContext);
  const { user } = useContext(UserContext);
  const [ processBuilderOptions, setProcessBuilderOptions ] = useState([])
  const [ cancelToggle, setCancelToogle ] = useState(false)
  const [ spent, setSpent ] = useState(state.data[index] ? state.data[index].spent : "")
  const { data } = state;
  const [step, setStep] = useState("display"); // select | input | display
  const processBuilSelectData = data[index]?.processBuilderRelationship
    ? Object.keys(data[index]?.processBuilderRelationship)
    : [];
  
    useEffect(() => {
      axios.post('/Marie-ERP/api/processBuilder/fetch', {
        userId: user.userId ? user.userId : 3
      })
      .then((res) => {
        console.log(res, 'Response know')
        const categories  = res.data.data.processBuilder.data.data.subCatPross[state.category][val] 
        setProcessBuilderOptions(categories)

        //console.log(processBuilderOptions, 'RRRRR')
      })
      },[state.category, val, isEdit, setIsEdit])

    // console.log(processBuilder, 'TableROWSA VIEW');

  
  

  const totalPercentage = state.data[index]?.processBuilderRelationship
    ? Object.values(state.data[index]?.processBuilderRelationship).reduce(
        (acc, cur) => Number(acc) + Number(cur),
        0
      )
    : 0;

    console.log(initialRowData, 'ROW DATA')
    // console.log(data, 'DATA')
  const notify = () => toast("Wow so easy!");

  const lesser = () => {
    toast.warn("Process Builder Percentage is Lesser than 100", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const greater = () => {
    toast.warn("Process Builder Percentage is Greater than 100", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const save = () => {
    toast.success("Data Saved Successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const empty = () => {
    toast.error(`Input Field Can't be Empty`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const edit = () => {
    toast.error(`Please save the given data before edit`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const dataNotSaved = () => {
    toast.error(`Edited data remains unsaved`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const del = () => {
    toast.success(`Deleted Sucessfully`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // useEffect(() => {
  //   axios.post('/Marie-ERP/api/overheads/store', {
  //     userId: 90
  //   })
  //   .then((res) => console.log(res, 'LL'))
  // },[])
 

  function handleSave() {
    async function storeData() {
      try {
        const res = await axios.post("/Marie-ERP/api/overheads/store", {
          ...state,userId: user.userId ? user.userId : "90",
          category : state.category,
          report : state.report,
          cycle : state.cycle,
          data : data ,
        });
        // console.log(res, 'kk');
        // console.log(` catogory:${state.category},
        //               report:${state.report},
        //               cycle:${state.cycle},
        //               date:${data}`)
        if (res.status === 200) {
          setStep("display");
          save();
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (totalPercentage === 100 && state.data[index].spent !== "") {
      console.log("100");
      storeData();
      setIsEdit(false);
    }
    if (state.data[index]?.spent === "") {
      empty();
    }
    if (totalPercentage < 100) {
      lesser();
    }
    if (totalPercentage > 100) {
      greater();
    }
  }

  function handleEdit() {
    // console.log(val)
    setCancelToogle(true)
    if (isEdit === false) {
      setStep("input");
      setIsEdit(true);
    } else {
      edit();
    }
  }

  //console.log(state.data[index])
  const handleCancel = () => {
    setTrigger(true)
    setCancelToogle(false)
    setStep('display')
    setIsEdit(false)
    dataNotSaved()
  }

  function handleDelete() {
    const newObj = {
      ...state,
      data: { ...state.data, [index]: initialRowData },
    };
    async function deleteRowData() {
      try {
        const res = await axios.post("/Marie-ERP/api/overheads/store", {
          userId: user.userId ? user.userId : "90",
          ...newObj,
        });
        console.log(res);
        if (res.status === 200) {
          dispatcher({ type: "delete", payload: newObj });
          del();
        }
      } catch (error) {}
    }
    const conf = confirm(`Are you sure delete ${val} data`);
    if (conf) {
      deleteRowData();
    }
  }

  //   useEffect(
  //     function () {
  //       const target = state.data[index];
  //       if (state.data[index]) {
  //         setRowData({
  //           expenditure: target.expenditure,
  //           spent: target.spent,
  //           extrapolation: Math.floor(Number(target.spent) / 12),
  //           processBuilderRelationship: target.processBuilderRelationship,
  //         });
  //       }
  //     },
  //     [state.category, state.month, state.year]
  //   );

  //   function handleProcess(e) {
  //     let newObj = {};
  //     e.forEach((element) => (newObj = { ...newObj, [element]: "" }));
  //     setRowData({ ...rowData, processBuilderRelationship: newObj });
  //   }

  //   function handleSave() {
  //     setTotalRowData({ ...totalRowData, [index]: rowData });
  //     const newData = {
  //       ...state,
  //       userId: user.userId ? user.userId : "90",
  //       data: { ...totalRowData, [index]: rowData },
  //     };
  //     dispatcher({ type: "savedData", payload: newData });
  //     async function storeData() {
  //       try {
  //         const res = await axios.post("/Marie-ERP/api/overheads/store", {
  //           ...newData,
  //         });
  //         if (res.data.message === "Success") {
  //           setIsEdit(false);
  //           setIsSaved(true);
  //         } else {
  //           throw new Error("Somthing wrong while saving data");
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     storeData();
  //   }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click Edit To Enter Input Value
    </Tooltip>
  );

  const renderTooltipTwo = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      The Value Depends on Spent Value
    </Tooltip>
  );


  
  return (
    <tr className="" >
      <td className="col-3 ps-4 fw-bold">{val}</td>
      <td className="p-2 col-2">
        <InputGroup>
          <InputGroup.Text>RM</InputGroup.Text>
          {isEdit ? (<Form.Control
            type="Number"
            
            value={state.data[index] ? state.data[index].spent : ""}
            style={{
              background: "transparent",
            }}
            disabled={step === "display" ? true : false}
            onChange={(e) => {
              const target = e.target.value;
              // setRowData({
              //   ...rowData,
              //   expenditure: val,
              //   spent: target,
              //   extrapolation: `${Math.floor(Number(target) / 12)}`,
              // });
              dispatcher({
                type: "rowData",
                payload: { index, expenditure: val, spent: target },
              });
            }}
          />)
          :(<OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
            >
            <Form.Control
              type="Number"
              value={state.data[index] ? state.data[index].spent : ""}
              style={{
                background: "transparent",
              }}
              disabled={step === "display" ? true : false}
              onChange={(e) => {
                const target = e.target.value;
                // setRowData({
                //   ...rowData,
                //   expenditure: val,
                //   spent: target,
                //   extrapolation: `${Math.floor(Number(target) / 12)}`,
                // });
                dispatcher({
                  type: "rowData",
                  payload: { index, expenditure: val, spent: target },
                });
              }}
            />
            </OverlayTrigger>)
          }
          
        </InputGroup>
      </td>
      {state.cycle === "Annual" && (
        <td className="">
          <InputGroup>
            <InputGroup.Text>RM</InputGroup.Text>
            <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipTwo}
            >
            <Form.Control
              value={state.data[index] ? state.data[index].extrapolation : ""}
              type="number"
              disabled
              style={{
                background: "transparent",
              }}
            />
            </OverlayTrigger>
          </InputGroup>
        </td>
      )}

      {/* TODO: SELECT PROCESS BUILDER */}
      <td className="col-4">
        {step === "select" && (
          <span className="position-relative">
            <MutiselectProcessBuilder
              // rowData={rowData}
              // setRowData={setRowData}
              //   val={val}
              index={index}
              setStep={setStep}
              processBuilderoptions={processBuilderOptions}
              //processBuilderoptions={processBuilder}
            />
          </span>
        )}

        {step === "input" && (
          <div className="ps-3 py-2 text-center">
            {processBuilSelectData.map((data, i) => (
              <InputValue data={data} key={i} index={index} />
            ))}
            <span
              className="btn me-1 mt-2"
              style={{
                border: "none",
                outline: "none",
                padding: "3px 15px",
                background: "#FCA311",
                borderRadius: "17px",
                color: "#ffffff",
              }}
              onClick={() => setStep("select")}>
              Add
            </span>
          </div>
        )}

        {step === "display" && (
          <div className="ps-3 py-2 text-start">
            {processBuilSelectData.map((data, i) => (
              <DisplayInputValue data={data} key={i} index={index} />
            ))}
          </div>
        )}
      </td>
      <td className="text-center col-1">
        {/* <button
            className={`btn ${
              isEdit ? "btn-success" : "btn-light"
            } rounded-1 m-2`}
            onClick={() => setIsEdit(false)}>
            Save
          </button>
          <button
            className="btn btn-primary rounded-1 m-2"
            onClick={() => setIsEdit(true)}>
            Edit
          </button>
          <button
            className="btn btn-danger rounded-1 m-2"
            onClick={() => setSpend("0")}>
            Delete
          </button> */}
        {/* <FontAwesomeIcon
          //   onClick={handleSave}
          className="btn p-1"
          icon={faFloppyDisk}
          style={{ color: "#63ff0f" }}
        />

        <FontAwesomeIcon
          className="btn p-1"
          icon={faPenToSquare}
          onClick={() => setIsEdit(true)}
        />
        <FontAwesomeIcon
          className="btn p-1"
          icon={faCircleXmark}
          style={{ color: "#ff0000" }}
          onClick={() => {
            setSpend("0");
          }}
        /> */}
        <div className="actions" style={{ display: "flex" }}>
          
            <span
              className="btn w-75 h-100 fs-1 p-1"
              style={{
                color: "#14213D",
                transform: "scale(0.6)",
              }}
              onClick={handleSave}>
              <PiFloppyDiskBold />
            </span>
        
         
            { cancelToggle ? (
            <p  className="btn w-75 h-100 fs-1 p-1" 
                onClick={handleCancel}
                style={{
                  color: "#cc0000",
                  transform: "scale(0.6)",
                }}>
                <IoMdCloseCircleOutline />
              </p> ) : (<span
              className="btn w-75 h-100 fs-1 p-1"
              style={{
                color: "#e38d02",
                transform: "scale(0.6)",
              }}
              onClick={handleEdit}>
              <FaRegEdit />
            </span>)}
          
          <span
            className=" w-75 h-100 fs-1 p-1"
            style={{
              color: "#cc0000",
              transform: "scale(0.6)",
            }}
            onClick={handleDelete}>
            <MdDeleteOutline />
          </span>
        </div>
      </td>
    </tr>
  );
}


export default TableViewRow