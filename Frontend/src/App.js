import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login/Login'
import TblShipmentReceving from './pages/TblShipmentReceving/TblShipmentReceving'
import TblShipmentReceiveCl from './pages/TblShipmentReceiveCl/TblShipmentReceiveCl'
import TblItem from './pages/TblItem/TblItem'
// import NavBar from './components/NavBar/Navbar'
import ShipmentRecevingId from './pages/ShipmentRecevingId/ShipmentRecevingId'
import AddNew from './components/AddNew/AddNew'
import UpdateData from './components/UpdatesItem/UpdateData'
import AllItemsAddNew from './components/AddNew/AllItemsAddNew'
import UpdateAllItems from './components/UpdatesItem/UpdateAllItems'
import MainDashboard from './components/MainDashboard/MainDashboard'
import TblAllLocations from './pages/TblAllLocations/TblAllLocations'
import TblLocationsUpdates from './components/UpdatesItem/TblLocationsUpdates'
import AddNewTblLocations from './components/AddNew/AddNewTblLocations'
import TblDispatchingCL from './pages/TblDispatching/TblDispatchingCL'
import TblDispatchingUpdates from './components/UpdatesItem/TblDispatchingUpdates'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        {/* <NavBar /> */}
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
          <Route path='/dashboard' element={<MainDashboard />} />
          <Route path='/tblLocation' element={<TblAllLocations />} />
          <Route path='/tblLocationupdate/:id' element={<TblLocationsUpdates title="Updates All Tbl Locations"/>} />
          <Route path='/tbl-new-location' element={<AddNewTblLocations title="Add Tbl Locations"/>} />
          <Route path='/tbldispatching' element={<TblDispatchingCL />} />
          <Route path='/tbldispatchingupdates/:id' element={<TblDispatchingUpdates title="All Dispatching Updates"/>} />

          {/* New Routes again*/}
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App