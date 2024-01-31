import axios from "axios";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import StockCount from "./StockCount";
import { Accordion } from "react-bootstrap";

const StockItem = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "/Marie-ERP/api/stocks/selectingStock",
          {
            userId: user.userId ? user.userId : 3,
          }
        );
        setStocks(response.data.selectedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedStock(null);
  }, [id]);

  return (
    <div>
     

      {loading ? (
        <p>Loading...</p>
      ) : stocks.length > 0 ? (
        <Accordion className="my-1">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
            <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a >stock</a>
            </li>
            <li class="breadcrumb-item">
              <a >{id}</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
            {selectedStock ? (
              <>
              <div className=" d-flex flex-row ">
              <div className="fw-bold text-warning">
                {selectedStock.ingredient}{" "}
                {selectedStock.subtype === "-" ? null : `(${selectedStock.subtype})`}
              </div>
              <div className=" text-secondary mx-3">
                {selectedStock.measurements} | {selectedStock.purchase_cycle}
              </div>
            </div>
                  
              </>
            ) : (
              <> </>
            )}
            </li>
          </ol>
        </nav>
           
            </Accordion.Header>
            <Accordion.Body>
              {stocks ? 
                stocks?.filter((data) => data.category === id)
                .map((data, i) => {
                  if (i === 0) {
                    return (
                      <div key={i} className="d-flex flex-row flex-wrap">
                        {data.ingredients?.map((idata, j) => {
                          return (
                            <button
                                key={i}
                                className={
                                  idata === selectedStock
                                    ? "shadow-sm border border-warning text-warning m-1 btn"
                                    : "btn border m-1"
                                }
                                onClick={() => setSelectedStock(idata)}>
                                {idata.ingredient}{" "}
                                {idata.subtype !== "-"
                                  ? `(${idata.subtype})`
                                  : null}
                              </button>
                          );
                        })}
                      </div>
                    );
                  }
                })
              : <>No data</>
              }
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : (
        "No data"
      )}

      {selectedStock ? (
        <StockCount idata={selectedStock} category={id} userId={user.userId} />
      ) : (
        <>
          <div className="text-center">Please select an item</div>
        </>
      )}
    </div>
  );
};

export default StockItem;
