// import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useContext, useEffect, useState } from "react";
// import { SalesDataContext } from "./SalesContext";
// import { Button, Col, Modal } from "react-bootstrap";
// import { motion } from "framer-motion";
// import "./Sales.css";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { UserContext } from "../../../Context/UserContext";

// const ChannelType = () => {
//   const { selectedMMYYYY, channels, setChannels, setSalesData } =
//     useContext(SalesDataContext);
//   const { user } = useContext(UserContext);
//   const [loading, setLoading] = useState(true);

//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const handleSelect = (_data) => {
//     const updatedChannel = [...channels];
//     updatedChannel[_data.id - 1] = {
//       ...updatedChannel[_data.id - 1],
//       active: !updatedChannel[_data.id - 1].active,
//     };
//     setChannels(updatedChannel);
//   };

//   useEffect(() => {
    
//     const data = {
//       month: selectedMMYYYY.month,
//       year: selectedMMYYYY.year,
//       userId: user.userId ? user.userId : "555",
//     };
  
//   axios.post("/Marie-ERP/api/sales_month", data)
//   .then((res) => console.log(res, ''))
  
//   },[channels])
  
//   useEffect(() => {
//     setLoading(true);
//     setChannels((prevChannels) => {
//       const resetChannels = prevChannels.map((channel) => {
//         return {
//           ...channel,
//           active: false,
//           food: "",
//           beverages: "",
//         };
//       });
//       setSalesData(resetChannels);
//       return resetChannels;
//     });
//     const data = {
//       month: selectedMMYYYY.month,
//       year: selectedMMYYYY.year,
//       userId: user.userId ? user.userId : "555",
//     };
//     axios
//       .post("/Marie-ERP/api/sales_month", data)
//       .then((response) => {
//         console.log(response.data.data, 'AAAAA');
//         const salesChannels = response.data.data.sales_channel;
//         const salesChannelData = response.data.data.sales_channel_data;

//         setChannels((prevChannels) => {
//           const updatedChannels = prevChannels.map((channel, i) => {
//             const matchedItem = salesChannels.find(
//               (item) => item.reach === channel.name
//             );
//             if (matchedItem) {
//               const index = salesChannels.findIndex(
//                 (item) => item.reach === channel.name
//               );
//               return {
//                 ...channel,
//                 active: true,
//                 food: salesChannelData.food_values[index],
//                 beverages: salesChannelData.beverages_values[index],
//               };
//             }
//             return channel;
//           });
//           setSalesData(updatedChannels);
//           return updatedChannels;
//         });
//         setLoading(false); })
//       .catch((error) => {
//         console.error("Error fetching sales_month_data:", error);
//         setLoading(false);
//       });
//   }, [selectedMMYYYY.month, selectedMMYYYY.year]);

 

//   console.log(channels)

//   return (
//     <>
//       {loading ? (
//         <>
//            <div className="loading-overlay">
//           <div className="loading-spinner"></div>
//           <div className="loading-text">Marie-ERP</div>
//         </div>
      
//       </> ) : (
//         <>
//         <button className="btn" onClick={handleShow}>Ask permission to add channels</button>
//       <motion.div
//         initial={{ y: 1000 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.2 }}>
//         <Col className="mt-5 d-flex flex-wrap justify-content-center">
//           {channels.map((data, i) => {
//             return (
//               <motion.button
//                 initial={{ y: 300 }}
//                 animate={{ y: 0 }}
//                 transition={{ duration: i / 10 + 0.1 }}
//                 className={`btn button-groups btntoggle border-2 fw-bold  ${
//                   data.active ? "active" : ""
//                 }`}
//                 onClick={() => handleSelect(data)}
//                 disabled={data.active === false}>
//                 {data.name}
//               </motion.button>
//             );
//           })}
//         </Col>
//       </motion.div>

//       <div className="text-end mx-5 pt-4 ">
//         <Link to="/dashboard/sales/salesbychannel ">
//           <Button
//             className="float-end btn btn-warning text-white"
//             type="submit"
//             style={{ width: "6rem", backgroundColor: "#fca311" }}>
//             Next{" "}
//             <FontAwesomeIcon icon={faArrowRight} style={{ color: "#ffffff" }} />{" "}
//           </Button>
//         </Link>
//       </div>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Ask permission</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>This is the content of the modal.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       </>
//       )}
//     </>
//   );
// };

// export default ChannelType;

import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Modal, Form, TabContainer } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { SalesDataContext } from "./SalesContext";
import { Link } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import { ToastContainer, toast } from 'react-toastify';

