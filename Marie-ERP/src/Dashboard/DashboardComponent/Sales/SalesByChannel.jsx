import React from "react";
import { useContext, useState, useEffect } from "react";
import { SalesDataContext } from "./SalesContext";
import { Col, Row, Form, Table, Button } from "react-bootstrap";
import axios from "axios";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../../Context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import ChannelType from "./ChannelType";
import "./SalesByChannel.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesByChannel = () => {
  const { selectedMMYYYY, channels, setChannels, salesData } =
    useContext(SalesDataContext);
  const history = useNavigate();
  const { user } = useContext(UserContext);

  const [dataSentSuccessfully, setDataSentSuccessfully] = useState(false);
  const [dataSentForCurrentMonth, setDataSentForCurrentMonth] = useState(false);

  const [totalFood, setTotalFood] = useState(0);
  const [totalBeverages, setTotalBeverages] = useState(0);
  const [channelTotals, setChannelTotals] = useState({});

  const [DataChange, setDataChange] = useState(false);

  // console.log(salesData.sales_channel_data, " sales by channel@@@");
  const showToastMessage = () => {
    toast.success("Data saved successfully !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const showToastError = (error) => {
    toast.error(error.message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  const handleNavigation = () => {
    // Auto navigate to the specified path after 3 seconds
    setTimeout(() => {
      history("/dashboard/sales/salesbymenu");
    }, 3000);
  };

  const handleChange = (_index, _name, _value) => {
    const updatedChannel = [...channels];
    // Toggle the active property for the clicked
    updatedChannel[_index - 1] = {
      ...updatedChannel[_index - 1],
      [_name]: _value,
    };
    // Update the state with the modified array
    setChannels(updatedChannel);
    setDataChange(true);
    // Update total values when input values change
    const foodTotal = updatedChannel.reduce((acc, channel) => {
      return acc + (channel.food ? parseFloat(channel.food) : 0);
    }, 0);
    const beveragesTotal = updatedChannel.reduce((acc, channel) => {
      return acc + (channel.beverages ? parseFloat(channel.beverages) : 0);
    }, 0);

    setTotalFood(foodTotal);
    setTotalBeverages(beveragesTotal);

    // Update channel totals
    const updatedChannelTotals = {};
    updatedChannel.forEach((channel) => {
      if (channel.active) {
        const channelName = channel.name;
        const channelTotal =
          (channel.food ? parseFloat(channel.food) : 0) +
          (channel.beverages ? parseFloat(channel.beverages) : 0);
        updatedChannelTotals[channelName] = channelTotal;
      }
    });

    setChannelTotals(updatedChannelTotals);
  };
  console.log(totalFood, "food total");
  console.log(totalBeverages, "beveragesTotal");
  console.log(channelTotals, "channels");

  function sendDataToBackend() {
    if (dataSentForCurrentMonth) {
      // Data has already been sent for the current month, no need to send again.
      return;
    }

    // Filter the active channels
    const activeChannels = channels.filter((channel) => channel.active);

    // Extract the names, food, and beverages data separately
    const channelNames = activeChannels.map((channel) => channel.name);
    const foodData = activeChannels.map((channel) => channel.food);
    const beveragesData = activeChannels.map((channel) => channel.beverages);
    const mergedTotal = {
      ...channelTotals,
      food_Total: totalFood,
      beverages_Total: totalBeverages,
    };
    // Construct the data object
    const dataToSend = {
      channels: channelNames,
      food: foodData,
      beverages: beveragesData,
      month: selectedMMYYYY.month,
      year: selectedMMYYYY.year,
      userId: user.userId ? user.userId : "555",
      values: [mergedTotal],
    };

    console.log({
      channels: channelNames,
      food: foodData,
      beverages: beveragesData,
      month: selectedMMYYYY.month,
      year: selectedMMYYYY.year,
      userId: user.userId ? user.userId : "555",
      values: [mergedTotal],
    });
    // Send a POST request to your backend API
    axios
      .post("/Marie-ERP/api/saleschannel", { ...dataToSend }) // Wrap the data in an array
      .then((response) => {
        // Handle a successful response from the backend if needed
        console.log("Data sent successfully:", response.data.message);
        if (response.data.status === 200) {
          showToastMessage();
          setDataSentSuccessfully(true);
          handleNavigation();
        }
        setDataSentForCurrentMonth(true);
      })
      .catch((error) => {
        // Handle errors if the request fails
        console.error("Error sending data to the backend:", error);
        showToastError(error);
      });
  }

  useEffect(() => {
    // Reset the dataSentForCurrentMonth when a new month is selected.
    setDataSentForCurrentMonth(false);
  }, [selectedMMYYYY]);

  function isAnyChannelActive() {
    return channels.some((channel) => channel.active);
  }

  // Sending data to ProcessBuilder
  const [salesChannel, setSalesChannel] = useState(null);
  useEffect(() => {
    axios
      .post("/Marie-ERP/api/init")
      .then((response) => {
        const { status, data } = response;
        if (status === 200) {
          setSalesChannel(data);
          console.log(data);
        } else {
          console.error(`Error: Status ${status}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log(channels, 'channels');

  return (
    <>
      {channels.filter((item) => item.active).length > 0 ? (
        <Form>
          <Table bordered responsive className=" mt-5 shadow">
            <thead>
              <tr className="border-0">
                <th style={{ backgroundColor: "#14213d", color: "white" }}>
                  Channels
                </th>
                {channels
                  .filter((data) => data.active === true)
                  .map((data) => {
                    return (
                      <th
                        style={{ backgroundColor: "#14213d", color: "white" }}
                        key={data.id}>
                        {data.name}
                      </th>
                    );
                  })}
                <th style={{ backgroundColor: "#14213d", color: "white" }}>
                  Units
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    backgroundColor: "#14213d",
                    color: "white",
                    paddingTop: "1rem",
                  }}
                  className="">
                  Food
                </td>
                {channels
                  .filter((data) => data.active === true)
                  .map((data) => {
                    return (
                      <td key={data.id}>
                        <Form.Control
                          className=""
                          defaultValue={data.food}
                          placeholder={`Enter the sales count of ${data.name}`}
                          type="number"
                          onChange={(e) => {
                            handleChange(data.id, "food", e.target.value);
                          }}
                        />
                      </td>
                    );
                  })}

                {/*---------------------------------------------------Food Total------------------------------- ---------------------------- */}
                <td>
                  <Form.Control
                    readOnly
                    className=""
                    value={channels
                      .filter((data) => data.active === true)
                      .reduce((acc, channel) => {
                        return (
                          acc + (channel.food ? parseFloat(channel.food) : 0)
                        );
                      }, 0)}
                  />
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    backgroundColor: "#14213d",
                    color: "white",
                    paddingTop: "1rem",
                  }}
                  className=" align-items-center">
                  Beverages
                </td>
                {channels
                  .filter((data) => data.active === true)
                  .map((data) => {
                    return (
                      <td key={data.id}>
                        <Form.Control
                          className=""
                          defaultValue={data.beverages}
                          placeholder={`Enter the sales count of ${data.name}`}
                          type="number"
                          onChange={(e) => {
                            handleChange(data.id, "beverages", e.target.value);
                          }}
                        />
                      </td>
                    );
                  })}
                {/*-----------------------------------------------------beverages Total------------------------------- ---------------------------- */}
                <td>
                  <Form.Control
                    readOnly
                    className=""
                    value={channels
                      .filter((data) => data.active === true)
                      .reduce((acc, channel) => {
                        return (
                          acc +
                          (channel.beverages
                            ? parseFloat(channel.beverages)
                            : 0)
                        );
                      }, 0)}
                  />
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    backgroundColor: "#14213d",
                    color: "white",
                    paddingTop: "1rem",
                  }}
                  className=" align-items-center">
                  Units
                </td>
                {/*-----------------------------------------------------channels Total------------------------------- ---------------------------- */}
                {channels
                  .filter((data) => data.active === true)
                  .map((data) => {
                    return (
                      <td key={data.id}>
                        <Form.Control
                          readOnly
                          className=""
                          value={isNaN(Number(data.food) + isNaN(Number(data.beverages))) ? 0 : Number(data.food) + Number(data.beverages)} />
                      </td>
                    );
                  })}
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Form>
      ) : (
        // <Alert variant='danger'>
        // Please select atleast one channel</Alert>
        <Row className="text-center">
          <Col></Col>
          <Col lg={6}>
            <h5 className="mt-5 error-messagee w-100">
              
              <span className="px-5">Please select at least one channel</span>
            
            </h5>
          </Col>
          <Col></Col>
        </Row>
      )}

      <Row
        className="text-center pt-2"
        style={{
          display: isAnyChannelActive() ? "block" : "none",
        }}>
        <Col></Col>
        <Col className="text-center">
          {DataChange && (
            <button
              onClick={() => {
                sendDataToBackend();
              }}
              className="btn text-white my-2 saveButton p-2 fw-bolder "
              style={{ backgroundColor: "#fca311" }}>
              <i className="fa-regular fa-floppy-disk"></i>{" "}
              <span className="mx-2">Save</span>
            </button>
          )}
          <ToastContainer />
        </Col>
        <Col></Col>
      </Row>

      <div
        className=" d-flex justify-content-between "
        style={{ marginTop: "50px" }}>
        <Link to="/dashboard/sales/channeltype">
          <Button
            className=" border-0 "
            style={{ width: "6rem", backgroundColor: "rgb(252, 163, 17)" }}>
            {" "}
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ color: "#ffffff" }}
            />{" "}
            Back{" "}
          </Button>
        </Link>
        <Link to="/dashboard/sales/salesbymenu">
          <Button
            className="float-end btn btn-warning text-white"
            type="submit"
            style={{ width: "6rem", backgroundColor: "#fca311" }}>
            Next{" "}
            <FontAwesomeIcon icon={faArrowRight} style={{ color: "#ffffff" }} />{" "}
          </Button>
        </Link>
      </div>
    </>
  );
};

export default SalesByChannel;


