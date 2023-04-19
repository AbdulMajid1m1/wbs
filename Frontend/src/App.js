import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import TblShipmentReceving from './pages/TblShipmentReceving'
import TblShipmentReceiveCl from './pages/TblShipmentReceiveCl'
import TblItem from './pages/TblItem'
import NavBar from './components/NavBar/Navbar'
import ShipmentRecevingId from './pages/ShipmentRecevingId'


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/shipment' element={<TblShipmentReceving />} />
          <Route path='/shipmentid' element={<ShipmentRecevingId />} />
          <Route path='/shipmentcl' element={<TblShipmentReceiveCl />} />
          <Route path='/items' element={<TblItem />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App