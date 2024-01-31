import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Form, Row, Col, Table, Container } from 'react-bootstrap'
import { ResponsivePie } from '@nivo/pie'
import './Sides.css'

const Performance = () => {
  const pieChartData = [
    {
      id: 'Use of Ingredients',
      label: 'Use of Ingredients',
      value: 19.00,
    },
    {
      id: 'Business running cost',
      label: 'Business running cost',
      value: 15.10,
    },
    {
      id: 'Labour to produce',
      label: 'Labour to produce',
      value: 3.40,
    },
    {
      id: 'Margin and your profit',
      label: 'Margin and your profit',
      value: 12.50,
    },
  ];

  const theme = {
    labels: {
      text: {
       // fill: 'white', // Text color
        fontWeight: 'bold', // Make the text bolder
        size : 400,
      },
    },
    
  };
  return (
    <>
    <div>
      <Row>
        <Col lg={4} className='mx-3 '>
        <Form.Select className=' shadow '>
        <option>Select sales channel</option>
        <option>Dine In</option>
        <option>Online</option>
        <option>Takeaway</option>
      </Form.Select>
      </Col>  
        <Col></Col>  
      </Row>
      
      <Row>
        <Col className='mx-2'>
          <Table responsive bordered className='shadow'>
            <thead className='text-center' style={{ height : '2rem'}}>
              <th className='border-1 border-white' style={{backgroundColor : 'rgb(255, 217, 155)'}}>Rank</th>
              <th className='border-1 border-white' style={{backgroundColor : 'rgb(255, 217, 155)'}}>Product</th>
              <th className='border-1 border-white' style={{backgroundColor : 'rgb(255, 217, 155)'}}>Division</th>
              <th className='border-1 border-white' style={{backgroundColor : 'rgb(255, 217, 155)'}}>%</th>
              <th className='border-1 border-white' style={{backgroundColor : 'rgb(255, 217, 155)'}}>RM</th>
            </thead>
            <tbody className='text-center'>
              <tr>
                <td>1</td>
                <td>Laddu</td>
                <td>Food</td>
                <td>34</td>
                <td>28.90</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Chicken Briyani</td>
                <td>Food</td>
                <td>25</td>
                <td>38.90</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Rasgulla</td>
                <td>Food</td>
                <td>16</td>
                <td>24.90</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className='mt-5'>
        <Col className='mx-4 '>
      
        <Row className=' '>
          <Col className='text-center shadow-lg coll pt-3 rounded-4' style={{backgroundColor : 'rgb(44, 172, 18)', color : 'white' }}>
          <h4>Total costs</h4>
          <p>{`RM 37.50`}</p>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col className='shadow pt-3 text-center rounded-4' style={{backgroundColor : 'rgb(167, 234, 154)'}}>
          <h4>{`RM 19.00`}</h4>
          <p>Use of Ingredients</p>
          </Col>&nbsp;&nbsp;&nbsp;
          <Col className='shadow pt-3 text-center rounded-4' style={{backgroundColor : 'rgb(167, 234, 154)' }}><h4>{`RM 15.10`}</h4>
          <p>Business running cost</p></Col>
        </Row>
        <Row className='mt-3'>
          <Col className='shadow pt-3 text-center rounded-4' style={{backgroundColor : 'rgb(167, 234, 154)'}}>
          <h4>{`RM 3.40`}</h4>
          <p>Labour to produce</p>
          </Col>&nbsp;&nbsp;&nbsp;
          <Col className='shadow pt-3 text-center rounded-4' style={{backgroundColor : 'rgb(167, 234, 154)' }}><h4>{`RM 12.50`}</h4>
          <p>Margin and your profit</p></Col>
        </Row>
        </Col>
       
       
        <Col className='shadow rounded-4 ' style={{backgroundColor : '#ebe6ce'}}>
        <ResponsivePie
        
            data={pieChartData}
            margin={{ top: 10, right: 0, bottom: 27.5, left: 0 }}
            innerRadius={0.7}
            padAngle={1}
            cornerRadius={3}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={10}
            radialLabelsTextColor='#ffffff'
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: 'color' }}
            sliceLabelsSkipAngle={10}
            sliceLabelsTextColor='#333333'
            activeOuterRadiusOffset={10}
        activeInnerRadiusOffset={5}
        theme={theme}
          />
        </Col>
      </Row>
    </div>
    <div className='d-flex justify-content-between  '>
    <div className="text-start mx-3 mt-4 pb-5 pt-3">
      <Link to="/dashboard/cost/costoverheads">
        <Button
          className="float-end btn btn-warning text-white border-0 "
         // type="submit"
          style={{ width: "7rem", backgroundColor : '#fca311' }}>
         <i className="fa-solid fa-arrow-left" style={{color: '#ffffff'}}></i> Previous {" "}
        </Button>
      </Link></div></div>
      </>
    
  )
}

export default Performance