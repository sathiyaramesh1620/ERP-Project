import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button, Table, Tab, Tabs} from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './labour.css'
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Header from '../Header'
import { UserContext } from "../../../Context/UserContext";
import '../../DashboardComponent/Sales/Sales.css'

const AddNewLabour = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [traceTotal, setTraceTotal] = useState(0);
  const [salTrace, setSalTrace] = useState('');

  const [activityData, setActivityData] = useState([]);
  
  const [isTotalPercentage100, setIsTotalPercentage100] = useState(false);



  
  const [activeTab, setActiveTab] = useState('home');
  const [employeeData, setEmployeeData] = useState({
    name: '',
    fulltime: '',
    foreigner: '',
    salary: '',
    currency: '',
    productivity: '',
    traceable: '',
    leaves : [{ type: 'Annual leave', value: '' },
            { type: 'Medical leave', value: '' },
            { type: 'Emergency leave', value: '' },
            { type: 'Marriage leave', value: '' },
            { type: 'Maternity leave', value: '' },
            { type: 'Other leave', value: '' }]
  });

  useEffect(() => {
    // Calculate traceTotal whenever traceable inputs change
    const traceableKeys = [
      'permits', 'bonuses', 'epf', 'socso', 'eis', 'medical', 'telephone', 'travel', 'insurance'
    ];

    const traceableTotal = traceableKeys.reduce((total, key) => {
      return total + (employeeData[key] ? parseFloat(employeeData[key]) : 0);
    }, 0);

    setTraceTotal(traceableTotal);
  }, [employeeData]); // The effect will run whenever employeeData changes

  useEffect(() => {
    // Calculate the sum of salary and traceTotal whenever the salary or traceTotal changes
    const salaryValue = parseFloat(employeeData.salary) || 0;
    const totalValue = salaryValue + traceTotal;
    console.log(`Salary + Traceable Total: ${salaryValue} + ${traceTotal} = ${totalValue}`);
    setSalTrace(totalValue);
  }, [employeeData.salary, traceTotal]);

  useEffect(() => {
    axios.post("/Marie-ERP/api/labour_activity")
      .then(response => {
        console.log(response.data.data);
        setActivityData(response.data.data);
      })
  }, []);

  // useEffect(() => {
  //   // Calculate the total percentage of activity data
  //   const totalPercentage = activityData.reduce((total, activity) => {
  //     return total + parseFloat(employeeData[activity.activity]) || 0;
  //   }, 0);

  //   setIsTotalPercentage100(totalPercentage === 100);
  // }, [activityData, employeeData]);

  const selectedTrace = () => {
    axios
      .post("/Marie-ERP/api/fetchTraceable", {
        userId: user.userId ? user.userId :"102",
        fulltime: employeeData.fulltime,
        foreigner: employeeData.foreigner
      })
      .then(response => {
        if (response.status === 200) {
          // Data is available, perform some action
          console.log("Data is available", response.data.data);
          const traceableData = response.data.data;
  
          if (traceableData) {
            const permits = traceableData.traceable.find(item => item.name === "permits");
            const bonuses = traceableData.traceable.find(item => item.name === "bonuses");
            const epf = traceableData.traceable.find(item => item.name === "epf");
            const socso = traceableData.traceable.find(item => item.name === "socso");
            const eis = traceableData.traceable.find(item => item.name === "eis");
            const medical = traceableData.traceable.find(item => item.name === "medical");
            const telephone = traceableData.traceable.find(item => item.name === "telephone");
            const travel = traceableData.traceable.find(item => item.name === "travel");
            const insurance = traceableData.traceable.find(item => item.name === "insurance");
  
            setEmployeeData((prevData) => ({
              ...prevData,
              permits: permits ? permits.value : '', // Set to an empty string if permits is undefined
              bonuses: bonuses ? bonuses.value : '',
              epf: epf ? epf.value : "",
              socso: socso ? socso.value : "",
              eis: eis ? eis.value : "",
              medical: medical ? medical.value : "",
              telephone: telephone ? telephone.value : "",
              travel: travel ? travel.value : "",
              insurance: insurance ? insurance.value : "",
            }));
          }
        } 
      })
      .catch(error => {
        // Handle the error for fetchTraceable API call
        console.error("Error fetching data:", error.response.status);
      });
  };
  
  
  

