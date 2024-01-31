import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Table, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../Context/UserContext";
import { LaboursDataContext } from "./LaboursContext";

function LabourRecords() {
  const { user } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    await axios
      .post("/Marie-ERP/api/labourList", {
        userId: user.userId ? user.userId : 3,
      })
      .then((response) => {
        console.log("response : ", response);
        setList(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setList([])
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    axios
      .post("/Marie-ERP/api/fetchLabour", {
        userId: user.userId ? user.userId : 3,
        employeeId,
      })
      .then((response) => {
        console.log(response, "fetchlabour");
      })
      .catch((error) => console.log(error));
  }, [employeeId]);

  const handleEdit = (e_id) => {
    console.log(e_id, "Edit employee");
    navigate(`e/${e_id}`);
  };

const handleDelete = async (e_id, name) => {
  const userConfirmed = window.confirm(
    `Are you sure you want to delete this ' ${name} ' labour?`
  );
  if (userConfirmed) {
    try {
      const response = await axios.post("/Marie-ERP/api/deleteLabour", {
        userId: user.userId ? user.userId : 2,
        employeeId: e_id,
      });

      if (response.data.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  }
};


  return (
    <>
      <div>
        <p className="fs-3">Records</p>
      </div>
      <p>Manage recordkeeping for your F&B workers.</p>

      <Row>
        <Col></Col>
        <Col className="text-end">
          <Link to="c" className="btn btn-warning text-white">
            Add a name
          </Link>
        </Col>
      </Row>

      <Row className="mx-2">
      {loading ? (
        <div className="d-flex justify-content-center ">
              <Spinner animation="border" variant="warning" role="status" />
             
            <span className="mx-3 mt-1"><b>Marie-ERP</b></span>
            </div>) : (<>
        {list.length === 0 ? (<h4>Please create labour!</h4>) : (<>
        <Table bordered className="mt-3">
          <thead>
            <th
              className="px-3 border p-2 text-white"
              style={{ width: "10%", backgroundColor: "#002161" }}>
              No
            </th>
            <th
              className="px-3 border p-2 text-white"
              style={{ width: "40%", backgroundColor: "#002161" }}>
              Name
            </th>
            <th
              className="px-3 border p-2 text-white"
              style={{ width: "50%", backgroundColor: "#002161" }}>
              Action
            </th>
          </thead>
          <tbody>  
              {list?.map((item, index) => (
                <tr key={item.e_id}>
                  <td
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ccd5ea" : "#e8eaf4",
                    }}
                    className="px-3 pt-3">
                    {index + 1}
                  </td>
                  <td
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ccd5ea" : "#e8eaf4",
                    }}
                    className="px-3 pt-3">
                    {item.name}
                  </td>
                  <td
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ccd5ea" : "#e8eaf4",
                    }}>
                    <button
                      className="btn"
                      onClick={() => navigate(`traceable/${item.e_id}`)}>
                      {" "}
                      <i className="fa-solid fa-money-check-dollar"></i>
                    </button>
                    <button
                      className="btn"
                      onClick={() => navigate(`restDays/${item.e_id}`)}>
                      <i className="fa-solid fa-bed"></i>
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        handleEdit(item.e_id);
                        setEmployeeId(item.e_id);
                      }}>
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(item.e_id, item.name)}>
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </td>
                </tr>))}
              
            
          </tbody>
        </Table>
        </>)}
        </>)}
      </Row>
    </>
  );
}

export default LabourRecords;
