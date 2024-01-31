import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Row, Col, Accordion } from 'react-bootstrap';
import axios from 'axios';
import { CostDataContext } from "./CostContext";
import { UserContext } from '../../../../Context/UserContext';
UserContext

const CostOverheads = () => {
  const { user } = useContext(UserContext);
  const { 
    selectedItem, selectedType, servings, preparation,
    salesVolume, selectedSalesChannel, price, currency, applyPriceToAllChannels,
    premixIngredients, mainsIngredients, SidesSave,
    costLabour,
    premixTotal, mainsTotal, ftype,  PrepTotal, ProdTotal, monthYearr, 

   } = 
  
  useContext(CostDataContext);
  
  
  const [overheadsData, setOverheadsData] = useState([]);
  const [overheadLabour, setOverheadLabour] = useState([])
  const [totalOverheads, setTotalOverheads] = useState(0);
  const [totalInLabour, setTotalInLabour] = useState(0)
  const [foodType, setFoodType] = useState('')

  const totalPreMain = (premixTotal + mainsTotal)
 
 const foodTypeDine = selectedSalesChannel ==="Dine-in"?"Dine In": selectedSalesChannel
  
 const [prepType, setPrepType] = useState('')

 
console.log(foodType,"1");
  
const [month, year] = monthYearr.split(" ")

useEffect(() => {
  // Update foodType based on ftype value
  console.log(foodType, '2');
  if (ftype == 1) {
    setFoodType('Food');
  } else {
    setFoodType('Beverages');
  }
}, [ftype]);

  
useEffect(() => {

  if(preparation == '1') setPrepType('Batch')
  else if (preparation == '2') setPrepType('Unit')
  else setPrepType('')

  

  console.log({
  userId : user.userId ? user.userId : '555',
  year : year, month : month, 
  
  name : selectedItem, type : foodType, general_batch : prepType, general_servings : servings,
  
  product_sales : salesVolume, sales_channel : foodTypeDine, sales_price : price, currency : currency,
  allChannelSameCost : applyPriceToAllChannels,

  ingredients: [ {premix : premixIngredients}, {mains : mainsIngredients}, {sides : SidesSave} ],

  costingLabour : costLabour,

  overheads : overheadsData, indirectLabour : overheadLabour,

}, 'Data 1');


axios.post('/Marie-ERP/api/costing/saveCosting', {
userId : user.userId ? user.userId : '555',
year : year, month : 'October', 
name : selectedItem,
})
.then(response => {console.log(response)})
.catch(error => console.log(error))
},[selectedItem, prepType, overheadsData, overheadLabour ])


  useEffect(() => {
    console.log(  {
          month: month,
          year: year,
          userId: user.userId || '90',
          salesType: foodType,
          ingCount: totalPreMain,
          salesChannel: foodTypeDine,
          preparation : PrepTotal,
          cooking : ProdTotal
        },"Axioss overead 3");
    const fetchData = async () => {
      try {
        const response = await axios.post('/Marie-ERP/api/costing/overheads', {
            month: 'October',
            year: 2023,
            userId: user.userId ? user.userId : 4,
            salesType: foodType,
            ingCount: totalPreMain,
            salesChannel: foodTypeDine,
            preparation : PrepTotal,
            cooking : ProdTotal
        });
        console.log(response, 'res');
        const responseData = response.data.data;
        setOverheadsData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [foodType, ftype]);

  useEffect(() => {
    // Calculate total whenever 'overheadsData' changes
    const values = Object.values(overheadsData);
    const total = values.reduce((acc, val) => acc + val, 0);
    setTotalOverheads(total);
  }, [overheadsData]);

  

  

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await axios.post('/Marie-ERP/api/costing/indirectLabour', {
          month: 'October',
          year: 2023,
          userId: user.userId ? user.userId : 4,
          salesType: foodType,
          ingCount: totalPreMain,
          salesChannel: foodTypeDine,
          preparation : PrepTotal,
          cooking : ProdTotal
        });
        const responseData1 = response.data.data;
        setOverheadLabour(responseData1);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData1();
  }, []);

  useEffect(() => {
    // Calculate total whenever 'overheadsData' changes
    const values = Object.values(overheadLabour);
    const total = values.reduce((acc, val) => acc + val, 0);
    setTotalInLabour(total);
  }, [overheadLabour]);

  
  const mappedRows = Object.keys(overheadsData).map((key, index) => (
    <tr key={index} className='text-center'>
      <td>{index + 1}</td>
      <td>{key}</td>
      <td>{`RM ${overheadsData[key].toFixed(2)}`}</td>
    </tr>
  ));

  const mappedRows1 = Object.keys(overheadLabour).map((key, index) => (
    <tr key={index} className='text-center'>
      <td>{index + 1}</td>
      <td>{key}</td>
      <td>{`RM ${overheadLabour[key].toFixed(2)}`}</td>
    </tr>
  ));

  

  
  return (
    <>
      <div>
        <Row className='mt-5'>
          <Col className='mx-2'>
          <h4>OVERHEADS</h4>
          <p className='pt-3'>Description</p>
          <p>{`Total : RM ${totalOverheads.toFixed(2)}`}</p>
          </Col>
          <Col lg={9} className='mx-3'>
          <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header  style={{height : '10%'}}>Overheads</Accordion.Header>
        <Accordion.Body>
        <Table bordered responsive>
          <thead>
            <tr>
              <th style={{backgroundColor: "rgb(255, 217, 155)"}} className='border-1 border-white  text-center'>No</th>
              <th style={{backgroundColor: "rgb(255, 217, 155)"}} className='border-1 border-white text-center'>Name</th>
              <th style={{backgroundColor: "rgb(255, 217, 155)"}} className='border-1 border-white text-center'>Amount</th>
            </tr>
          </thead>
          <tbody >{mappedRows}</tbody>
        </Table>
        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
          </Col>
        </Row>


        <Row className='mt-5'>
          <Col className='mx-2'>
          <h5>INDIRECT LABOUR</h5>
          <p className='pt-3'>Description</p>
          <p>{`Total : RM ${totalInLabour.toFixed(2)}`}</p>
          </Col>
          <Col lg={9} className='mx-3'>
          <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header  style={{height : '10%'}}>Indirect labour</Accordion.Header>
        <Accordion.Body>
        <Table bordered responsive>
          <thead>
            <tr>
              <th style={{backgroundColor: "rgb(255, 217, 155)"}} className='border-1 border-white  text-center'>No</th>
              <th style={{backgroundColor: "rgb(255, 217, 155)"}} className='border-1 border-white text-center'>Name</th>
              <th style={{backgroundColor: "rgb(255, 217, 155)"}} className='border-1 border-white text-center'>Amount</th>
            </tr>
          </thead>
          <tbody >{mappedRows1}</tbody>
        </Table>
        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
          </Col>
        </Row>

       
      </div>
      <div className='d-flex justify-content-between'>
        <div className='text-start mx-3 mt-4'>
          <Link to='/dashboard/cost/directlabour'>
            <Button
              className='float-end btn btn-warning text-white border-0'
              style={{ width: '7rem', backgroundColor: '#fca311' }}>
              <i className='fa-solid fa-arrow-left' style={{ color: '#ffffff' }}></i> Previous
            </Button>
          </Link>
        </div>

        <div className='text-end mx-3 mt-4'>
          <Link to='/dashboard/cost/performance'>
            <Button
              className='float-end btn text-white border-0'
              style={{ width: '6rem', backgroundColor: '#fca311' }}>
              Next <i className='fa-solid fa-arrow-right' style={{ color: '#ffffff' }}></i>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CostOverheads;