const saveTrace = () => {
  const traceableKeys = [
    { name: "permits", value: employeeData.permits },
    { name: "bonuses", value: employeeData.bonuses },
    { name: "epf", value: employeeData.epf },
    { name: "socso", value: employeeData.socso },
    { name: "eis", value: employeeData.eis },
    { name: "medical", value: employeeData.medical },
    { name: "telephone", value: employeeData.telephone },
    { name: "travel", value: employeeData.travel },
    { name: "insurance", value: employeeData.insurance },
  ];

  const filteredTraceableKeysData = traceableKeys.filter(
    (entry) => entry.value !== undefined && entry.value !== ""
  );

 axios
      .post("/Marie-ERP/api/fetchTraceable", {
        userId: user.userId ? user.userId :"102",
        fulltime: employeeData.fulltime,
        foreigner: employeeData.foreigner,
      })
      .then(response => {
        if (response.status == 200){
          console.log(response.status)
        }}).catch(error => {
          if (error.response.status == 400) {
            axios
              .post("/Marie-ERP/api/saveTraceable", {
                userId: user.userId ? user.userId :"102",
                fulltime: employeeData.fulltime,
                foreigner: employeeData.foreigner,
                traceable: salTrace,
                traceableKeys: filteredTraceableKeysData,
              })
              .then(saveTraceableResponse => {
                // Handle the response from saveTraceable
                console.log("Data is not available, saved data:", saveTraceableResponse);
                // Set the flag to indicate data has been fetched
                isDataFetched = true;
              })
              .catch(error => {
                // Handle the error for saveTraceable API call
                console.error("Error saving data:", error);
              });
          }
        })
};

  


const handleInputChange = (e) => {
  const { name, value } = e.target;
  const floatValue = parseFloat(value);

  if (
    [
      'permits',
      'bonuses',
      'epf',
      'socso',
      'eis',
      'medical',
      'telephone',
      'travel',
      'insurance',
    ].includes(name)
  ) {
    // Check if value is non-negative before updating state
    if (value === '' || floatValue >= 0) {
      setEmployeeData({
        ...employeeData,
        [name]: floatValue,
      });
    } else {
      console.log(`Invalid input for ${name}. Value cannot be negative.`);
    }
  } 
  else if (name === 'productivity') {
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 24)) {
      setEmployeeData({
        ...employeeData,
        [name]: floatValue,
      });
    } else {
      console.log('Invalid input for productivity.');
    }
  } else if (name === 'fulltime' || name === 'foreigner') {
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  } else if (name === 'salary') {
    if (value === '' || floatValue >= 0) {
      setEmployeeData({
        ...employeeData,
        [name]: floatValue,
      });
    } else {
      console.log('Salary cannot be negative.');
    }
  } else {
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value === '' ? '' : value, // Set as an empty string if value is empty
    }));
  }
};

 

