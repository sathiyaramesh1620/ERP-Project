import React, {useState, useContext} from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import { Link } from "react-router-dom";
import './Sides.css'
import { CostDataContext } from "./CostContext";
import { UserContext } from "../../../../Context/UserContext";
import axios from 'axios';


const Sides = () => {
  const { user } = useContext(UserContext);
  const { sidesSelectedItems, setSideSelectedItems } = useContext(CostDataContext);
  const [preparation, setPreparation] = useState("0");
  const [showSide, setShowSide] = useState(false)
 
  //----------------------------------------------------------------
  const [sideName, setSideName] = useState('');
  const [preparationData, setPreparationData] = useState('0');
  const [servings, setServings] = useState('');


  const handlePreparationChange = (event) => {
    setPreparation(event.target.value);
  };

  const handleAddWorkingDays = () => {
    setShowSide((prevShowTable) => !prevShowTable);
  };

  const handleItemSelected = (itemName) => {
    const updatedSelectedItems = [...sidesSelectedItems];

    if (updatedSelectedItems.includes(itemName)) {
      const index = updatedSelectedItems.indexOf(itemName);
      updatedSelectedItems.splice(index, 1);
    } else {
      updatedSelectedItems.push(itemName);
    }

    setSideSelectedItems(updatedSelectedItems);
  };

  const isActive = (itemName) => {
    return sidesSelectedItems.includes(itemName) ? 'active11' : '';
  };

  const handleSave = () => {
   

    console.log({ 
      userId : user.userId ? user.userId : '90',
      sideName: sideName,
      preparation: preparation === '1' ? 'Batch' : 'Unit',
      servings: preparation === '1' ? servings : null,});
      
    const data = {
      sideName: sideName,
      preparation: preparation === '1' ? 'Batch' : 'Unit',
      servings: preparation === '1' ? servings : '',
    };

    // Send data to the backend using Axios
    axios.post('/Marie-ERP/api/costing/sides', data)
      .then((response) => {
        // Handle successful response
        console.log('Data sent successfully:', response.data);
        setShowSide(false)
      })
      .catch((error) => {
        // Handle error
        console.error('Error sending data:', error);
      });
  };

  return (
    <>
    <div>
      <section className='pt-3  d-flex justify-content-between'>
        <h5>Recently added sides</h5>
        <button className='btn  btn-outline-secondary' onClick={() => {
                 
                 handleAddWorkingDays()
                 }}>{showSide ? 'Close' : 'Add Side'}</button> 
      </section>
      
      <section >
      <button
          className={`btn btn-outline-warning  ${isActive('Salad')}`}
          onClick={() => handleItemSelected('Salad')}
          style={{ margin: '4px' }}
        >Salad</button>
         <button
          className={`btn btn-outline-warning ${isActive('Yogurt')}`}
          onClick={() => handleItemSelected('Yogurt')}
          style={{ margin: '4px' }}
        >Yogurt</button>
          <button
          className={`btn btn-outline-warning ${isActive('Chicken curry')}`}
          onClick={() => handleItemSelected('Chicken curry')}
          style={{ margin: '4px' }}
        >Chicken curry</button>
         <button
          className={`btn btn-outline-warning ${isActive('Mint sauce')}`}
          onClick={() => handleItemSelected('Mint sauce')}
          style={{ margin: '4px' }}
        >Mint sauce</button>
      </section>


     
      
      {showSide && (
        <>
        
      <Table bordered  className="text-center shadow">
      <tbody>
      <tr>
        <th className="pt-3 w-25" style={{backgroundColor : '#14213d', color : 'white'}}>Side Name</th>
        <td><Form.Control 
        type='text'
        className="border-0"
        style={{height : '40px'}}
        value={sideName}
        onChange={(e) => setSideName(e.target.value)} /></td>
      </tr>
      <tr>
        <th className="pt-3" style={{backgroundColor : '#14213d', color : 'white'}}>Preparation</th>
        <td> <Form.Select
                className="border-0"
                  aria-label="Default select example"
                  value={preparation}
                  onChange={handlePreparationChange}
                  style={{height : '40px'}} required>
                    
                  <option value="0">Open this select menu</option>
                  <option value="1">Batch</option>
                  <option value="2">Unit</option>
                </Form.Select>
              </td>
            </tr>
            {preparation === "1" && (
              <tr>
                <th className="pt-3" style={{backgroundColor : '#14213d', color : 'white'}}>Servings</th>
                <td>
                  <Form.Control className="border-0" type="number"  style={{height : '40px'}}
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}/>
                </td>
              </tr>
            )}
      </tbody>
      </Table>
      <button type='submit' className='btn' onClick={() => {
        handleSave()
        setShowSide(false)
      }}>Save</button>
      </>
      )}
      
      
      <div className='d-flex justify-content-between  '>
      <div className="text-start mx-3 mt-4">
        <Link to="/dashboard/cost/costsales">
          <Button
            className="float-end btn btn-warning text-white border-0 "
           // type="submit"
            style={{ width: "7rem", backgroundColor : '#fca311' }}>
           <i className="fa-solid fa-arrow-left" style={{color: '#ffffff'}}></i> Previous {" "}
          </Button>
        </Link></div>

      <div className="text-end mx-3 mt-4">
        <Link to="/dashboard/cost/costingredients">
          <Button
            className="float-end btn text-white border-0 "
           // type="submit"
            style={{ width: "6rem", backgroundColor : '#fca311' }}>
            Next {" "}<i className="fa-solid fa-arrow-right" style={{color: '#ffffff'}}></i>
          </Button>
        </Link></div></div>
      </div>
      </>
  )
}

export default Sides