import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import TblShipmentReceving from './pages/TblShipmentReceving'
import TblShipmentReceiveCl from './pages/TblShipmentReceiveCl'
import TblItem from './pages/TblItem'
import NavBar from './components/NavBar/Navbar'
import ShipmentRecevingId from './pages/ShipmentRecevingId'
import AddNew from './components/AddNew/AddNew'
import UpdateData from './components/AddNew/UpdateData'
import AllItemsAddNew from './components/AddNew/AllItemsAddNew'
import UpdateAllItems from './components/AddNew/UpdateAllItems'


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
          <Route path='/addnew' element={<AddNew title="Add New Shipment Receving Details"/>} />
          <Route path='/update' element={<UpdateData title="Update Row Data"/>} />
          <Route path='/update/:id' element={<UpdateData title="Update Row Data"/>} />
          <Route path='/itemsnew' element={<AllItemsAddNew title="Add New Items"/>} />
          <Route path='/allitems/:id' element={<UpdateAllItems title="Update All Items"/>} />
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App