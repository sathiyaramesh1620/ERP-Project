// import axios from "axios";
// import React, { useState, useEffect, useContext } from "react";
// import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "../../../Context/UserContext";

// const PurchaseItemList = ({ item, category }) => {
//   const { user } = useContext(UserContext);
//   const [storedData, setStoredData] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [data, setData] = useState({
//     purchaseCount: "",
//     purchaseDate: "",
//     currency: "",
//     purchasePrice: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleInputChange = (e) => {
//     setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleAddNew = () => {
//     setLoading(true);
//     axios
//       .post("/Marie-ERP/api/stocks/purchase", {
//         userId: user.userId,
//         category,
//         ingredient: item.ingredient,
//         subtype: item.subtype,
//         data,
//       })
//       .then((res) => {
//         console.log(res);
//         setSuccessMsg("Purchase added successfully!");
//         setErrorMsg("");
//         toast.success("Purchase added successfully!", {
//           position: "top-right",
//         });
//         // Handle success, update UI or state if necessary
//       })
//       .catch((err) => {
//         console.log(err);
//         setSuccessMsg("");
//         setErrorMsg("Failed to add purchase. Please try again.");
//         toast.error("Failed to add purchase. Please try again.", {
//           position: "top-right",
//         });
//         // Handle error, show error message to the user if needed
//       })
//       .finally(() => {
//         setLoading(false);
//         setShowModal(false);
//       });
//   };

//   useEffect(() => {
//     setStoredData([]);
//     if (item && item.ingredient && item.subtype) {
//       setLoading(true);
//       axios
//         .post("/Marie-ERP/api/stocks/purchaseList", {
//           userId: user.userId,
//           category,
//           ingredient: item.ingredient,
//           subtype: item.subtype,
//         })
//         .then((res) => {
//           setStoredData(res.data.data.reverse());
//         })
//         .catch((err) => {
//           console.log(err);
//           // Handle error, show error message to the user if needed
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }
//   }, [item, category]);

//   return (
//     <div>
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Purchase</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <input
//             type="text"
//             className="form-control"
//             name="purchaseCount"
//             placeholder="Enter purchaseCount"
//             value={data.purchaseCount}
//             onChange={handleInputChange}
//           />
//           <input
//             type="text"
//             className="form-control my-1"
//             name="purchasePrice"
//             placeholder="Enter purchasePrice"
//             value={data.purchasePrice}
//             onChange={handleInputChange}
//           />
//           <select
//             name="currency"
//             className="form-control my-1"
//             value={data.currency}
//             onChange={handleInputChange}>
//             <option>RS</option>
//             <option>RM</option>
//           </select>

