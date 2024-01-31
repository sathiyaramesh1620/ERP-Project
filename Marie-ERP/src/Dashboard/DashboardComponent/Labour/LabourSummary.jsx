import React, {useEffect} from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import axios from 'axios'


function LabourSummary() {




  return (
    <>
      <div><p className='fs-3'>Summary</p></div>
      <p>An overview of your F&B’s workforce.</p>

      <Row className='mt-5'>
        <Col lg={3}>2023</Col>
        <Col lg={3}></Col>
      </Row>

      

      <Row className='mt-3'>
        <Col lg={3}>
          <p>28 Nov</p>
          <span className=''>Wednesday</span>
        </Col>
        
        
        <Col lg={5}>
         
        </Col>
      </Row>
    </>
  )
}

export default LabourSummary