const ChannelType = () => {
  const { selectedMMYYYY, channels, setChannels, setSalesData } = useContext(
    SalesDataContext
  );
  const {user} = useContext(UserContext)
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState([]);
const[update, setUpdate] = useState(channels)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelect = (_data) => {
    const updatedChannel = [...channels];
    updatedChannel[_data.id - 1] = {
      ...updatedChannel[_data.id - 1],
      active: !updatedChannel[_data.id - 1].active,
    };
    setChannels(updatedChannel);
  };

  // const handleCheckboxChange = (channel) => {
  //   const updatedSelectedChannels = [...selectedChannels];
  //   const index = updatedSelectedChannels.findIndex(
  //     (selectedChannel) => selectedChannel.id === channel.id
  //   );

  //   if (index === -1) {
  //     // If not found, add to selected channels
  //     updatedSelectedChannels.push(channel);
  //   } else {
  //     // If found, remove from selected channels
  //     updatedSelectedChannels.splice(index, 1);
  //   }

  //   setSelectedChannels(updatedSelectedChannels);
  // };

  // const handleCheckboxChange = (channel) => {
  //   setChannels((prevChannels) => {
  //     const updatedChannels = prevChannels.map((prevChannel) => {
  //       if (prevChannel.id === channel.id) {
  //         // Toggle the 'active' state for the selected channel
  //         return {
  //           ...prevChannel,
  //           active: !prevChannel.active,
  //         };
  //       }
  //       return prevChannel;
  //     });
  
  //     return updatedChannels;
  //   });
  // };

  const handleCheckboxChange = (channel) => {
    setUpdate((prevUpdate) => {
      const updatedUpdate = prevUpdate.map((prevChannel) => {
        if (prevChannel.id === channel.id) {
          return {
            ...prevChannel,
            active: !prevChannel.active,
          };
        }
        return prevChannel;
      });
  
      // Update selectedChannels state based on updatedUpdate
      const updatedSelectedChannels = updatedUpdate.filter((channel) => channel.active);
      setSelectedChannels(updatedSelectedChannels);
  
      return updatedUpdate;
    });
  };
  
  


      

  const handleSaveChanges = () => {
    console.log({userId : user.userId ? user.userId : 5,  month : selectedMMYYYY.month,
      year : selectedMMYYYY.year,selectedChannels}, 'permission')
    axios
      .post("/Marie-ERP/api/request", { 
        userId : user.userId ? user.userId : 5,
        month : selectedMMYYYY.month,
        year : selectedMMYYYY.year,
        selectedChannels
        })
      .then((response) => {
        console.log(response, 'request');
        handleClose();
        toast.success(`Asked permission successfully. Will update that soon.`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        })
      })
      .catch((error) => {
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        })
        console.error("Error updating channels:", error);
        
      });
  };

    useEffect(() => {
    setLoading(true);
    setChannels((prevChannels) => {
      const resetChannels = prevChannels.map((channel) => {
        return {
          ...channel,
          active: false,
          food: "",
          beverages: "",
        };
      });
      setSalesData(resetChannels);
      return resetChannels;
    });
    const data = {
      month: selectedMMYYYY.month,
      year: selectedMMYYYY.year,
      userId: user.userId ? user.userId : "555",
    };
    const fetchdata = async () => {
   await axios
      .post("/Marie-ERP/api/sales_month", data)
      .then((response) => {
        console.log(response.data.data, 'AAAAA');
        const salesChannels = response.data.data.sales_channel;
        const salesChannelData = response.data.data.sales_channel_data;

        setChannels((prevChannels) => {
          const updatedChannels = prevChannels.map((channel, i) => {
            const matchedItem = salesChannels.find(
              (item) => item.reach === channel.name
            );
            if (matchedItem) {
              const index = salesChannels.findIndex(
                (item) => item.reach === channel.name
              );
              return {
                ...channel,
                active: true,
                food: salesChannelData.food_values[index],
                beverages: salesChannelData.beverages_values[index],
              };
            }
            return channel;
          });
          setSalesData(updatedChannels);
          return updatedChannels;
        });
        setLoading(false); })
      .catch((error) => {
        console.error("Error fetching sales_month_data:", error);
        setLoading(false);
      });
    }
      fetchdata()
  }, [selectedMMYYYY.month, selectedMMYYYY.year]);

useEffect(() => {
  setUpdate(channels)
},[selectedMMYYYY.month, selectedMMYYYY.year, channels])
  
console.log(channels);
  
  return (
<>

    {loading ? (
              <>
                 <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <div className="loading-text">Marie-ERP</div>
              </div>
            
            </> 
            ) : (
              
    <>
<ToastContainer />
      <div className="text-start">
      <button className="btn btn-warning mx-3" onClick={handleShow}>
      <i className="fa-solid fa-pen"></i>
      </button></div>

      <motion.div
        initial={{ y: 1000 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Render the channels in the main content */}
        <Col className="mt-5 d-flex flex-wrap justify-content-center">
          {channels.map((data, i) => {
            return (
              <motion.div key={data.id}>
                <button
                  initial={{ y: 300 }}
                  animate={{ y: 0 }}
                  transition={{ duration: i / 10 + 0.1 }}
                  className={`btn button-groups btntoggle border-2 fw-bold  ${
                    data.active ? "active" : ""
                  }`}
                  // onClick={() => handleSelect(data)}
                  
                >
                  {data.name}
                </button>
              </motion.div>
            );
          })}
        </Col>
      </motion.div>

      <div className="text-end mx-5 pt-4 ">
        <Link to="/dashboard/sales/salesbychannel ">
          <Button
            className="float-end btn btn-warning text-white"
            type="submit"
            style={{ width: "6rem", backgroundColor: "#fca311" }}
          >
            Next <FontAwesomeIcon icon={faArrowRight} style={{ color: "#ffffff" }} />{" "}
          </Button>
        </Link>
      </div></>)}
      
      
      {/* Modal for asking permission */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Request for channel change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Request permission to change</p>
          <Form>
            {update
            .map((channel) => (
              <Form.Check
                key={channel.id}
                type="checkbox"
                id={`channel-checkbox-${channel.id}`}
                label={channel.name}
                onChange={() => handleCheckboxChange(channel)}
                checked={channel.active}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{
            handleSaveChanges()
            handleClose()
            }}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChannelType;