//           <input
//             type="date"
//             className="form-control my-1"
//             name="purchaseDate"
//             placeholder="Enter purchaseDate"
//             value={data.purchaseDate}
//             onChange={handleInputChange}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleAddNew}>
//             Add
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {item && item.ingredient ? (
//         <Row>
//           <Col className=" d-flex justify-content-center align-items-center">
//             <div>
//               <div className="fw-bold text-warning">
//                 {item.ingredient}{" "}
//                 {item.subtype === "-" ? null : `(${item.subtype})`}
//               </div>
//               <div className=" text-secondary">
//                 {item.measurements} | {item.purchase_cycle}
//               </div>
//             </div>
//           </Col>
//           <Col className="d-flex justify-content-center align-items-center">
//             <button
//               className="text-light bg-dark-blue rounded-2 p-1 px-3"
//               onClick={() => setShowModal(true)}>
//               Add New <i className="fa-solid fa-plus mx-2 text-light"></i>
//             </button>
//           </Col>
//           {loading ? (
//             <>
//               <Col className="border border-1 mx-1 p-1 placeholder"></Col>
//               <Col className="border border-1 mx-1 p-1 placeholder"></Col>
//             </>
//           ) : (
//             storedData.map((data, index) => (
//               <Col
//                 xs={4}
//                 key={index}
//                 className="d-flex flex-column  p-2">
//                 <div className="rounded-2 border p-3 shadow-sm">
//                   <div>
//                     <div className=" text-secondary">Price</div>
//                     <div className="h5">
//                       {data.purchasePrice} {data.currency}
//                     </div>
//                   </div>

//                   <div>
//                     <div className=" text-secondary">Count</div>
//                     <div className="h6">{data.purchaseCount}</div>
//                   </div>

//                   <div>
//                     <div className=" text-secondary">Date</div>
//                     <div className="h6">{data.purchaseDate}</div>
//                   </div>
//                 </div>
//               </Col>
//             ))
//           )}
//         </Row>
//       ) : (
//         <div className="text-center">Please select an item.</div>
//       )}
//       <ToastContainer autoClose={3000} hideProgressBar position="top-right" />
//     </div>
//   );
// };

// export default PurchaseItemList;


// ===============================================================================================================

import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import Slider from "react-slick";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../Context/UserContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PurchaseItemList = ({ item, category }) => {
  const { user } = useContext(UserContext);
  const [storedData, setStoredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    purchaseCount: "",
    purchaseDate: "",
    currency: "",
    purchasePrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddNew = () => {
    setLoading(true);
    axios
      .post("/Marie-ERP/api/stocks/purchase", {
        userId: user.userId,
        category,
        ingredient: item.ingredient,
        subtype: item.subtype,
        data,
      })
      .then((res) => {
        console.log(res);
        setSuccessMsg("Purchase added successfully!");
        setErrorMsg("");
        toast.success("Purchase added successfully!", {
          position: "top-right",
        });
        // Handle success, update UI or state if necessary
      })
      .catch((err) => {
        console.log(err);
        setSuccessMsg("");
        setErrorMsg("Failed to add purchase. Please try again.");
        toast.error("Failed to add purchase. Please try again.", {
          position: "top-right",
        });
        // Handle error, show error message to the user if needed
      })
      .finally(() => {
        setLoading(false);
        setShowModal(false);
      });
  };

  useEffect(() => {
    setStoredData([]);
    if (item && item.ingredient && item.subtype) {
      setLoading(true);
      axios
        .post("/Marie-ERP/api/stocks/purchaseList", {
          userId: user.userId,
          category,
          ingredient: item.ingredient,
          subtype: item.subtype,
        })
        .then((res) => {
          setStoredData(res.data.data.reverse());
        })
        .catch((err) => {
          console.log(err);
          // Handle error, show error message to the user if needed
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [item, category]);

  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3.2,
    slidesToScroll: 1,
  };

  return (
    <div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
          <Modal.Title>Add New Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            name="purchaseCount"
            placeholder="Enter purchaseCount"
            value={data.purchaseCount}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="form-control my-1"
            name="purchasePrice"
            placeholder="Enter purchasePrice"
            value={data.purchasePrice}
            onChange={handleInputChange}
          />
          <select
            name="currency"
            className="form-control my-1"
            value={data.currency}
            onChange={handleInputChange}>
            <option>RS</option>
            <option>RM</option>
          </select>

          <input
            type="date"
            className="form-control my-1"
            name="purchaseDate"
            placeholder="Enter purchaseDate"
            value={data.purchaseDate}
            onChange={handleInputChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddNew}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {item && item.ingredient ? (
        <Row className=" mt-3">
          <Col sm={12} className="d-flex justify-content-start align-items-center">
          {/* <div className=" p-2">
              <div className="fw-bold text-warning">
                {item.ingredient}{" "}
                {item.subtype === "-" ? null : `(${item.subtype})`}
              </div>
              <div className=" text-secondary">
                {item.measurements} | {item.purchase_cycle}
              </div>
            </div> */}
          
            <button
              className="text-light bg-dark-blue rounded-2 p-1 px-3"
              onClick={() => setShowModal(true)}
            >
              Add New <i className="fa-solid fa-plus mx-2 text-light"></i>
            </button>
          </Col>
          <Col sm={12} className=" p-2 mt-2">
          {loading ? (
            <>
              <div className="border mx-2 p-1 spinner-grow"></div>
            </>
          ) : (
            <div className=" w-100 ">
            <Slider {...slickSettings} className=" p-0 ">
              {storedData.map((data, index) => (
                <div key={index} className="d-flex flex-column h-100 ">
                  <div className="rounded-2 border p-3 shadow-sm h-100 mx-2 ">
                  {index === 0 ? <div className=" float-end text-warning"> new</div> : <div className=" float-end text-warning"> #{index + 1}</div>}
                  <div>
                    <div className=" text-secondary">Price</div>
                    <div className="h4">
                      {data.purchasePrice} {data.currency}
                    </div>
                  </div>

                  <div>
                    <div className=" text-secondary">Count</div>
                    <div className="h5">{data.purchaseCount}</div>
                  </div>

                  <div>
                    <div className=" text-secondary">Date</div>
                    <div className="h6">{data.purchaseDate}</div>
                  </div>
                  </div>
                </div>
              ))}
            </Slider>
            </div>
          )}
          </Col>
        </Row>
      ) : (
        <div className="text-center">Please select an item.</div>
      )}
      <ToastContainer autoClose={3000} hideProgressBar position="top-right" />
    </div>
  );
};

export default PurchaseItemList;
