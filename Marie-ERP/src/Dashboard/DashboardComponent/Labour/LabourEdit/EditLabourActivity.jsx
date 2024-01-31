import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Table, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./LabourActivity.css";
import LabourContextHelper from "../Hooks/LabourContextHelper";
import { UserContext } from "../../../../Context/UserContext";
import { LaboursDataContext } from "../LaboursContext";

function EditLabourActivity() {
  const [loading, setLoading] = useState(false);

  const { setActivity } = LabourContextHelper();
  const { user } = useContext(UserContext);
  const { inputValues, setInputValues, activityData, setActivityData } =
    useContext(LaboursDataContext);
  console.log("input values", inputValues)
  // const [activityData, setActivityData] = useState([]);
  // const [inputValues, setInputValues] = useState({});
  const [totalInput, setTotalInput] = useState("");
  const navigate = useNavigate();

  const [activityDescriptions, setActivityDescriptions] = useState({});

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.post("/Marie-ERP/api/labour_activity", {
          userId: user.userId,
        });
        console.log(response.data, "activity");
        setActivityData(response.data.data.activity);
        setActivityDescriptions(response.data.data.description);
        // Load input values from sessionStorage or initialize with default values (0)
        const storedInputValues = JSON.parse(
          sessionStorage.getItem("labourActivityInputValues")
        );
        setInputValues(storedInputValues || {});
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    
    // Calculate total input values
    const total = Object.values(inputValues).reduce((acc, val) => acc + val, 0);
    setTotalInput(total);
console.log("input values : ", inputValues, total);
    // Save input values to sessionStorage
    sessionStorage.setItem(
      "labourActivityInputValues",
      JSON.stringify(inputValues)
    );
  }, [inputValues]);

  const getDescription = (activityCode) => {
    return activityDescriptions[activityCode] || "";
  };

    const handleInputChange = (activity, value) => {
      // Update input values state
      setInputValues((prevValues) => ({
        ...prevValues,
        [activity]: parseInt(value, 10) || 0,
      }));
    };

  const handleNextClick = async () => {
    try {
      // Transform inputValues to the required format
      // const transformedData = Object.keys(inputValues).map((activity) => ({
      //   activity,
      //   percentage: inputValues[activity].toString(),
      // }));
      const transformedData = Object.keys(inputValues).map((activityCode) => {
        const fullActivityName = activityData
          .find((activity) => activity.startsWith(activityCode))
          .substr(3);

        return {
          activity: `${activityCode}. ${fullActivityName}`,
          percentage: inputValues[activityCode].toString(),
        };
      });
      setActivity(transformedData);

      console.log("Data sent to the backend:", { activity: transformedData });
      navigate("fs");
      // Send data to the backend
      // Replace the following line with the actual backend API endpoint and payload
      // await axios.post('/Marie-ERP/api/save_activity_data', { activity: transformedData });

      // Perform navigation to the next page
    } catch (error) {
      console.error("Error sending data to the backend", error);
    }
  };

  return (
    <>
      <div>
        <Table bordered>
          <thead>
            <th
              className="p-2 border text-white"
              style={{ width: "10%", backgroundColor: "#012160" }}>
              Activity Code
            </th>
            <th
              className="p-2 border text-white"
              style={{ width: "15%", backgroundColor: "#012160" }}>
              Name
            </th>
            <th
              className="p-2 border text-white"
              style={{ width: "52%", backgroundColor: "#012160" }}>
              Description
            </th>
            <th
              className="p-2 border text-white"
              style={{ backgroundColor: "#012160" }}>
              Time Spent (%)
            </th>
          </thead>

          {loading ? (
            <>
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <div className="loading-text">Activities</div>
              </div>
            </>
          ) : (
            <tbody>
              {activityData.map((activity) => {
              // console.log(activity, "edit activity code ")
                const [activityCode, activityName] = activity.split(". ");
                return (
                  <tr key={activityCode}>
                    <td>{activityCode}</td>
                    <td>{activityName}</td>
                    <td>{getDescription(activityCode)}</td>
                    <td>
                      <Form.Control
                        type="number"
                        style={{ height: "30px" }}
                        value={inputValues[activityCode]}
                        // value={inputValues[activityCode] !== undefined
                        //     ? inputValues[activityCode]
                        //     : ''
                        // }
                        onChange={(e) =>
                          handleInputChange(activityCode, e.target.value)
                        }></Form.Control>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </Table>
      </div>

      <Row className="text-end mb-5">
        <Col>
          <Link to="/dashboard/labour/records/e/r/b">
            <button
              className="btn rounded-0 text-white px-4 mt-4 fs-5 mx-2"
              style={{ backgroundColor: "#002060" }}>
              <i className="fa-solid fa-chevron-left"></i> Prev
            </button>
          </Link>

          {/* <Link to="fs"> */}
            <button
              className="btn rounded-0 text-white px-4 mt-4 fs-5"
              style={{ backgroundColor: "#002060" }}
              onClick={handleNextClick}
              disabled={totalInput !== 100}>
              Next <i className="fa-solid fa-chevron-right"></i>
            </button>
          {/* </Link> */}
        </Col>
      </Row>
    </>
  );
}

export default EditLabourActivity;

// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { Row, Col, Table, Form } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// function LabourActivity() {
//   const [activityData, setActivityData] = useState([]);
//   const [inputValues, setInputValues] = useState({});
//   const [totalInput, setTotalInput] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.post('/Marie-ERP/api/labour_activity', { userId: 19 });
//         console.log(response.data, 'activity');
//         setActivityData(response.data.data.activity);
//         // Initialize input values state with default values (0)
//         setInputValues(
//           response.data.data.activity.reduce((acc, activity) => {
//             acc[activity] = 0;
//             return acc;
//           }, {})
//         );
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     // Calculate total input values
//     const total = Object.values(inputValues).reduce((acc, val) => acc + val, 0);
//     setTotalInput(total);
//   }, [inputValues]);

//   const handleInputChange = (activity, value) => {
//     // Update input values state
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [activity]: parseInt(value, 10) || 0, // Ensure value is a number, default to 0
//     }));
//   };

//   const handleNextClick = async () => {
//     try {
//       // Transform inputValues to the required format
//       const transformedData = Object.keys(inputValues).map((activity) => ({
//         activity,
//         percentage: inputValues[activity].toString(), // Assuming 'percentage' is a string in your backend
//       }));

//       // Send data to the backend
//       // Replace the following line with the actual backend API endpoint and payload
//       // await axios.post('/Marie-ERP/api/save_activity_data', { activity: transformedData });

//       // Perform navigation to the next page
//       console.log('Data sent to the backend:', {activity : transformedData});
//     } catch (error) {
//       console.error('Error sending data to the backend', error);
//     }
//   };

//   return (
//     <>
//       <div>
//         <Table bordered>
//           <thead>
//             <th className='p-2 border' style={{ width: '10%' }}>Activity Code</th>
//             <th className='p-2 border' style={{ width: '15%' }}>Name</th>
//             <th className='p-2 border' style={{ width: '52%' }}>Description</th>
//             <th className='p-2 border'>Time Spent (%)</th>
//           </thead>
//           <tbody>
//             {activityData.map((activity) => (
//               <tr key={activity}>
//                 <td>{activity.split('. ')[0]}</td>
//                 <td>{activity.split('. ')[1]}</td>
//                 <td>Description for {activity}</td>
//                 <td>
//                   <Form.Control
//                     type='number'
//                     style={{ height: '30px' }}
//                     //value={inputValues[activity]}
//                     onChange={(e) => handleInputChange(activity, e.target.value)}
//                   ></Form.Control>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       <Row className="text-end mb-5">
//         <Col>
//         <Link to=''>
//           <button
//             className="btn rounded-0 text-white px-4 mt-4 fs-5"
//             style={{ backgroundColor: "#002060" }}
//             onClick={handleNextClick}
//             disabled={totalInput !== 100}
//           >
//             Next <i className="fa-solid fa-chevron-right"></i>
//           </button></Link>
//         </Col>
//       </Row>
//     </>
//   );
// }

// export default LabourActivity;
