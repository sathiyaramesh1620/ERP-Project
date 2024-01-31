import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Row, Modal, Form } from "react-bootstrap";
import Slider from "react-slick";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Ingredient.css'





const StockCount = ({ idata, category, userId }) => {
  const [stockList, setStockList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [showAddNew, setShowAddNew] = useState(false);
  const [data, setData] = useState({
    stockCount: "",
    stockCountDate: "",
    nextForecast: "",
    closingStock: "",
    consumption: "",
  });

  useEffect(() => {
    const getStockList = async () => {
      try {
        setListLoading(true);
        const res = await axios.post("/Marie-ERP/api/stocks/stockList", {
          userId: userId,
          category,
          ingredient: idata.ingredient,
          subtype: idata.subtype,
        });
        setStockList(res.data.data.reverse());
        setListLoading(false);
      } catch (error) {
        console.log(error);
        setListLoading(false);
      }
    };

    getStockList();
  }, [idata, showAddNew]);

  const handleSave = () => {
    setShowAddNew(false);
    axios
      .post("/Marie-ERP/api/stocks", {
        userId: userId,
        category,
        ...idata,
        data,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          // Show success toast notification
          toast.success("Data saved successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        // Show error toast notification if the request fails
        toast.error("Error saving data. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  const handleChange = (_key, _value) => {
    setData((prev) => {
      return {
        ...prev,
        [_key]: _value,
      };
    });
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style}}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style}}
        onClick={onClick}
      />
    );
  }

  const slickSettings = {
    dots: true,
    infinite: false,
    //speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    // prevArrow: <SamplePrevArrow />,
    // nextArrow: <SampleNextArrow />,
  };

  const [showModalPurchase, setShowModalPurchase] = useState(false);

  const handleClose = () => setShowModalPurchase(false);
  const handleShow = () => setShowModalPurchase(true);

  const [showModalComb, setShowModalComb] = useState(false);

  const handleCloseComb = () => setShowModalComb(false);
  const handleShowComb = () => setShowModalComb(true);

  return (
    <>
      <Row className="my-1">
        <Col sm={12} className="d-flex justify-content-start align-items-center">
        <button
            className="text-light bg-dark-blue rounded-2 p-1 px-3 my-2"
            onClick={() => setShowAddNew(true)}
          >
            Add New <i className="fa-solid fa-plus mx-2 text-light"></i>
          </button>
        </Col>
   
        {listLoading ? (
          <>
            <div className="border border-1 mx-3 p-1 spinner-grow"></div>
            
          </>
        ) : (
          <Col sm={12}>
            {stockList.length > 0 ? (
              <Slider {...slickSettings}>
                {stockList.map((data, i) => {
                  const {
                    stockCount,
                    stockDate,
                    nextForcast,
                    closingStock,
                    consumption,
                  } = data;
                  return (
                    <Col
                      key={i}
                      className="d-flex flex-column  p-2 ">
                      <div className=" gap-4 p-3 shadow rounded-3 " >
                        {i === 0 ? <div className=" float-end text-warning"> new</div> : <div className=" float-end text-warning"> #{i + 1}</div>}
                        <div>
                          <div className="text-secondary">Count</div>
                          <div className="h4">{stockCount}</div>
                        </div>
                        <div>
                          <div className="text-secondary">Date</div>
                          <div>{stockDate}</div>
                        </div>
                        <div>
                          <div className="text-secondary">Forecast</div>
                          <div>{nextForcast}</div>
                        </div>
                        <div>
                          <div className="text-secondary">Closing Stock</div>
                          <div>{closingStock ? closingStock : 0}</div>
                        </div>
                        <div>
                          <div className="text-secondary">Consumption</div>
                          <div>{consumption ? consumption : 0}</div>
                        </div>
                        
                        <div className="d-flex justify-content-between mt-3">
                          <button className="btn btn-outline-warning shadow-sm" onClick={handleShowComb}>View</button>
                          <button className="btn btn-outline-warning shadow-sm" onClick={handleShow}><i className="fa-solid fa-cart-shopping" style={{color: '#fca311'}}></i> Purchase</button>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Slider>
            ) : <div className=" p-2"> "No data found"</div>}
          </Col>
        )}
      </Row>


      <Modal show={showModalPurchase} onHide={() => setShowModalPurchase(false)}>
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
           // onChange={handleInputChange}
          />
          <input
            type="text"
            className="form-control my-1"
            name="purchasePrice"
            placeholder="Enter purchasePrice"
            value={data.purchasePrice}
          //  onChange={handleInputChange}
          />
          <select
            name="currency"
            className="form-control my-1"
            value={data.currency}
           // onChange={handleInputChange}
           >
            <option>RS</option>
            <option>RM</option>
          </select>

          <input
            type="date"
            className="form-control my-1"
            name="purchaseDate"
            placeholder="Enter purchaseDate"
            value={data.purchaseDate}
            //onChange={handleInputChange}
          />
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button> */}
          <Button variant="primary" //onClick={handleAddNew}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      

      <Modal size="lg" show={showModalComb} onHide={() => setShowModalComb(false)} >
      <Modal.Header closeButton >
          <Modal.Title >Stock and Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body className="" >
              <Row className="p-3 gap-4 ">
                <Col className="shadow rounded-4 px-4" lg={6} md={12} sm={12} xs={12} style={{backgroundColor : '#fdf0c7'}}>

                  <div className="text-center mb-2 pt-3" ><h4>Stock</h4></div>
                <div className="d-flex justify-content-between "><div>
                    <h5 className="text-secondary">Count</h5>
                    <h3>150</h3></div>
                    <div className="p-3"><h5 style={{color : 'orange'}}>#2</h5></div>
                    
                  </div>

                    <div className="mt-4">
                    <h5 className="text-secondary">Date</h5>
                    <h3>2023-12-24</h3></div>

                    <div className="mt-4">
                    <h5 className="text-secondary">Forcast</h5>
                    <h3>10</h3></div>

                    <div className="mt-4">
                    <h5 className="text-secondary">Closing stock</h5>
                    <h3>10</h3></div>

                    <div className="mt-4">
                    <h5 className="text-secondary">Consumption</h5>
                    <h3>5</h3></div>
                </Col>

                <Col className="shadow rounded-4 px-4" style={{backgroundColor : '#c7fdcb'}}>
                <div className="text-center mb-2 pt-3" ><h4>Purchase</h4></div>
                <div className="d-flex justify-content-between ">
                  <div>
                  <h5 className="text-secondary">Count </h5>
                  <div className="d-flex justify-content-start">
                    <h3>10</h3> <span className="px-2 pt-1" style={{color : 'green'}}>(+2)</span></div></div>
                    <div className="p-3"><h5 style={{color : 'orange'}}>#2</h5></div>
                    
                  </div>
                  <div className="mt-4">
                    <h5 className="text-secondary">Date</h5>
                    <h3>2023-12-24</h3></div>

                  <div className="mt-4">
                  <h5 className="text-secondary">Price</h5>
                    <h3>RM 150</h3>
                   </div>

                   
                </Col>
              </Row>
        </Modal.Body>
       
      </Modal>



      <Modal show={showAddNew} onHide={() => setShowAddNew(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Stock Count</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group className="mb-2" controlId="stockCount">
              <Form.Label>Count</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                value={data.stockCount}
                onChange={(e) => handleChange("stockCount", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="stockCountDate">
              <Form.Label>Count Date</Form.Label>
              <Form.Control
                type="date"
                value={data.stockCountDate}
                onChange={(e) => handleChange("stockCountDate", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="nextForecast">
              <Form.Label>Next Forecast</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                value={data.nextForecast}
                onChange={(e) => handleChange("nextForecast", e.target.value)}
              />
            </Form.Group>
            {/* <Form.Group className="mb-2" controlId="closingStock">
              <Form.Label>closingStock</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                value={data.closingStock}
                onChange={(e) => handleChange("closingStock", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="consumption">
              <Form.Label>consumption</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                value={data.consumption}
                onChange={(e) => handleChange("consumption", e.target.value)}
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddNew(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default StockCount;
