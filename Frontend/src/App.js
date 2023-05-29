import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login/Login'
import TblShipmentReceivingCl from './pages/TblShipmentReceivingCl/TblShipmentRecevingCl'
// import TblShipmentReceivedCl from './pages/TblShipmentReceivedCl/TblShipmentReceivedCl'
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
import TblPickingCl from './pages/TblPickingCl/TblPickingCl'
import AddPickingList from './components/AddNew/AddPickingList'
import TblPickingListUpdates from './components/UpdatesItem/TblPickingListUpdates'
import MappedItems from './pages/MappedItems/MappedItems'
import AddMappedBarcodes from './components/AddNew/AddMappedBarcodes'
import TblMappedBarCodeUpdate from './components/UpdatesItem/TblMappedBarCodeUpdate'
import ShipmentPalletizingCl from './pages/ShipmentPalletizingCl/ShipmentPalletizingCl'
import AddNewPalletizing from './components/AddNew/AddNewPalletizing'
import TblUpdatePalletizing from './components/UpdatesItem/TblUpdatePalletizing'
import ReceiptsManagement from './pages/ReceiptsManagement/ReceiptsManagement'
import ReceiptsSecond from './pages/ReceiptsManagement/ReceiptsSecond'
import ReceiptsThirdScreen from './pages/ReceiptsManagement/ReceiptsThirdScreen'
import { ReceiptsProvider } from './contexts/ReceiptsContext'
import TblShipmentReceivedCl from './pages/TblShipmentReceivedCl/TblShipmentReceivedCl'
import TblShipmentUpdate from './components/UpdatesItem/TblShipmentUpdate'
import KPIDashboardReceiving from './pages/KPIDashboardReceiving/KPIDashboardReceiving'
// import PutAway from './pages/Put-Away/PutAway'
// import TransferID from './pages/Put-Away/TransferID'
import PutAwayScreen1 from './pages/Palletization/PutAwayScreen1'
import PutAwayScreen2 from './pages/Palletization/PuAwayScreen2'
import PutAwayScreen3 from './pages/Palletization/PutAwayScreen3'
import PutAwayLastScreen from './pages/Put-Away/PutAwayLastScreen'
import BinToBinInternal from './pages/BinToBinInternal/BinToBinInternal'
import BinToBinJournalID from './pages/BinToBinJournalID/BinToBinJournalID'
import TransferID from './pages/TransferID/TransferID'
import TransferIDPage from './pages/TransferID/TransferIDPage1'
import ItemReAllocation from './pages/Item-Re-Allocation/ItemReAllocation'
import BinToBinJournalSaveScreen from './pages/BinToBinJournalID/BinToBinJournalSaveScreen'
import ReallocationPicked from './pages/RealloactionPicked/ReallocationPicked'
import BinToBinCL from './pages/BinToBinCL/BinToBinCL'
import JournalList from './pages/JournalList/JournalList'
import PicklistAssigned from './pages/PicklistAssigned/PicklistAssigned'
import Pickinglistform from './pages/PicklistAssigned/PickingListForm'
import PickingListLastForm from './pages/PicklistAssigned/PickingListLastForm'
import DispatchingPickingSlip from './pages/DispatchingPickingSlip/DispatchingPickingSlip'
import SalesPickingList from './pages/SalesPickingList/SalesPickingList'
import Registration from './pages/UserRegistration/UserRegistration'
import ReturnRMA from './pages/WmsReturnRMA/ReturnRMA'
import ReturnRMALast from './pages/WmsReturnRMA/ReturnRMALast'
import ReturnSalesOrder from './pages/ReturnSalesOrder/ReturnSalesOrder'
import JournalProfitLost from './pages/JournalProfitLost/JournalProfitLost'
import JournalMovement from './pages/JournalMovement/JournalMovement'
import JournalCounting from './pages/JournalCounting/JournalCounting'
import WmsProfitLoss from './pages/WmsProfitLoss/WmsProfitLoss'
import WmsProfitLossLast from './pages/WmsProfitLoss/WmsProfitLossLast'
import WmsCycleCounting from './pages/WmsCycleCounting/WmsCycleCounting'
import WmsCycleCountingLast from './pages/WmsCycleCounting/WmsCycleCountingLast'
import RmaPutAway from './pages/RmaPutAway/RmaPutAway'
import WarehouseMovement from './pages/WarehouseMovement/WarehouseMovement'
import JournalMovementFirst from './pages/WmsJournalMovement/JournalMovementFirst'
import JournalMovementLast from './pages/WmsJournalMovement/JournalMovementLast'
import WarehouseJournalProfitLoss from './pages/WarehouseJournalProfitLoss/WarehouseJournalProfitLoss'
import WarehouseJournalCounting from './pages/WarehouseJournalCounting/WarehouseJournalCounting'
import WarehouseReturnSalesOrder from './pages/WarehouseReturnSalesOrder/WarehouseReturnSalesOrder'
import WmsInventory from './pages/WmsInventory/WmsInventory'
import WarehouseWmsInventory from './pages/WarehouseWmsInventory/WarehouseWmsInventory'
import WmsPhysicalInventory from './pages/WmsPhysicalInventory/WmsPhysicalInventory'

