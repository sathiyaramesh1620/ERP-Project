import React, { useEffect, useState } from "react";
import { Row, Col, Table, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CostDataContext } from "./CostContext";

const CostingSales = () => {

  const { monthYearr, salesChan, costItem, setSelectedSalesChannel, selectedSalesChannel
  ,salesVolume, setSalesVolume, price, setPrice, currency,setCurrency, applyPriceToAllChannels, setApplyPriceToAllChannels } = useContext(CostDataContext);
  
  const [selectedItem, setSelectedItem] = useState({ TableUnits: 0 })

  

  
  console.log(monthYearr);

  console.log(costItem, "costing");
  console.log(selectedItem, "costing---");

  useEffect(() => {
    const storedSelectedItem = sessionStorage.getItem("selectedItem");

    if (storedSelectedItem) {
      const selected = costItem.find(
        (item) => item.Item === storedSelectedItem
      );
      setSelectedItem(selected);
      setSalesVolume(selected && selected.TableUnits ? selected.TableUnits.toString() : '');
    }
  }, [costItem]);

 

  const handleCheckboxChange = (event) => {
    setApplyPriceToAllChannels(event.target.checked);
  };

  
  console.log(currency, '--------');

  //-----------------------session storage -----------------------------------------------------

  const saveDataToSessionStorage = () => {
    sessionStorage.setItem("selectedSalesChannel", selectedSalesChannel);
    sessionStorage.setItem("price", price);
    sessionStorage.setItem("currency", currency);
    sessionStorage.setItem("applyPriceToAllChannels", JSON.stringify(applyPriceToAllChannels));
  };

  useEffect(() => {
    // Retrieve data from session storage on component mount
    const storedSelectedSalesChannel = sessionStorage.getItem("selectedSalesChannel");
    const storedPrice = sessionStorage.getItem("price");
    const storedCurrency = sessionStorage.getItem("currency");
    const storedApplyPriceToAllChannels = sessionStorage.getItem("applyPriceToAllChannels");

    // Set the state with the retrieved values
    if (storedSelectedSalesChannel) {
      setSelectedSalesChannel(storedSelectedSalesChannel);
    }
    if (storedPrice) {
      setPrice(storedPrice);
    }
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
    if (storedApplyPriceToAllChannels) {
      setApplyPriceToAllChannels(JSON.parse(storedApplyPriceToAllChannels));
    }
  }, []);

  useEffect(() => {
    // Save data to session storage when values change
    saveDataToSessionStorage();
  }, [selectedSalesChannel, price, currency, applyPriceToAllChannels]);

  //--------------------------------------------------------------------------------------

  return (
    <div>
      <section>
        <Table bordered hover className="shadow">
          <tbody>
            <tr style={{ height: "60px" }}>
              <th
                className="text-center w-25 pt-3"
                style={{ backgroundColor: "#14213d", color: "white" }}>
                Month
              </th>
              <td className="pt-3">{monthYearr}</td>
            </tr>
            <tr>
              <th
                className="pt-3 text-center"
                style={{ backgroundColor: "#14213d", color: "white" }}>
                Product Sales
              </th>
              <td>
                <Form.Control
                  className="border-0"
                  readOnly
                  value={selectedItem ? selectedItem.TableUnits || 0 : 0}
                  style={{ height: "40px" }}
                  type="number"></Form.Control>
              </td>
            </tr>
            <tr>
              <th
                className="pt-3 text-center"
                style={{ backgroundColor: "#14213d", color: "white" }}>
                Select a sales channel
              </th>
              <td>
              <Form.Select
                  aria-label="Select sales channel"
                  style={{ height: "40px" }}
                  value={selectedSalesChannel || ''}
                  onChange={(e) => setSelectedSalesChannel(e.target.value)}
                >
                  {salesChan && salesChan.length > 0 ? (
                    <>
                      <option>Open this select menu</option>
                      {salesChan.map((channel, index) => (
                        <option key={index} value={channel}>
                          {channel}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option>No sales channels available</option>
                  )}
                </Form.Select>
              </td>
            </tr>
            <tr>
              <th
                className="pt-3 text-center"
                style={{ backgroundColor: "#14213d", color: "white" }}>
                Price
              </th>
              <td>
                <Row>
                  <Col>
                    <Form.Control type="number" style={{ height: "40px" }}
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}/>
                  </Col>
                  <Col>
                    <Form.Select
                      aria-label="Default select example"
                      style={{ height: "40px" }}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}>
                        <option>Select currency</option>
                      <option value="MYR">MYR</option>
                      <option value="INR">INR</option>
                    </Form.Select>
                  </Col>
                </Row>
              </td>
            </tr>
            <tr style={{ height: "60px" }}>
              <th
                className="text-center pt-3"
                style={{ backgroundColor: "#14213d", color: "white" }}>
                Apply price to all sales channel
              </th>
              <td>
                <Form.Check type="checkbox" className="fs-3 mx-3"
                 checked={applyPriceToAllChannels}
                 onChange={handleCheckboxChange}></Form.Check>
              </td>
            </tr>
          </tbody>
        </Table>
      </section>

      <div className="d-flex justify-content-between  ">
        <div className="text-start mx-3 mt-4">
          <Link to="/dashboard/cost/general">
            <Button
              className="float-end btn btn-warning text-white border-0 "
              // type="submit"
              style={{ width: "7rem", backgroundColor: "#fca311" }}>
              <i
                className="fa-solid fa-arrow-left"
                style={{ color: "#ffffff" }}></i>{" "}
              Previous
            </Button>
          </Link>
        </div>

        <div className="text-end mx-3 mt-4">
          <Link to="/dashboard/cost/sides">
            <Button
              className="float-end btn text-white border-0 "
              // type="submit"
              style={{ width: "6rem", backgroundColor: "#fca311" }}>
              Next{" "}
              <i
                className="fa-solid fa-arrow-right"
                style={{ color: "#ffffff" }}></i>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CostingSales;
