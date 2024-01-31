import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Form, Button} from 'react-bootstrap'
import './Costing.css'
import { Line } from 'react-chartjs-2';

const CostingHome = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Pricing',
        data: [10, 20, 15, 30, 25, 35],
        fill: false, // Don't fill the area under the line
        borderColor: '#fca311', // Line color
        tension: 0.4, // Line tension (smoothing)
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Pricing',
        data: [3, 10, 15, 20, 10, 32],
        fill: false, // Don't fill the area under the line
        borderColor: '#fca311', // Line color
        tension: 0.4, // Line tension (smoothing)
      },
    ],
  };

  const options1 = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleCancelClick = () => {
    sessionStorage.clear();
    // Perform other actions (if any) related to canceling
    // Redirect to the desired page using history.push or Link from 'react-router-dom'
  };

  return (
    <div>
      <section className='text-end mx-3'>
        <Row>
          <Col sm={3}>
          <Form.Select aria-label="Default select example" style={{height : '50px'}} className=''>
              <option>Select channel type</option>
              <option value="1">Dine-in</option>
              <option value="2">Delivery platform service</option>
              <option value="2">Online</option>
              <option value="2">Telephone</option>
              <option value="2">Takeaway</option>
            </Form.Select>
          </Col>
          <Col sm={3}>
          <Form.Control
          type='text'
          style={{height : '50px'}}
          placeholder='Enter item name'>

          </Form.Control>
          </Col>
          <Col sm={6}><Link to="/dashboard/cost/general" >
      <button className='btn  fs-5' onClick={handleCancelClick}>Add <i className="fa-solid fa-circle-plus" style={{color: '#fca311'}}></i></button></Link></Col>
        </Row>
        </section>
      <Row className='pt-5'>
        <Col className='mx-4  pt-2' >
          <Row className='shadow pt-2 borderD' style={{borderRadius : '10px'}}>
            <Col><section className='text-center' ><div className="circle  pt-5 fs-1">HP</div></section></Col>
            <Col className='text-end mx-5'>
            <h3>Hawaiian Pizza</h3>
            <p>{`Price : RM 35`}</p>
            <p>{`Net Profit : RM 12.50`}</p>
            <p>{`Margin : 25%`}</p>
            </Col>
          </Row>
          <Row className='mt-4 shadow-lg borderD' style={{borderRadius : '10px'}}>
          <Line data={data} options={options} />
          </Row>
        </Col>
        
        <Col className='mx-2 pt-2' style={{borderRadius : '10px'}}>
        
      <Row className='shadow pt-2 borderD'  style={{borderRadius : '10px'}}>
            <Col><section className='text-center'><div className="circle  pt-5 fs-1">MB</div></section></Col>
            <Col className='text-end mx-5'>
            <h3>Mutton Briyani</h3>
            <p>{`Price : RM 32`}</p>
            <p>{`Net Profit : RM 5.50`}</p>
            <p>{`Margin : 15%`}</p>
            </Col>
          </Row>
          <Row className='mt-4 shadow-lg borderD' style={{borderRadius : '10px'}}>
          <Line data={data1} options={options1} />
          </Row>
        </Col>
      </Row>
      
    </div>
  )
}

export default CostingHome