const WithoutSideBarLayout = ({ children }) => {
  return { children };
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

        <Route path="/" element={<Login />} />
        <Route path='/registration' element={<Registration />} />

        <Route path="/receipts" element={<ReceiptsProvider><ReceiptsManagement /></ReceiptsProvider>} />
        <Route path="/receiptsecond" element={<ReceiptsProvider><ReceiptsSecond /></ReceiptsProvider>} />
        <Route path="/receiptsthird" element={<ReceiptsProvider><ReceiptsThirdScreen /></ReceiptsProvider>} />
        {/* <Route path='/putaway' element={<PutAway />}/> */}
        <Route path='/transferpage1' element={<TransferIDPage />} />
        <Route path='/transferid' element={<TransferID />} />
        <Route path="/palletscreen1" element={<PutAwayScreen1 />} />
        <Route path="/palletscreen2" element={<PutAwayScreen2 />} />
        <Route path="/palletscreen3" element={<PutAwayScreen3 />} />
        <Route path="/putaway" element={<PutAwayLastScreen />} />

        <Route path="/bintobin" element={<BinToBinInternal />} />
        <Route path="/bintobin2" element={<BinToBinJournalID />} />
        <Route path="/bintobinsave" element={<BinToBinJournalSaveScreen />} />
        <Route path="/itemallocation" element={<ItemReAllocation />} />

        <Route path="/pickinglistfrom" element={<Pickinglistform />} />
        <Route path="/pickinglistlast" element={<PickingListLastForm />} />

        <Route path="/dispatchingslip" element={<DispatchingPickingSlip />} />

        <Route path='/rma' element={<ReturnRMA />} />
        <Route path="/rmalastform" element={<ReturnRMALast />} />

        <Route path='/journalfirst' element={<JournalMovementFirst />} />
        <Route path='/journallast' element={<JournalMovementLast />} />


        <Route path='/profitloss' element={<WmsProfitLoss />} />
        <Route path='/profitlosslast' element={<WmsProfitLossLast />} />

        <Route path='/cyclecounting' element={<WmsCycleCounting />} />
        <Route path='/cyclecountinglast' element={<WmsCycleCountingLast />} />

        <Route path='/rmaputaway' element={<RmaPutAway />} />

        <Route path='/wmsinventory' element={<WmsInventory />} />

        <Route path='/wmsphysical' element={<WmsPhysicalInventory />} />


        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path='/shipment' element={<TblShipmentReceivingCl />} />
                <Route path='/shipmentid' element={<ShipmentRecevingId />} />
                <Route path='/shipmentreceived' element={<TblShipmentReceivedCl />} />
                <Route path='/shipmentupdate/:id' element={<TblShipmentUpdate title="Update Shipment Received Data" />} />

                <Route path='/items' element={<TblItem />} />
                <Route path='/itemscl' element={<TblItemCl />} />
                <Route path='/addnew' element={<AddNew title="Add New Shipment Receving Details" />} />
                {/* <Route path='/update' element={<UpdateData title="Update Shipment Receiving Data" />} /> */}
                <Route path='/update/:id' element={<UpdateData title="Update Row Shipment Receiving Data" />} />
                <Route path='/itemsnew' element={<AllItemsAddNew title="Add New Items" />} />
                <Route path='/allitems/:id' element={<UpdateAllItems title="Update All Items" />} />
                <Route path='/dashboard' element={<ReceiptsProvider><MainDashboard /> </ReceiptsProvider>} />
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
                <Route path='/pickingcl' element={<TblPickingCl />} />
                <Route path='/tbl-new-picking' element={<AddPickingList title="New Picking List" />} />
                <Route path='/tblpickingupdates/:id' element={<TblPickingListUpdates title="New Picking List Updates" />} />
                <Route path='/mappeditems' element={<MappedItems />} />
                <Route path='/insert-mapped-barcode' element={<AddMappedBarcodes />} />

                <Route path='/tblmappedbarcodesupdates/:id' element={<TblMappedBarCodeUpdate />} />
                <Route path='/shipmentpalletizing' element={<ShipmentPalletizingCl />} />
                <Route path='/addnewpalletizing' element={<AddNewPalletizing title="Add Palletizing" />} />
                <Route path='/updatepalletizing/:id' element={<TblUpdatePalletizing title="Update Palletizing Data" />} />
                {/* <Route path='/receipts' element={<ReceiptsManagement />} />
                <Route path='/receiptsecond' element={<ReceiptsSecond />} /> */}

                <Route path='/addnewpalletizing' element={<AddNewPalletizing title="Add Palletizing" />} />
                <Route path='/updatepalletizing/:id' element={<TblUpdatePalletizing title="Update Palletizing Data" />} />

                <Route path='/kpireceiving' element={<KPIDashboardReceiving />} />
                <Route path='/reallocation' element={<ReallocationPicked />} />
                <Route path='/bintobincl' element={<BinToBinCL />} />
                <Route path='/journallist' element={<JournalList />} />

                <Route path='/Picklistassign' element={<PicklistAssigned />} />

                <Route path='/pickingsales' element={<SalesPickingList />} />

                <Route path='/returnsales' element={<ReturnSalesOrder />} />
                <Route path='/journalprofit' element={<JournalProfitLost />} />
                <Route path='/journalmovement' element={<JournalMovement />} />
                <Route path='/journalcounting' element={<JournalCounting />} />
                <Route path='/warehousereturn' element={<WarehouseReturnSalesOrder />} />

                <Route path='/warehousemovement' element={<WarehouseMovement />} />
                
                <Route path='/warehouseprofitloss' element={<WarehouseJournalProfitLoss />} />

                <Route path='/warehousecounting' element={<WarehouseJournalCounting />} />

                <Route path='/warehouseinventory' element={<WarehouseWmsInventory />} />
                




              </Routes>
            </MainLayout>
          } />
      </Routes>

    </BrowserRouter>
  )
}


export default App