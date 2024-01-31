import React, { useContext } from 'react'
import { Container } from 'react-bootstrap'
import IngredientsHeader from './IngredientsHeader'
import { Outlet } from 'react-router-dom'

const IngredientsLayout = () => {

  return (
    <>
    <Container fluid>
        <IngredientsHeader/>

        <Outlet/>
    </Container>
    </>
  )
}

export default IngredientsLayout