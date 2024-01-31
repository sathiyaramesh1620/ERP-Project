import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Table, Alert, Modal } from "react-bootstrap";
import { ExcelRenderer } from "react-excel-renderer";
import { UserContext } from "../../Context/UserContext";

const SalesFileImport = ({ month, callEffect }) => {
  console.log(month, "month **********");
  const { user } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [error, setError] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [messege, setMessege] = useState("");
  const handleFile = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = [".xls", ".xlsx", ".csv"];
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError("Invalid file format. Please upload an Excel or CSV file.");
      return;
    }

    ExcelRenderer(file, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        if (res.rows[0].length !== 4) {
          setError("Invalid file format. Excel file must have exactly four columns.");
          return;
        }

        const headerMapping = {
          "Item No": "id",
          Category: "Category",
          "Item Name": "Item",
          "Total Unit Sales Volume": "TableUnits",
        };

        // Filter out the header row and transform the data
        const transformedData = res.rows.slice(1).map((row) =>
          row.reduce((obj, value, index) => {
            const header = res.rows[0][index];
            obj[headerMapping[header]] = value;
            return obj;
          }, {})
        );

        // Check for empty values
        const hasEmptyValues = transformedData.some((item) =>
          Object.values(item).some(
            (value) => value === "" || value === null || value === undefined
          )
        );

        if (hasEmptyValues) {
          setError("Warning: The imported data contains empty values.");
        } else {
          setImportedData(transformedData);
          setError("");
        }
      }
    });
  };

  const handleCellEdit = (e, field, index) => {
    const value = e.target.value;
    const updatedData = [...importedData];
    updatedData[index][field] = value;
    setImportedData(updatedData);
  };

  const handleEditClick = (index) => {
    setSelectedRowIndex(index);
  };

  const handleDeleteClick = (index) => {
    const updatedData = importedData.filter((_, i) => i !== index);
    setImportedData(updatedData);
  };

  const hasEmptyValues = (row) => {
    return Object.values(row).some(
      (value) => value === "" || value === null || value === undefined
    );
  };

  console.log(importedData);
  const handleSubmit = () => {
    axios
      .post("/Marie-ERP/api/salesmenu_insert", {
        data: [...importedData],
        month: month,
        userId: user.userId ? user.userId : "555",
      })
      .then((res) => {
        console.log(res);
        if (res.data.status === 200) {
          setMessege(res.data.message + " Saved successful");
          setTimeout(() => {
            setShow(false);
            setMessege("");
          }, 3000);
        } else {
          setMessege("Failed to upload");
          setTimeout(() => {
            setMessege("");
          }, 3000);
        }
      })
      .catch((err) => {
        setMessege(err.message + ", Failed to upload");
        console.log(err.message);
        setTimeout(() => {
          setMessege("");
        }, 3000);
      })
      .finally(() => {
        callEffect(Math.random());
      });
  };

  useEffect(() => {
    setMessege("");
  }, []);

  const handledowload = () => {
    
  }
  return (
    <>
      
      
      <h6>
        <Button className="btn btn-warning " onClick={() => setShow(!show)}>
          Import
        </Button>{" "}
        Upload file for bulk sales data{" "}
      </h6>
      <p onClick={() => {handledowload}}>
        Sample file <i class="bi bi-arrow-bar-up"></i>
      </p>
      {show && (
        <div className="sales-file-import">
          <Alert variant="info" className="my-3">
            Please review the imported data before save. click the "Save" button.
          </Alert>

          <Form.Control
            type="file"
            size="sm"
            accept=".xls, .xlsx, .csv"
            onChange={handleFile}
            className="my-3"
          />
          
          {error && <Alert variant="warning">{error}</Alert>}
          {messege && (
            <Alert
              variant={messege === "Success Saved successful" ? "success" : "warning"}>
              {messege}
            </Alert>
          )}

          {/* {importedData.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Category</th>
                  <th>Items</th>
                  <th>Total units</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {importedData.map((item, index) => (
                  <tr key={index} className={hasEmptyValues(item) ? 'table-warning' : ''}>
                    <td>{item.id}</td>
                    <td>
                      {selectedRowIndex === index ? (
                        <Form.Control
                          type='text'
                          value={item.Category}
                          onChange={(e) => handleCellEdit(e, 'Category', index)}
                        />
                      ) : (
                        item.Category
                      )}
                    </td>
                    <td>
                      {selectedRowIndex === index ? (
                        <Form.Control
                          type='text'
                          value={item.Items}
                          onChange={(e) => handleCellEdit(e, 'Items', index)}
                        />
                      ) : (
                        item.Items
                      )}
                    </td>
                    <td>
                      {selectedRowIndex === index ? (
                        <Form.Control
                          type='number'
                          value={item.TableUnits}
                          onChange={(e) => handleCellEdit(e, 'TableUnits', index)}
                        />
                      ) : (
                        item.TableUnits
                      )}
                    </td>
                    <td className='d-flex justify-content-between'>
                      {selectedRowIndex === index ? (
                        <Button variant='success' size='sm' onClick={() => setSelectedRowIndex(null)}>
                          Save
                        </Button>
                      ) : (
                        <Button variant='success' size='sm' onClick={() => handleEditClick(index)}>
                          Edit
                        </Button>
                      )}
                      <Button variant='danger' size='sm' className='' onClick={() => handleDeleteClick(index)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No data to display.</p>
          )} */}
          <div className="d-flex justify-content-between">
            <Button onClick={() => setShow(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={importedData.length > 0 ? false : true}>
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SalesFileImport;
