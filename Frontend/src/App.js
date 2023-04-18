import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './pages/Login'
import TblShipmentReceving from './pages/TblShipmentReceving'
import TblShipmentReceiveCl from './pages/TblShipmentReceiveCl'

const App = () => {
  return (
    <div>
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<Login />}/>
              <Route path='/shipment' element={<TblShipmentReceving />}/>
              <Route path='/shipmentcl' element={<TblShipmentReceiveCl />}/>
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App