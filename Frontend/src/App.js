import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import TblShipmentReceving from './pages/TblShipmentReceving';
import TblShipmentReceiveCl from './pages/TblShipmentReceiveCl';
import TblItem from './pages/TblItem';
import ShipmentRecevingId from './pages/ShipmentRecevingId';
import AddNew from './components/AddNew/AddNew';
import UpdateData from './components/AddNew/UpdateData';
import AllItemsAddNew from './components/AddNew/AllItemsAddNew';
import UpdateAllItems from './components/AddNew/UpdateAllItems';
import MainDashboard from './components/MainDashboard/MainDashboard';
import SideBar2 from './components/SideBar/SideBar2';
import './App.css';

const LoginLayout = ({ children }) => {
  return <>{children}</>;
};

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout-container">
      <span className="left-layout">
        <SideBar2 />
      </span>
      <span className="right-layout">{children}</span>
    </div>
  );
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LoginLayout>
                <Login />
              </LoginLayout>
            }
          />
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/shipment" element={<TblShipmentReceving />} />
                  <Route path="/shipmentid" element={<ShipmentRecevingId />} />
                  <Route path="/shipmentcl" element={<TblShipmentReceiveCl />} />
                  <Route path="/items" element={<TblItem />} />
                  <Route
                    path="/addnew"
                    element={<AddNew title="Add New Shipment Receving Details" />}
                  />
                  <Route path="/update" element={<UpdateData title="Update Row Data" />} />
                  <Route
                    path="/update/:id"
                    element={<UpdateData title="Update Row Data" />}
                  />
                  <Route
                    path="/itemsnew"
                    element={<AllItemsAddNew title="Add New Items" />}
                  />
                  <Route
                    path="/allitems/:id"
                    element={<UpdateAllItems title="Update All Items" />}
                  />
                  <Route path="/dashboard" element={<MainDashboard />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
