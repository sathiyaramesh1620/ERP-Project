import React from 'react'
import './Home.css'
import { Row, Col, Card,Container } from 'react-bootstrap'

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Profit & Expenditure in (%)',
    },
  },
}

const data ={
  labels : ['January', 'Feb', 'Mar', 'Apr'],
  datasets : [
    {
      label : 'Profit',
      data : [20, 15, 25, 40],
      backgroundColor : '#14213D',
    },
    {
      label : 'Expenditure',
      data : [10, 10, 16, 15],
      backgroundColor : '#fca311',
    }
  ]
}

const Options1 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Total Product Sales',
    },
  },
}


const Donut = {
  labels: ['Briyani', 'Fish Meals', 'Chicken Lollipop', 'Mutton Gravy', 'Idly', 'Dosa'],
  datasets: [
    {
      label: 'Total Product Sale',
      data: [40, 20, 10, 15, 8, 7],
      backgroundColor: [
        '#14213D',
        '#fca311',
        '#E5E5E5',
        '#000000',
        'rgb(248, 233, 93)',
        'rgb(248, 207, 93)',
      ],
      borderColor: [
        '#14213D',
        '#fca311',
        '#E5E5E5',
        '#000000',
        'rgb(248, 233, 93)',
        'rgb(248, 207, 93)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function Home(){
  return (
    <>
      <Container fluid>
        <div >
      <div>
        <Row>
          <Col>
            <Card body className='border-0 shadow'><Bar options={options} data={data} /></Card>
            <Card body className='mt-4 border-0 shadow'><Line options={options} data={data} /></Card>
            </Col>
          <Col className='shadow'><Doughnut  options={Options1} data={Donut} /></Col>
        </Row>

        <Row>
          <Col className='pt-4'></Col>
          <Col className='pt-4'></Col>
        </Row>
        </div>
    </div>
        {/* <div className='d-flex '>
        <div className="mainDiv m-4 mx-2" style={{height: '400px'}}>
          <div className="subDiv"></div>
          <p
            className="text-center fw-bold text-secondary"
            style={{ marginTop: "420px" }}>
            Ja
          </p>
        </div>

        <div className="mainDiv mx-2" style={{height: '300px', marginTop : '125px'}}>
          <div className="subDiv"></div>
          <p
            className="text-center fw-bold text-secondary"
            style={{ marginTop: "320px" }}>
            Fe
          </p>
        </div>

        <div className="mainDiv mx-2" style={{height: '350px',  marginTop : '75px'}}>
          <div className="subDiv"></div>
          <p
            className="text-center fw-bold text-secondary"
            style={{ marginTop: "373px" }}>
            Ma
          </p>
        </div>

        <div className="mainDiv mx-2" style={{height: '420px',  marginTop : '6px'}}>
          <div className="subDiv"></div>
          <p
            className="text-center fw-bold text-secondary"
            style={{ marginTop: "445px" }}>
            Ap
          </p>
        </div>

        <div className="mainDiv mx-2" style={{height: '400px',  marginTop : '26px'}}>
          <div className="subDiv"></div>
          <p
            className="text-center fw-bold text-secondary"
            style={{ marginTop: "425px" }}>
            May
          </p>
        </div>

        </div> */}

       
      </Container>
    </>
  );
}