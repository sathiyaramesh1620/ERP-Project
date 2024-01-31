import axios from "axios";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import { Accordion, Button } from "react-bootstrap";
import PurchaseItemList from "./PurchaseItemList";

const PurchaseItem = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [stocks, setStocks] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  // const [showSelectIngredients, setShowSelectIngredients] = useState(false);

  useEffect(() => {
    axios
      .post("/Marie-ERP/api/stocks/selectingStock", {
        userId: user.userId,
      })
      .then((res) => {
        setStocks(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    setSelectedStock(null)
  }, [id])

  return (
    <div>

      <Accordion className="my-1">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
          <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a >Purchase</a>
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
            {stocks.selectedData?.filter((data) => data.category === id)
              .length > 0
              ? stocks.selectedData
                  .filter((data) => data.category === id)
                  .map((data, i) => {
                    if (i === 0) {
                      return (
                        <div key={i}>
                          {data.ingredients?.map((idata, i) => {
                            // i === 0 ? selectedStock(idata) : null
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
              : "no data"}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <PurchaseItemList item={selectedStock} category={id} />
    </div>
  );
};

export default PurchaseItem;