useEffect(() => {
    // Calculate the total percentage of activity data
    const totalPercentage = activityData.reduce((total, activity) => {
      const activityValue = parseFloat(employeeData[activity.activity]) || 0;
      return total + activityValue;
    }, 0);
    
    if(totalPercentage === 100 && totalPercentage >=0) {
      setIsTotalPercentage100(true)
      toast.success(`Distribution (%) is valid`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      })
    }else if(totalPercentage > 100){
      toast.error(`Total distribution (%) is more than 100%`,{
        position : toast.POSITION.TOP_RIGHT,
        autoClose : 1000,
      })
    }else if(totalPercentage < 100 && totalPercentage > 75){
      toast.error(`Total distribution (%) is less than 100%`,{
        position : toast.POSITION.TOP_RIGHT,
        autoClose : 1000,
      })
    }  
    
    else {
      setIsTotalPercentage100(false)
      
    }
    console.log(totalPercentage);
  }, [activityData, employeeData]);


  const handleLeaveInputChange = (e, index) => {
    const { name, value } = e.target;
  
    setEmployeeData((prevData) => {
      const updatedLeaves = [...prevData.leaves];
      updatedLeaves[index] = { ...updatedLeaves[index], value };
      return { ...prevData, leaves: updatedLeaves };
    });
  };

  const leaveDataToSend = employeeData.leaves
  .filter((leave) => leave.value !== '') // Filter out leaves without a value
  .map((leave) => ({ [leave.type]: parseInt(leave.value) })); // Construct the desired format

  const handleSubmit = async (e) => {
    e.preventDefault();

    const traceableKeys = [
      { name: 'permits', value: employeeData.permits },
      { name: 'bonuses', value: employeeData.bonuses },
      { name: 'epf', value: employeeData.epf },
      { name: 'socso', value: employeeData.socso },
      { name: 'eis', value: employeeData.eis },
      { name: 'medical', value: employeeData.medical },
      { name: 'telephone', value: employeeData.telephone },
      { name: 'travel', value: employeeData.travel },
      { name: 'insurance', value: employeeData.insurance }
    ];

    const filteredTraceableKeysData = traceableKeys.filter(
      (entry) => entry.value !== undefined && entry.value !== ''
    );

    const filteredActivityData = activityData.filter((activity) => {
      const percentage = employeeData[activity.activity];
      return percentage !== '' && percentage !== '0' && parseFloat(percentage) !== 0;
    });
  
    // Create an array of activity data
    const activityDataArray = filteredActivityData
    .map((activity) => ({
      activity: activity.activity,
      percentage: employeeData[activity.activity],
    }))
    .filter((entry) => entry.percentage !== undefined && entry.percentage !== '' && parseFloat(entry.percentage) !== 0);

    // Create a new object with the updated traceable value
    const updatedEmployeeData =({
      ...employeeData,
      traceable: salTrace,
      userId: user.userId ? user.userId :"102",
      traceableKeys : filteredTraceableKeysData,
      activity: activityDataArray,
      leave: leaveDataToSend,
      
    });
    console.log(updatedEmployeeData);
    try {
      const response = await axios.post('/Marie-ERP/api/insertLabour', updatedEmployeeData
      
      
      );
      console.log('Data sent to the backend:', response.data);
      if (response.status === 200) {
        toast.success('Employee created successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
  
        setTimeout(() => {
          navigate('/dashboard/labour');
        }, 2000);
      }
      // You might want to add a success message here or perform some other action.
    } catch (error) {
      console.error('Error sending data to the backend:', error);
  
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      // Handle errors and potentially show an error message to the user.
    }
  };

    
  

  
  

  const handleNextTab = () => {
    if (activeTab === 'home') {
      
      setActiveTab('leave');
    } else if (activeTab === 'leave') {
      
      selectedTrace();
      setActiveTab('profile');
    }else if (activeTab === 'profile') {
      saveTrace()
      setActiveTab('contact');
    
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === 'contact') {
      setActiveTab('profile');
    } else if (activeTab === 'profile') {
      setActiveTab('leave');
    } else if (activeTab === 'leave') {
      setActiveTab('home');
    }
  };

  return (
    <>
    <Header />
    <Row className=" vw-100  vh-100 " >
        <Col sm={4} md={3} lg={2}>
          <Sidebar />
        </Col>
        <Col sm={8} md={9} lg={10} style={{marginTop : '5%'}}>
      <div className='text-end'>
      <Link className='btn text-end cancelLink mt-2 mb-2'   to="/dashboard/labour">Cancel <i className="fa-solid fa-power-off mx-2" style={{color: 'red'}}></i></Link></div>
      <div className='mt-0'>
      <Form onSubmit={handleSubmit}>
       
        
          
        <Tabs justify variant='' className=' custom-tabs  ' activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        
          
        
          <Tab eventKey="home" title="Basic" className="custom-tab ">
            <div className=" pt-5 px-3 py-4 " >
             <Row className=''>
              <Col className=''>
              
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  placeholder='Enter employee name'
                  className='  '
                  type="text"
                  name="name"
                  value={employeeData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="">
                <Form.Label>Full Time</Form.Label>
                <Form.Select
                  required
                  name="fulltime"
                  value={employeeData.fulltime}
                  onChange={handleInputChange}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>

              </Col>
              </Row>

             <Row>
              <Col>
              <Form.Group className="pt-3">
                <Form.Label>Foreigner</Form.Label>
                <Form.Select
                  required
                  name="foreigner"
                  value={employeeData.foreigner}
                  onChange={handleInputChange}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
              </Col>

              <Col>
              <Form.Group className="pt-3">
                <Form.Label>
                  Productivity <span className="text-secondary">(excluding break)</span>
                </Form.Label>
                <Form.Control
                  required
                  name="productivity"
                  type="number"
                  value={employeeData.productivity}
                  onChange={handleInputChange}
                  placeholder="Enter hours"
                />
              </Form.Group>
              </Col>
              </Row>


              <Row>
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      required
                      name="salary"
                      type="number"
                      value={employeeData.salary}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Select
                      required
                      name="currency"
                      value={employeeData.currency}
                      onChange={handleInputChange}
                      defaultValue=""
                    >
                      <option value="">Select currency</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="MYR">MYR - Malaysian Ringgit</option>
                      {/* Add more currency options as needed */}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              
            </div>
          </Tab>

          <Tab eventKey="leave" title="Leave days" className="mx-3">
            <div className="px-2 py-4">
              {/* <Row>
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Annual Leave</Form.Label>
                    <Form.Control
                      
                      name="annualLeave" // Assuming "annualLeave" is the key for annual leave in your backend
                      type="number"
                      value={employeeData.annualLeave}
                      onChange={handleInputChange}
                      // value={employeeData.permits}
                      // onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Medical leave</Form.Label>
                    <Form.Control
                
                          name="medicalLeave" // Assuming "annualLeave" is the key for annual leave in your backend
                          type="number"
                          value={employeeData.medicalLeave}
                          onChange={handleInputChange}
                      // value={employeeData.bonuses}
                      // onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Emergency leave</Form.Label>
                    <Form.Control
                     
                     name="emergencyLeave" // Assuming "annualLeave" is the key for annual leave in your backend
                     type="number"
                     value={employeeData.emergencyLeave}
                     onChange={handleInputChange}
                      // value={employeeData.epf}
                      // onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

              </Row>

              <Row>
                
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Marriage leave</Form.Label>
                    <Form.Control
               
                        name="marriageLeave" // Assuming "annualLeave" is the key for annual leave in your backend
                        type="number"
                        value={employeeData.marriageLeave}
                        onChange={handleInputChange}
                      // value={employeeData.socso}
                      // onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Maternity leave</Form.Label>
                    <Form.Control
       
                        name="maternityLeave" // Assuming "annualLeave" is the key for annual leave in your backend
                        type="number"
                        value={employeeData.maternityLeave}
                        onChange={handleInputChange}
                      // value={employeeData.eis}
                      // onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Other leave</Form.Label>
                    <Form.Control
         
                      name="otherLeave" // Assuming "annualLeave" is the key for annual leave in your backend
                      type="number"
                      value={employeeData.otherLeave}
                      onChange={handleInputChange}
                      // value={employeeData.medical}
                      // onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

              </Row> */}
              <Row>
      {employeeData.leaves.map((leave, index) => (
        <Col key={index} lg={4}>
          <Form.Group className="pt-3">
            <Form.Label>{leave.type}</Form.Label>
            <Form.Control
              name={leave.type}
              type="number"
              value={leave.value}
              onChange={(e) => handleLeaveInputChange(e, index)}
            />
          </Form.Group>
        </Col>
      ))}
    </Row>

            </div>
          </Tab>

          <Tab eventKey="profile" title="Traceable" className="mx-3">
            <div className="px-2 py-4">
              <Row>
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Permits</Form.Label>
                    <Form.Control
                      
                      name="permits"
                      type="number"
                      value={employeeData.permits}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Bonuses</Form.Label>
                    <Form.Control
                
                      name="bonuses"
                      type="number"
                      value={employeeData.bonuses}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>EPF</Form.Label>
                    <Form.Control
                     
                      name="epf"
                      type="number"
                      value={employeeData.epf}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

              </Row>

              <Row>
                
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>SOCSO</Form.Label>
                    <Form.Control
               
                      name="socso"
                      type="number"
                      value={employeeData.socso}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>EIS</Form.Label>
                    <Form.Control
       
                      name="eis"
                      type="number"
                      value={employeeData.eis}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Medical</Form.Label>
                    <Form.Control
         
                      name="medical"
                      type="number"
                      value={employeeData.medical}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

              </Row>

              

              <Row>
                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control
       
                      name="telephone"
                      type="number"
                      value={employeeData.telephone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Travel</Form.Label>
                    <Form.Control
     
                      name="travel"
                      type="number"
                      value={employeeData.travel}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="pt-3">
                    <Form.Label>Insurance</Form.Label>
                    <Form.Control
       
                      name="insurance"
                      type="number"
                      value={employeeData.insurance}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                
                <Col></Col>
                <Col>
                  <Form.Group className="pt-3 text-center">
                    <Form.Label className=''>Total Traceable</Form.Label>
                    <Form.Control
                      name="traceable"
                      type="number"
                      value={salTrace}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col></Col>
              </Row>
            </div>
          </Tab>

          <Tab eventKey="contact" title="Activities">
            <div className="pt-2 px-5 py-4 ">
              <Table bordered className='shadow'>
                <thead >
                  <tr className='text-center ' >
                    <th style={{backgroundColor : '#fca311', color : 'white', width : '4%'}}>No</th>
                    <th style={{backgroundColor : '#fca311', color : 'white', width : '20%'}}>Type of Activity</th>
                    <th style={{backgroundColor : '#fca311', color : 'white', width : '20%'}}>Percentage Distribution of Work</th>
                  </tr>
                </thead>
                <tbody>
                  {activityData.map((activity, index) => (
                    <tr key={activity.id}>
                      <td className='text-center pt-3'>{index + 1}</td>
                      <td className='pt-3'>{activity.activity}</td>
                      <td>
                        <Form.Group className="">
                          {/* <Form.Label>{activity.activity}</Form.Label> */}
                          <Form.Control
                            className='text-center'
                            name={activity.activity}
                            type="number"
                            value={employeeData[activity.activity]}
                            onChange={handleInputChange}
                            style={{height : '40px'}}
                          />
                        </Form.Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className='text-center'>
             <Button disabled={!isTotalPercentage100} type="submit" className='subLabButton text-center mx-1'>
             Create employee <i className="fa-solid fa-user-check px-1" style={{color: '#ffffff'}}></i>
          </Button><ToastContainer /></div>
          </Tab>
        </Tabs>
        
      </Form>

      <Row className="pt-5 mx-5 pb-5">
        <Col>
          <Button
            className="btn btn-warning text-white border-0 shadow"
            onClick={handlePreviousTab}
            disabled={activeTab === 'home'}
          >
          <i className="fa-solid fa-arrow-left" style={{color: '#ffffff'}}></i>  Previous
          </Button>
        </Col>

        <Col className="text-end">
          <Button
            className="btn btn-warning text-white border-0 shadow"
            onClick={handleNextTab}
            disabled={activeTab === 'contact'}
          >
            Next <i className="fa-solid fa-arrow-right" style={{color: '#ffffff'}}></i>
          </Button>
        </Col>
      </Row>

      {/* <div className="text-end p-5">
        <Link to="/dashboard/labour">Cancel Registration</Link>
      </div> */}
      </div>
      </Col>
    </Row>
    </>
  );
};

export default AddNewLabour;
