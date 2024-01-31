import React, {useState, useEffect} from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import { useContext } from "react";
import { CostDataContext } from "./CostContext";
import { Link } from "react-router-dom";
import { number } from 'yup';
import { UserContext } from '../../../../Context/UserContext';


const DirectLabour = () => {
  const { user } = useContext(UserContext);
  const {servings, ftype, setPrepTotal, setProdTotal, foodBev, sidesSelectedItems, costLabour, setCostLabour } = useContext(CostDataContext)
  
  console.log(foodBev);

  const [lwh, setLWH] = useState('');
  const [rmPerL, setRmPerL] = useState('');
  const [batchCost, setBatchCost] = useState('');

  const [lwh1, setLWH1] = useState('');
  const [rmPerL1, setRmPerL1] = useState('');
  const [batchCost1, setBatchCost1] = useState('');

  const [lwh2, setLWH2] = useState('');
  const [rmPerL2, setRmPerL2] = useState('');
  const [batchCost2, setBatchCost2] = useState('');

  const [lwh3, setLWH3] = useState('');
  const [rmPerL3, setRmPerL3] = useState('');
  const [batchCost3, setBatchCost3] = useState('');


  const preparationTotal = ftype === '1' ? parseFloat(lwh || 0) + parseFloat(lwh2 || 0) : parseFloat(lwh);
  
  const productionTotal = ftype === '1' ? parseFloat(lwh1 || 0) + parseFloat(lwh3 || 0) : parseFloat(lwh1);

  setPrepTotal(preparationTotal)
  setProdTotal(productionTotal)

  console.log(preparationTotal, productionTotal, '-------');

  useEffect(() => {
    if (lwh !== '' && rmPerL !== '') {
      const calculatedCost = parseFloat(lwh) * parseFloat(rmPerL);
      setBatchCost(calculatedCost.toFixed(2));
    } else {
      setBatchCost('');
    }
  }, [lwh, rmPerL]);

  useEffect(() => {
    if (lwh1 !== '' && rmPerL1 !== '') {
      const calculatedCost1 = parseFloat(lwh1) * parseFloat(rmPerL1);
      setBatchCost1(calculatedCost1.toFixed(2));
    } else {
      setBatchCost1('');
    }
  }, [lwh1, rmPerL1]);

  useEffect(() => {
    if (lwh2 !== '' && rmPerL2 !== '') {
      const calculatedCost2 = parseFloat(lwh2) * parseFloat(rmPerL2);
      setBatchCost2(calculatedCost2.toFixed(2));
    } else {
      setBatchCost2('');
    }
  }, [lwh2, rmPerL2]);

  useEffect(() => {
    if (lwh3 !== '' && rmPerL3 !== '') {
      const calculatedCost3 = parseFloat(lwh3) * parseFloat(rmPerL3);
      setBatchCost3(calculatedCost3.toFixed(2));
    } else {
      setBatchCost3('');
    }
  }, [lwh3, rmPerL3]);


  const unitCost = servings ? (batchCost / servings).toFixed(2) : batchCost;
  const unitCost1 = servings ? (batchCost1 / servings).toFixed(2) : batchCost1;
  const unitCost2 = servings ? (batchCost2 / servings).toFixed(2) : batchCost2;
  const unitCost3 = servings ? (batchCost3 / servings).toFixed(2) : batchCost3;

 
  useEffect(() => {
    if (ftype === '1') {
      // Accessing the 'food' object and its keys by using strings
      const c1PreparationFood = foodBev?.food?.['C1. PREPARATION - FOOD'];
      const d1ProductionFood = foodBev?.food?.['D1. COOKING - FOOD'];
      // Set the 'rmPerL' value for the first type
      setRmPerL(c1PreparationFood ? c1PreparationFood.toString() : '');
      setRmPerL1(d1ProductionFood ? d1ProductionFood.toString() : '');
      setRmPerL2(c1PreparationFood ? c1PreparationFood.toString() : '');
      setRmPerL3(d1ProductionFood ? d1ProductionFood.toString() : '');
    } else if (ftype === '2') {
      // Accessing the 'beverage' object and its keys by using strings
      const c2PreparationBeverages = foodBev?.beverage?.['C2. PREPARATION - BEVERAGES'];
      const c2ProductionBeverages = foodBev?.beverage?.['D2. MIXING - BEVERAGES'];
      // Set the 'rmPerL' value for the second type
      setRmPerL(c2PreparationBeverages ? c2PreparationBeverages.toString() : '');
      setRmPerL1(c2ProductionBeverages ? c2ProductionBeverages.toString() : '');
    }
  }, [ftype, foodBev]);
  
 

  useEffect(() => {
    // Prepare data based on your logic and ftype value
    let foodData = [];
    let SideData = [];
    let beverageData =[];

    if (ftype === '1') {
      if(sidesSelectedItems.length > 0){
        foodData = [
          { name :'C1. Preparation' ,dlh: lwh , rmPerDLH: rmPerL, batchCost: batchCost, unitCost: unitCost},
          { name :'D1. Production' ,dlh: lwh1 , rmPerDLH: rmPerL1, batchCost: batchCost1, unitCost: unitCost1},]
         SideData = [{ name :'C1. Preparation' ,dlh: lwh2, rmPerDLH: rmPerL2, batchCost: batchCost2, unitCost: unitCost2},
          { name :'D1. Production' ,dlh: lwh3, rmPerDLH: rmPerL3, batchCost: batchCost3, unitCost: unitCost3},]
      } else{
      foodData = [
        { name :'C1. Preparation' ,dlh: lwh, rmPerDLH: rmPerL, batchCost: batchCost, unitCost: unitCost },
        { name :'D1. Production' ,dlh: lwh1, rmPerDLH: rmPerL1, batchCost: batchCost1, unitCost: unitCost1 },
        // Add other objects based on your requirements (lwh1, rmPerL1, batchCost1, unitCost1, etc.)
      ] }
    } else if (ftype === '2') {
      beverageData = [
        { name :'C2. Preparation' ,dlh: lwh, rmPerDLH: rmPerL, batchCost: batchCost, unitCost: unitCost },
        { name :'D2. Production' ,dlh: lwh1, rmPerDLH: rmPerL1, batchCost: batchCost1, unitCost: unitCost1 },
        
      ];
    }

    setCostLabour([{foodData, SideData, beverageData}]); // Update the formattedData state variable
  }, [lwh, rmPerL, batchCost, unitCost, ftype, lwh1, lwh2, lwh3, rmPerL1, rmPerL2, rmPerL3, batchCost1, batchCost2, batchCost3, unitCost1, unitCost2, unitCost3 ]);

console.log(costLabour, '----------');

//----------------session storage ------------------------

const saveDataToSessionStorage = () => {
  sessionStorage.setItem("lwh", lwh);
  sessionStorage.setItem("lwh1", lwh1);
  sessionStorage.setItem("lwh2", lwh2);
  sessionStorage.setItem("lwh3", lwh3);
};

useEffect(() => {
  // Retrieve data from session storage on component mount
  const lwh = sessionStorage.getItem("lwh");
  const lwh1 = sessionStorage.getItem("lwh1");
  const lwh2 = sessionStorage.getItem("lwh2");
  const lwh3 = sessionStorage.getItem("lwh3");

  // Set the state with the retrieved values
  if (lwh) {
    setLWH(lwh);
  }
  if (lwh1) {
    setLWH1(lwh1);
  }
  if (lwh2) {
    setLWH2(lwh2);
  }
  if (lwh3) {
    setLWH3(lwh3);
  }
}, []);

useEffect(() => {
  // Save data to session storage when values change
  saveDataToSessionStorage();
}, [lwh, lwh1, lwh2, lwh3]);


//-----------------------------------------------------------------------

  return (
    <div>
      
      
    {ftype == 1 && (
      <>
    <h5>C1.Preparation</h5>
    
    <Table bordered className='text-center mt-3' >
      <thead>
        <th className='border-1'>DLH</th>
        <th className='border-1'>RM per DLH</th>
        <th className='border-1'>Batch Cost</th>
        <th className='border-1'>Unit Cost</th>
      </thead>
      <tr>
        <td className='border-1'>
        <Form.Control
        placeholder='Direct labour hours'
              type='number'
              className='text-center border-0 '
              style={{ height: '40px' }}
              value={lwh}
              onChange={(e) => setLWH(e.target.value)}
             
            />
        </td>
         <td className='border-1'>
            <Form.Control
            placeholder=''
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={rmPerL}
              onChange={(e) => setRmPerL(e.target.value)}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={batchCost}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={unitCost}
              readOnly
            />
          </td>
      </tr>
      </Table>   

      <h5 className='mt-5'>D1.Production</h5>
      <Table bordered className='text-center mt-3' >
      <thead>
      <th className='border-1'>DLH</th>
        <th className='border-1'>RM per DLH</th>
        <th className='border-1'>Batch Cost</th>
        <th className='border-1'>Unit Cost</th>
      </thead>
      <tr>
        <td className='border-1'>
        <Form.Control
        placeholder='Direct labour hours'
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={lwh1}
              onChange={(e) => setLWH1(e.target.value)}
             
            />
        </td>
         <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={rmPerL1}
              onChange={(e) => setRmPerL1(e.target.value)}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white'}}
              value={batchCost1}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={unitCost1}
              readOnly
            />
          </td>
      </tr>
      </Table>
      
      {sidesSelectedItems.length > 0 && (
        <> 
      <h5 className='pt-3 text-center '>Sides</h5>
      <h5>C1.Preparation</h5>
    
    <Table bordered className='text-center mt-3' >
      <thead>
        <th className='border-1'>DLH</th>
        <th className='border-1'>RM per DLH</th>
        <th className='border-1'>Batch Cost</th>
        <th className='border-1'>Unit Cost</th>
      </thead>
      <tr>
        <td className='border-1'>
        <Form.Control
        placeholder='Direct labour hours'
              type='number'
              className='text-center border-0 '
              style={{ height: '40px' }}
              value={lwh2}
              onChange={(e) => setLWH2(e.target.value)}
             
            />
        </td>
         <td className='border-1'>
            <Form.Control
            placeholder=''
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={rmPerL2}
              onChange={(e) => setRmPerL2(e.target.value)}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={batchCost2}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={unitCost2}
              readOnly
            />
          </td>
      </tr>
      </Table>   

      <h5 className='mt-5'>D1.Production</h5>
      <Table bordered className='text-center mt-3' >
      <thead>
      <th className='border-1'>DLH</th>
        <th className='border-1'>RM per DLH</th>
        <th className='border-1'>Batch Cost</th>
        <th className='border-1'>Unit Cost</th>
      </thead>
      <tr>
        <td className='border-1'>
        <Form.Control
        placeholder='Direct labour hours'
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={lwh3}
              onChange={(e) => setLWH3(e.target.value)}
             
            />
        </td>
         <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={rmPerL3}
              onChange={(e) => setRmPerL3(e.target.value)}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white'}}
              value={batchCost3}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={unitCost3}
              readOnly
            />
          </td>
      </tr>
      </Table></>  )}
      </>)} 


      {ftype == 2 && (
      <>
    <h5>C2.Preparation</h5>
    
    <Table bordered className='text-center mt-3' >
      <thead>
        <th className='border-1'>DLH</th>
        <th className='border-1'>RM per DLH</th>
        <th className='border-1'>Batch Cost</th>
        <th className='border-1'>Unit Cost</th>
      </thead>
      <tr>
        <td className='border-1'>
        <Form.Control
        placeholder='Direct labour hours'
              type='number'
              className='text-center border-0 '
              style={{ height: '40px' }}
              value={lwh}
              onChange={(e) => setLWH(e.target.value)}
             
            />
        </td>
         <td className='border-1'>
            <Form.Control
            placeholder=''
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={rmPerL}
              onChange={(e) => setRmPerL(e.target.value)}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={batchCost}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={unitCost}
              readOnly
            />
          </td>
      </tr>
      </Table>   

      <h5 className='mt-5'>D2.Production</h5>
      <Table bordered className='text-center mt-3' >
      <thead>
      <th className='border-1'>DLH</th>
        <th className='border-1'>RM per DLH</th>
        <th className='border-1'>Batch Cost</th>
        <th className='border-1'>Unit Cost</th>
      </thead>
      <tr>
        <td className='border-1'>
        <Form.Control
        placeholder='Direct labour hours'
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={lwh1}
              onChange={(e) => setLWH1(e.target.value)}
             
            />
        </td>
         <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px' }}
              value={rmPerL1}
              onChange={(e) => setRmPerL1(e.target.value)}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white'}}
              value={batchCost1}
              readOnly
            />
          </td>
          <td className='border-1'>
            <Form.Control
              type='number'
              className='text-center border-0'
              style={{ height: '40px', backgroundColor : 'white' }}
              value={unitCost1}
              readOnly
            />
          </td>
      </tr>
      </Table>  </>)}
     
      <div className='d-flex justify-content-between  '>
    <div className="text-start mx-3 mt-4">
      <Link to="/dashboard/cost/costingredients">
        <Button
          className="float-end btn btn-warning text-white border-0 "
         // type="submit"
          style={{ width: "7rem", backgroundColor : '#fca311' }}>
         <i className="fa-solid fa-arrow-left" style={{color: '#ffffff'}}></i> Previous {" "}
        </Button>
      </Link></div>

    <div className="text-end mx-3 mt-4">
      <Link to="/dashboard/cost/costoverheads">
        <Button
          className="float-end btn text-white border-0 "
         // type="submit"
          style={{ width: "6rem", backgroundColor : '#fca311' }}>
          Next {" "}<i className="fa-solid fa-arrow-right" style={{color: '#ffffff'}}></i>
        </Button>
      </Link></div></div>
    
    </div>
  )
}

export default DirectLabour