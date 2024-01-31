import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Form,
  Row,
  Col,
  Tab,
  Tabs,
  Button,
  Table,
  Nav,
  Navbar,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./labour.css";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import Header from "../Header";
import { UserContext } from "../../../Context/UserContext";

const EditLabours = (id) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { employeeId } = useParams(id);

  const [traceTotal, setTraceTotal] = useState(0);
  const [salTrace, setSalTrace] = useState("");

  const [activityData, setActivityData] = useState([]);
  const [selectedLabours, setSelectedLabours] = useState([]);
  const [activityValues, setActivityValues] = useState([]);

  const [activityNames, setActivityNames] = useState([])

  const [isTotalPercentage100, setIsTotalPercentage100] = useState(true);

  const [activityTraceable, setActivityTraceable] = useState(0)

  const [activeTab, setActiveTab] = useState("home");
  const [employeeData, setEmployeeData] = useState({
    name: "",
    fulltime: "",
    foreigner: "",
    salary: "",
    denomination: "",
    productivity: "",
    traceable: "",
  });

  useEffect(() => {
    // Calculate traceTotal whenever traceable inputs change
    const traceableKeys = [
      "permits",
      "bonuses",
      "epf",
      "socso",
      "eis",
      "medical",
      "telephone",
      "travel",
      "insurance",
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
    console.log(
      `Salary + Traceable Total: ${salaryValue} + ${traceTotal} = ${totalValue}`
    );
    setSalTrace(totalValue);
  }, [employeeData.salary, traceTotal]);

;

useEffect(() => {
  axios.post("/Marie-ERP/api/labour_activity").then((response) => {
    console.log(response.data);
    // response.data.data.forEach((activity) => {
    //   console.log([activity.activity]);
    //   setActivityNames(activity.activity);

    // });

    setActivityData(response.data.data);
  });
}, []);


  const selectedTrace = () => {
    axios
      .post("/Marie-ERP/api/fetchTraceable", {
        userId: user.userId ? user.userId :"102",
        fulltime: employeeData.fulltime,
        foreigner: employeeData.foreigner,
      })
      .then((response) => {
        if (response.status === 200) {
          // Data is available, perform some action
          console.log("Data is available", response.data.data);
          const traceableData = response.data.data;

          if (traceableData) {
            const permits = traceableData.traceable.find(
              (item) => item.name === "permits"
            );
            const bonuses = traceableData.traceable.find(
              (item) => item.name === "bonuses"
            );
            const epf = traceableData.traceable.find(
              (item) => item.name === "epf"
            );
            const socso = traceableData.traceable.find(
              (item) => item.name === "socso"
            );
            const eis = traceableData.traceable.find(
              (item) => item.name === "eis"
            );
            const medical = traceableData.traceable.find(
              (item) => item.name === "medical"
            );
            const telephone = traceableData.traceable.find(
              (item) => item.name === "telephone"
            );
            const travel = traceableData.traceable.find(
              (item) => item.name === "travel"
            );
            const insurance = traceableData.traceable.find(
              (item) => item.name === "insurance"
            );

            setEmployeeData((prevData) => ({
              ...prevData,
              permits: permits ? permits.value : "", // Set to an empty string if permits is undefined
              bonuses: bonuses ? bonuses.value : "",
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
      .catch((error) => {
        // Handle the error for fetchTraceable API call
        console.error("Error fetching data:", error.response.status);
      });
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
  
  const hasTraceableChanged = () => {
    const traceableKeys = [
      "permits",
      "bonuses",
      "epf",
      "socso",
      "eis",
      "medical",
      "telephone",
      "travel",
      "insurance",
    ];
  
    for (const key of traceableKeys) {
      if (employeeData[key] !== selectedLabours[key] && activityTraceable !== selectedLabours.traceable ) {
        return true;
      }
    }
  
    return false;
  };
  
 


  const handleSubmit = async (e) => {
    e.preventDefault();

    const activityDatas = [];
    for (const [activity, percentage] of Object.entries(activityValues)) {
      activityDatas.push({
        "activity": activity,
        "percentage": percentage
      });
    }

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

    const filteredActivityData = [activityValues].filter((activity) => {
      const percentage = employeeData[activity.activity];
      return (
        percentage !== "" && percentage !== "0" && parseFloat(percentage) !== 0
      );
    });

    // Create an array of activity data
    const activityDataArray = filteredActivityData
      .map((activity) => ({
        activity: activity.activity,
        percentage: employeeData[activity.activity],
      }))
      .filter(
        (entry) =>
          entry.percentage !== undefined &&
          entry.percentage !== "" &&
          parseFloat(entry.percentage) !== 0
      );


    // Create a new object with the updated traceable value
    const updatedEmployeeData = {
      ...employeeData,
      traceable: salTrace,
      userId: user.userId ? user.userId :"102",
      employeeId,
      traceableKeys: filteredTraceableKeysData,
      activity: activityDatas,
      editTraceable : hasTraceableChanged() ? 'true' : 'false', 
    };
    console.log(updatedEmployeeData);
    try {
      const response = await axios.post(
        "/Marie-ERP/api/editLabour",
        updatedEmployeeData
      );
      console.log("Data sent to the backend:", response.data);
      if (response.status === 200) {
        toast.success("Employee created successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate("/dashboard/labour");
        }, 2000);
      }
      // You might want to add a success message here or perform some other action.
    } catch (error) {
      console.error("Error sending data to the backend:", error);

      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      // Handle errors and potentially show an error message to the user.
    }
  };

  const handleNextTab = () => {
    if (activeTab === "home") {
      selectedTrace();
      setActiveTab("profile");
    } else if (activeTab === "profile") {
      
      setActiveTab("contact");
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === "contact") {
      setActiveTab("profile");
    } else if (activeTab === "profile") {
      setActiveTab("home");
    }
  };
 
  useEffect(() => {
    axios
      .post("/Marie-ERP/api/fetchLabour", { userId: user.userId ? user.userId :"102", employeeId })
      .then((response) => {
        const { data } = response.data;
        setSelectedLabours(data);

        setEmployeeData({
          name: data.name || "",
          fulltime: data.fulltime || "",
          foreigner: data.foreigner || "",
          salary: data.salary || "",
          denomination: data.denomination || "",
          productivity: data.productivity || "",
          traceable: data.traceable || "",
          activity: data.activity,
        });
        
        setActivityTraceable(data.traceable)
        // Set the activity values in the activityValues state
        const activityObject = {};
        data.activity.forEach((activity) => {
          activityObject[activity.activity] = activity.percentage;
        });

        setActivityValues(activityObject);
      })
      .catch((error) => {
        console.error("API call failed:", error);
      });
  }, [employeeId]);
  

  const calculateTotalPercentage = () => {
    let totalPercentage = 0;
  
    for (const activity of activityData) {
      const activityName = activity.activity;
      const inputValue = parseFloat(activityValues[activityName]) || 0;
      totalPercentage += inputValue;
    }
  
    return totalPercentage;
  };

  useEffect(() => {
    if (activeTab === "contact") {
      const totalPercentage = calculateTotalPercentage();
      console.log(`Total Percentage: ${totalPercentage}`);
    }
  }, [activeTab]);

  

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    const floatValue = parseFloat(value);
  
    if (value === '' || (!isNaN(floatValue) && floatValue >= 0 && floatValue <= 100)) {
      const newActivityValues = {
        ...activityValues,
        [name]: value === '' ? '' : value, // Set as empty string if value is empty
      };
  
      const totalPercentage = Object.values(newActivityValues).reduce(
        (total, activityValue) => (parseFloat(activityValue) || 0) + total,
        0
      );
 
      if (totalPercentage === 100) {
        setIsTotalPercentage100(true);
        toast.success(`Valid activity input`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      } else {
        setIsTotalPercentage100(false);
       
      }
  
      setActivityValues(newActivityValues);
    } else {
      console.log('Invalid input for activity percentage.');
    }
  };
  
  
  


  return (
    <>
      <Header />
      <Row className=" vw-100  vh-100 ">
        <Col sm={4} md={3} lg={2}>
          <Sidebar />
        </Col>
        <Col sm={8} md={9} lg={10} style={{marginTop : '5%'}}>
          <div className="text-end">
            <Link className=" text-end cancelLink mt-4" to="/dashboard/labour">
             <button className="btn mt-2 mb-2" >
              Cancel{" "}
              <i
                className="fa-solid fa-power-off mx-2"
                style={{ color: "red" }}></i></button>
            </Link>
          </div>
          <div className="mt-0">
            <Form onSubmit={handleSubmit}>
              <div className=" ">
              <Tabs
                justify
                className="gap-5"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}>
                <Tab eventKey="home" title="Basic">
                  <div className="p-5">
                    <Row>
                      <Col>
                      <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        required
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
                        onChange={handleInputChange}>
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
                        onChange={handleInputChange}>
                        <option value="">Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Form.Select>
                    </Form.Group>
                      </Col>
                      
                      <Col>
                      <Form.Group className="pt-3">
                      <Form.Label>
                        Productivity{" "}
                        <span className="text-secondary">
                          (excluding break)
                        </span>
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
                            name="denomination"
                            value={employeeData.denomination}
                            onChange={handleInputChange}>
                            <option value="">Select currency</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="MYR">MYR - Malaysian Ringgit</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                   
                  </div>
                </Tab>

                <Tab eventKey="profile" title="Traceable" className="mx-3">
                  <div className="p-5">
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
                        <Form.Group className="pt-3">
                          <Form.Label>Traceable</Form.Label>
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
                  <div className="p-5 pt-2">
                    <Table bordered className="shadow">
                      <thead>
                        <tr className="text-center ">
                          <th
                            style={{
                              backgroundColor: "#fca311",
                              color: "white",
                            }}>
                            No
                          </th>
                          <th
                            style={{
                              backgroundColor: "#fca311",
                              color: "white",
                            }}>
                            Type of Activity
                          </th>
                          <th
                            style={{
                              backgroundColor: "#fca311",
                              color: "white",
                            }}>
                            Percentage distribution of work
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityData.map((activity, index) => (
                          <tr key={activity.id}>
                            <td className="text-center pt-3">{index + 1}</td>
                            <td className="pt-3">{activity.activity}</td>
                            <td>
                              <Form.Group className="">
                                {/* <Form.Label>{activity.activity}</Form.Label> */}
                                <Form.Control
                                  className="text-center"
                                  name={activity.activity}
                                  type="number"
                                  value={
                                    activityValues[activity.activity] || ''
                                  }
                                  onChange={handleActivityChange}
                                  style={{ height: "40px" }}
                                  
                                />
                              </Form.Group>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="text-center">
                    <Button
                      type="submit"
                      className="subLabButton text-center mx-1"
                      disabled={!isTotalPercentage100}
                      >
                       
                      Confirm
                      <i
                        className="fa-solid fa-user-check px-1"
                        style={{ color: "#ffffff" }}></i>
                    </Button>
                    <ToastContainer />
                  </div>
                </Tab>
              </Tabs>
              </div>
            </Form>

            <Row className="pt-3 mx-5 pb-5">
              <Col>
                <Button
                  className="btn btn-warning text-white border-0 shadow"
                  onClick={handlePreviousTab}
                  disabled={activeTab === "home"}>
                 <i className="fa-solid fa-arrow-left" style={{color: '#ffffff'}}></i> Previous 
                </Button>
              </Col>

              <Col className="text-end">
                <Button
                  className="btn btn-warning text-white border-0 shadow"
                  onClick={handleNextTab}
                  disabled={activeTab === "contact"}>
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

export default EditLabours;
