import React from 'react'
import { Container,Row,Col,Form,Card, Button, Table } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { UserRegistrationContext } from './RegistrationContext'


const Payment = () => {

  

  const [amount, setAmount] = useState('')

 
  const navigate = useNavigate()
  

  

  const handleSubmit = (e) => {
    e.preventDefault();
    
      const options = {
        key : "rzp_test_8CiVZzqXrmGvTY",
        key_secret : "",
        amount : 100 * 100,
        
        currency : "INR",
        name : "Marie ERP",
        description : 'Business',
        handler : function(response){
          //alert(response.razorpay_payment_id);

          if(response.razorpay_payment_id){
            setTimeout(() => navigate('/dashboard/processbuilder'))
            
          }
          console.log("Payment ID:", response.razorpay_payment_id);
  console.log("Order ID:", response.razorpay_order_id);
  console.log("Payment Signature:", response.razorpay_signature);
  console.log("Amount:", response.razorpay_amount);
  console.log("Currency:", response.razorpay_currency);
  console.log("Status:", response.razorpay_status);
  console.log("Method:", response.razorpay_method);
  console.log("Customer Email:", response.razorpay_email);
  console.log("Customer Contact:", response.razorpay_contact);
  console.log(response);
        },
        prefill : {
          name : "Muthu",
          email : "ama@gmail.com",
          contact : '9843461371',
        },
        notes : {
          address : 'Razorpay Corporeate Office'
        },
        theme : {
          color : "#fca311"
        }
      }
      const pay = new window.Razorpay(options);
      pay.open();


      
    }
  

  return (
    <div>
        <div className="NavBar container-fluid shadow">
        <div className="img-container d-flex justify-content-between align-items-center py-2">
          <img src='/Restaruntlogo.jpg' alt="Logo" style={{ width: '60px', height: '50px', borderRadius: '10px' }} />
          <div style={{marginRight: "auto"}} className="ms-3">
            <span className="d-block fw-bolder fs-4">
              MARIE
            </span>
            ERP
          </div>
          <div>
          <div>Let's Make It Happen Together!</div>
          
          </div>
         
        </div>
      </div>

      {/* <section className="gradient-custom">
      <Container className="my-5 py-5">
        <Row className="d-flex justify-content-center py-5">
          <Col md={7} lg={5} xl={4}>
            <Card style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4">
                <Form>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Group className="form-outline mb-0">
                      <Form.Control
                        type="text"
                        id="typeText"
                        className="form-control-lg"
                        placeholder="1234 5678 9012 3457"
                        minLength="19"
                        maxLength="19"
                      />
                      <Form.Label htmlFor="typeText">Card Number</Form.Label>
                    </Form.Group>
                    <img
                      src="https://img.icons8.com/color/48/000000/visa.png"
                      alt="visa"
                      width="64px"
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Group className="form-outline mb-0">
                      <Form.Control
                        type="text"
                        id="typeName"
                        className="form-control-lg"
                        placeholder="Cardholder's Name"
                      />
                      <Form.Label htmlFor="typeName">Cardholder's Name</Form.Label>
                    </Form.Group>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <Form.Group className="form-outline mb-0">
                      <Form.Control
                        type="text"
                        id="typeExp"
                        className="form-control-lg"
                        placeholder="MM/YYYY"
                        size="7"
                        minLength="7"
                        maxLength="7"
                      />
                      <Form.Label htmlFor="typeExp">Expiration</Form.Label>
                    </Form.Group>
                    <Form.Group className="form-outline mb-0">
                      <Form.Control
                        type="password"
                        id="typeText2"
                        className="form-control-lg"
                        placeholder="&#9679;&#9679;&#9679;"
                        size="1"
                        minLength="3"
                        maxLength="3"
                      />
                      <Form.Label htmlFor="typeText2">CVV</Form.Label>
                    </Form.Group>
                    <Button variant="info" className="btn-lg btn-rounded">
                      <i className="fas fa-arrow-right"></i>
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Row> */}

            <h2 className='text-center pt-5'>Complete the process</h2>

          

            <div className='d-flex justify-content-center ' style={{width : '100%'}}>
            <Table hoverable bordered className='mx-5 text-center shadow-sm' style={{width : '70%'}}>
                <tr> 
                  <th className='w-25' style={{backgroundColor : '#b8d5ff'}}>Name</th>
                    <td>KFC</td>
                </tr>
                <tr> 
                  <th className='w-25' style={{backgroundColor : '#b8d5ff'}}>Business type</th>
                    <td>Restaurant</td>
                </tr>
                <tr> 
                  <th className='w-25' style={{backgroundColor : '#b8d5ff'}}>Email</th>
                    <td>resta@gmail.com</td>
                </tr>
                <tr> 
                  <th className='w-25' style={{backgroundColor : '#b8d5ff'}}>Phone</th>
                    <td>9654354241</td>
                </tr>
                <tr> 
                  <th className='w-25' style={{backgroundColor : '#b8d5ff'}}>Currency</th>
                    <td>INR</td>
                </tr>
                <tr> 
                  <th className='w-25' style={{backgroundColor : '#b8d5ff'}}>Plan</th>
                    <td className=' fw-medium'>Basic</td>
                </tr>
                <tr> 
                  <th className='w-25' style={{backgroundColor : '#b8d5ff', height: '40px'}}>Amount payable</th>
                    <td><b>RS 100</b></td>
                </tr>
               
               
                

            
            </Table>
            
            </div>
            <div className='d-flex justify-content-end mt-3' style={{width : '85%'}}>
            <button className='btn btn-outline-success shadow-sm' onClick={handleSubmit}>Pay now</button>

            </div>
            
            {/* <Form.Control
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            /> */}

            <br></br>

            
         
          {/* <Col>
          <Link to={'/dashboard'} className='justify-content-center d-flex h-auto '>

    <Button>
      Pay
    </Button>
</Link>
          </Col> */}
          {/* </Row>
        </Row>
      </Container>
    </section>*/}

    </div> 
  )
}

export default Payment