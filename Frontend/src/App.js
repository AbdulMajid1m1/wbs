import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login/Login'
import TblShipmentReceving from './pages/TblShipmentRecevingCl/TblShipmentRecevingCl'
import TblShipmentReceiveCl from './pages/TblShipmentReceiveCl/TblShipmentReceiveCl'
import TblItem from './pages/TblItem/TblItem'
// import NavBar from './components/NavBar/Navbar'
import ShipmentRecevingId from './pages/ShipmentRecevingId/ShipmentRecevingId'
import AddNew from './components/AddNew/AddNew'
import UpdateData from './components/UpdatesItem/UpdateData'
import AllItemsAddNew from './components/AddNew/AllItemsAddNew'
import UpdateAllItems from './components/UpdatesItem/UpdateAllItems'
import MainDashboard from './components/MainDashboard/MainDashboard'
import SideBar2 from './components/SideBar/SideBar2'

import TblAllLocations from './pages/TblAllLocations/TblAllLocations'
import TblLocationsUpdates from './components/UpdatesItem/TblLocationsUpdates'
import AddNewTblLocations from './components/AddNew/AddNewTblLocations'
import TblDispatchingCL from './pages/TblDispatching/TblDispatchingCL'
import TblDispatchingUpdates from './components/UpdatesItem/TblDispatchingUpdates'
import "./App.css"
import PackingSlip from './pages/PackingSlip/PackingSlip'
import AllItemsDispatch from './pages/AllItemsDispatch/AllItemsDispatch'
import InternalTransfer from './pages/InternalTransfer/InternalTransfer'
import ExpectedReceipts from './pages/ExpectedReceipts/ExpectedReceipts'
import ExpectedTranferOrder from './pages/ExtectedTransferOrder/ExpectedTranferOrder'
import PickList from './pages/PickList/PickList'
import TblItemCl from './pages/TblItemCl/TblItemCl'
import AddDispatchingCl from './components/AddNew/AddDispatchingCl'
import FigmaSidebar from './components/SideBar/FigmaSidebar'
import ExpectedShipments from './pages/ExpectedShipments/ExpectedShipments'

const LoginLayout = ({ children }) => {
  return <>{children}</>;
};

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout-container">
      <span className="left-layout">
        {/* <SideBar2 /> */}
        <FigmaSidebar />
      </span>
      <span className="right-layout">{children}</span>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      {/* <NavBar /> */}

      <Routes>
        <Route path='/' element={
          <LoginLayout>
            <Login />
          </LoginLayout>

        } />

        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path='/shipment' element={<TblShipmentReceving />} />
                <Route path='/shipmentid' element={<ShipmentRecevingId />} />
                <Route path='/shipmentcl' element={<TblShipmentReceiveCl />} />
                <Route path='/items' element={<TblItem />} />
                <Route path='/itemscl' element={<TblItemCl />} />
                <Route path='/addnew' element={<AddNew title="Add New Shipment Receving Details" />} />
                {/* <Route path='/update' element={<UpdateData title="Update Shipment Receiving Data" />} /> */}
                <Route path='/update/:id' element={<UpdateData title="Update Row Shipment Receiving Data" />} />
                <Route path='/itemsnew' element={<AllItemsAddNew title="Add New Items" />} />
                <Route path='/allitems/:id' element={<UpdateAllItems title="Update All Items" />} />
                <Route path='/dashboard' element={<MainDashboard />} />
                <Route path='/tblLocation' element={<TblAllLocations />} />
                <Route path='/tblLocationupdate/:id' element={<TblLocationsUpdates title="Updates All Tbl Locations" />} />
                <Route path='/tbl-new-location' element={<AddNewTblLocations title="Add Tbl Locations" />} />
                <Route path='/tbldispatching' element={<TblDispatchingCL />} />
                <Route path='/tbldispatchingupdates/:id' element={<TblDispatchingUpdates title="All Dispatching Updates" />} />
                <Route path='/tbl-new-dispatch' element={<AddDispatchingCl title="Add Tbl New Dispatch" />} />
                <Route path='/packingslip' element={<PackingSlip />} />
                <Route path='/alldispatch' element={<AllItemsDispatch />} />
                <Route path='/internal' element={<InternalTransfer />} />
                <Route path='/expectedreceipts' element={<ExpectedReceipts />} />
                <Route path='/expectedorder' element={<ExpectedTranferOrder />} />
                <Route path='/picklist' element={<PickList />} />
                <Route path='/expectedshipments' element={<ExpectedShipments />} />
              </Routes>
            </MainLayout>
          } />
      </Routes>

    </BrowserRouter>
  )
}


export default App