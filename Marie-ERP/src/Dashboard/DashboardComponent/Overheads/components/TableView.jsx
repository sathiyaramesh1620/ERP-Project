import { useContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import TableViewRow from "./TableViewRow";
import { OverheadsContext } from "../OverHeadsContext";
// import TableViewRowsEdit from "./TableViewRowsEdit";

function TableView({ tableDatas }) {
  const { state, tableData, setTableData, isLoading } =
    useContext(OverheadsContext);
  const [isEdit, setIsEdit] = useState(false);
  console.log("notabledata", tableData[state.category]);
  console.log("state", state);
  
  
  
// console.log(tableDatas, 'SOSO')

  // useState(() => {
  //   console.log('Aas')
  // },[state.category])
  // const handleAddRow = () => {
  //   setTableData({...tableData,[state.Category]: [...tableData[state.Category], newRowData],});
  //   setNewRowData("");
  //   setAddRowModal(false);
  // };

  // const handleAddRow = () => {
  //   const newObj = {
  //     ...tableData,
  //     [state.category]: [...(tableData[state.category]||[]), newRowData],
  //   };
  //   if (newRowData.trim() !== "") {
  //     console.log("Add Row");
  //     setTableData(newObj);
  //     sessionStorage.setItem("overheadsCat",JSON.stringify(newObj))
  //     setNewRowData("");
  //     setAddRowModal(false);
  //   } else {
  //     console.log("New Row Data is empty Not adding a row");
  //   }
  // };

// useEffect(() => {
//   console.log(tableDatas, 'TABLE')
//   setProcessBuilder(tableDatas[state.category])
//   console.log(processBuilder, 'JHJHJHJH')
// },[state.category])

  
  return (
    <>
      {/* {tableData[state.category]?.length > 0 ? ( */}
      
        <table className="container-fluid a over-heads-table" style={{marginTop:'50px'}}>
          <thead>
            <tr
              className="text-center"
              style={{
                backgroundColor: "#14213D",
                color: "#ffffff",
              }}>
              <th className=" py-3 px-3">Expenditure</th>
              {state.cycle === 'Month' ? (  
                <th className="border py-3 px-3">Month Spent</th> 
                ) : ( <th className="border py-3 px-3">Annual Spent</th> )}
              
              {state.cycle === "Annual" && (
                <th className="border py-3 px-3">Month Spent</th>
              )}
              <th className="border py-3 px-3">ProcessBuilder Relationship</th>
              <th className="border py-3 px-3">Action</th>
            </tr>
          </thead>
          <tbody className="h-50 overflow-scrolla">
            {Object.keys(tableDatas).map((val, i) => (
              <TableViewRow
                val={val}
                key={i}
                index={i}
                name={name}
                //processBuilder={tableDatas[val]}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                
              />
            ))}

  
          </tbody>
        </table>
      { /* ) : (
         <p>No data available. Add new expenditures to get started.</p>
      )}*/}
      {/* <div className="text-start mb-5">
        <button
          className="btn mt-3"
          style={{
            background: "#14213D",
            color: "#ffffff",
          }}
          onClick={() => setAddRowModal(true)}
          disabled={tableData[state.category]?.length === 0}>
          Add New Expenditure
        </button>
      </div> */}
      {/* <Modal show={addRowModal} onHide={() => setAddRowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Row</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Expenditure</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter expenditure value"
              value={newRowData}
              onChange={(e) => setNewRowData(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddRowModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: "#FCA311" }} onClick={handleAddRow}>
            Add Row
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
}
export default TableView;
