import React, { useState, useEffect, useContext } from "react";
import { Col, ListGroup, Row, Table, Modal, Button, Card, Form, Container, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LaboursContext from "./LaboursContext";
import ReactPaginate from "react-paginate";
import ContentLoader from "react-content-loader";

import SearchImage from '/assets/line-chart.gif'
import './labour.css'
import 'chartjs-plugin-datalabels';
import { ResponsivePie } from '@nivo/pie';
import { UserContext } from "../../../Context/UserContext";
import Nodata from '/assets/No data.gif'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Outlet } from "react-router-dom";

function Labour() {
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


return(

<>
         
          <div className=" ">
            <span className="fs-3 mx-3">Calendar</span>
            <p className="fs-5 mx-3 mt-2">Manage your HR duties.</p>
          </div>

          <div className="mt-5">
          
           <Row>
            <Col lg={3}></Col>
            <Col lg={3} className="text-end mx-4">
              2023
              </Col>
            </Row>

            <Row className="mt-3">
              <Col lg={3} className="mx-3"><button className="btn" onClick={handleShow}><i className="fa-solid fs-3 fa-bars"></i></button></Col>
              <Col lg={3} className="text-end">
                <p>28 Nov</p>
                <p>Wednesday</p>
              </Col>
            </Row>
        
           <Row>
            <Col lg={6} className="mx-4 ">
            <Table bordered striped className="text-center">
              <tbody>
                <tr>
                <th className="mt-2 bg-black text-white">SU</th>
                <td></td>
                <td>4</td>
                <td>11</td>
                <td>18</td>
                <td>25</td>
                </tr>

                <tr>
                <th className="mt-2 bg-black text-white">MO</th>
                <td></td>
                <td>5</td>
                <td>12</td>
                <td>19</td>
                <td>26</td>
                </tr>

                <tr>
                <th className="mt-2 bg-black text-white">TU</th>
                <td></td>
                <td>6</td>
                <td>13</td>
                <td>20</td>
                <td>27</td>
                </tr>

                <tr>
                <th className="mt-2 bg-black text-white">WE</th>
                <td></td>
                <td>7</td>
                <td>14</td>
                <td>21</td>
                <td>28</td>
                </tr>

                <tr>
                <th className="mt-2 bg-black text-white">TH</th>
                <td>1</td>
                <td>8</td>
                <td>15</td>
                <td>22</td>
                <td>29</td>
                </tr>


                <tr>
                <th className="mt-2 bg-black text-white">FR</th>
                <td>2</td>
                <td>9</td>
                <td>16</td>
                <td>23</td>
                <td>30</td>
                </tr>

                <tr>
                <th className="mt-2 bg-black text-white">SA</th>
                <td>3</td>
                <td>10</td>
                <td>17</td>
                <td>24</td>
                <td></td>
                </tr>

               
              </tbody>
            </Table>
            </Col>

           
            </Row>

          </div>
          <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton className="">
          <Offcanvas.Title className="fs-3">Labour menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex justify-content-center">
          <div className="d-flex flex-column"><Link to='setup' className="fs-4 btn">Setup</Link>
          <Link to='records' className="fs-4 btn">Records</Link>
          <Link to='apply' className="fs-4 btn">Apply</Link>
          <Link to='summary' className="fs-4 btn">Summary</Link></div>
        </Offcanvas.Body>
      </Offcanvas>

          </>
  );
}

export default Labour;
