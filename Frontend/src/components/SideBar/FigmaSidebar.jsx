import React, { useState } from 'react'
import "./FigmaSidebar.css"
import image from "../../images/image.png"
import inventory from "../../images/inventory.png"
import expected from "../../images/expected.png"
import shipment from "../../images/shipment.png"
import transfer from "../../images/transfer.png"
import items from "../../images/items.png"
import internal from "../../images/internal.png"
import picklist from "../../images/picklist.png"
import packing from "../../images/packing.png"
import setting from "../../images/setting.png"
import dispatch from "../../images/van.png"
import wms from "../../images/wms.png"
import receipts from "../../images/bill.png"
import stocking from "../../images/stocking.png"
import barcode from "../../images/barcode.png"
import productreturn from "../../images/return.png"
import movement from "../../images/movement.jpeg"
import profit from "../../images/profit.jpeg"
import cycle from "../../images/cycle.jpeg"
import exit from "../../images/exit.png"
import move from "../../images/Move.png"
import physical from "../../images/physical.png"
import truckdata from "../../images/truckdata.png"
import zonemaster from "../../images/zonemaster.png"
import binmaster from "../../images/binmaster.png"
import history from "../../images/history.png"
import printinglabel from "../../images/printinglabel.png"
import printing from "../../images/printing.png"
// Mobile icons
import wmspicking from "../../images/wmspicking.png"
import wmslogin from "../../images/wmslogin.png"
import wmsjournal from "../../images/wmsjournal.png"
import wmsallocation from "../../images/wmsallocation.png"
import wmsputaway from "../../images/wmsputaway.png"
import wmsinventory from "../../images/wmsinventory.png"
import wmslocation from "../../images/wmslocation.png"
import wmsbarcode from "../../images/wmsbarcode.png"
import wmspallet from "../../images/wmspallet.png"
import wmsdispatch from "../../images/wmsdispatch.png"
import wmsbintobin from "../../images/wmsbintobin.png"

import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import userRequest from '../../utils/userRequest'


const FigmaSidebar = () => {
    const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
    const [showMasterData, setShowMasterData] = useState(false);
    const [wmsMobileApp, setWmsMobileApp] = useState(false);
    const [kpiDashboard, setKpiDashbaord] = useState(false);


    const navigate = useNavigate();

    const handleLogout = () => {
        // Cookies.remove("accessToken")
        userRequest.post("/logout").then((response) => {
            console.log(response)
            navigate("/")
            localStorage.removeItem("currentUser");

        }).catch((error) => {
            console.log(error);
        }
        )
    }

    const storedUser = localStorage.getItem('currentUser');
    const initialUser = storedUser ? JSON.parse(storedUser) : {};


    return (
        <div className='main-sidebar'>

            <div className='main-images-container' onClick={() => navigate('/dashboard')}>
                <img src={packing} className='main-inside-image' alt='' />
                <p className='sidebar-text'>Dashboard</p>
            </div>

            <div className='main-images-container' onClick={() => setShowWarehouseDropdown(!showWarehouseDropdown)}>
                <img src={inventory} className='main-inside-image' alt='' />
                <p className='sidebar-text'>Warehouse Operation</p>
            </div>
            {showWarehouseDropdown && (
                <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                    <div className='main-images-container' onClick={() => navigate('/itemscl')}>
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Stock Master</p>
                    </div>

                    {/* <div className='main-images-container' onClick={() => navigate('/shipment')}>
                    <img src={expected} className='main-inside-image' alt='' />
                    <p className='sidebar-text'>Receiving</p>
               </div> */}

                    <div className='main-images-container' onClick={() => navigate('/shipmentreceived')}>
                        <img src={expected} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Shipment Received</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/tbldispatching')}>
                        <img src={shipment} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Dispatching</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/tblLocation')}>
                        <img src={transfer} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Warehouse Locations</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/warehousemovement')}>
                        <img src={picklist} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal Movement</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/warehouseprofitloss')}>
                        <img src={profit} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Journal ProfitLoss</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/warehousecounting')}>
                        <img src={cycle} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Journal Counting</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/warehousereturn')}>
                        <img src={inventory} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Return Sales Order</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/warehouseinventory')}>
                        <img src={profit} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Wms Inventory</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/printinglabels')}>
                        <img src={printinglabel} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Printing Pallet Labels</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/printingbarcode')}>
                        <img src={printing} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Printing Item Barcode</p>
                    </div>

                    <div className='main-images-container'>
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>PutAway</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/pickingcl')}>
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Picking</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/shipmentpalletizing')}>
                        <img src={picklist} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Pallets</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/mappeditems')}>
                        <img src={packing} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Mapped Items</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/reallocation')}>
                        <img src={stocking} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>1 Reallocation Picked</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/bintobincl')}>
                        <img src={dispatch} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>2  Bin To Bin CL</p>
                    </div>

                    {/* <div className='main-images-container' onClick={() => navigate('/Picklistassign')}>
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Picklist Assigned</p>
                    </div> */}

                    <div className='main-images-container' onClick={() => navigate('/pickingsales')}>
                        <img src={packing} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Pick List Assigned</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/truckdata')}>
                        <img src={truckdata} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Truck Master Data</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/zonemaster')}>
                        <img src={zonemaster} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Zone Master</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/binmaster')}>
                        <img src={binmaster} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Bin Master</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/transhistory')}>
                        <img src={history} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Transaction History</p>
                    </div>

                    <div className='main-images-container'>
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Physical Count</p>
                    </div>

                </div>
            )}
            <div className='main-images-container' onClick={() => setShowMasterData(!showMasterData)}>
                <img src={image} className='main-inside-image' alt='' />
                <p className='sidebar-text'>Master Data (Axapta)</p>
            </div>

            {showMasterData && (
                <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>

                    <div className='main-images-container' onClick={() => navigate('/items')}>
                        <img src={inventory} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Inventory Items</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/expectedreceipts')}>
                        <img src={expected} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Expected Receipts</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/expectedshipments')}>
                        <img src={shipment} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Expected Shipments</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/expectedorder')}>
                        <img src={transfer} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Expected Transfer Orders</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/alldispatch')}>
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Items For Dispatch</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/internal')}>
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Internal Transfer</p>
                    </div>

                    {/* <div className='main-images-container' onClick={() => navigate('/picklist')}>
                        <img src={picklist} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Pick List</p>
                    </div> */}

                    {/* <div className='main-images-container' onClick={() => navigate('/packingslip')}>
                        <img src={packing} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Packing Slip</p>
                    </div> */}

                    {/* <div className='main-images-container' onClick={() => navigate('/packingslip')}>
                        <img src={packing} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Packing Slip</p>
                    </div> */}

                    <div className='main-images-container' onClick={() => navigate('/Picklistassign')}>
                        <img src={picklist} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Pick List</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/journallist')}>
                        <img src={inventory} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal List</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/pickingsales')}>
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Sales Picking List</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/returnsales')}>
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Return Sales Order</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/journalprofit')}>
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal Profit Lost</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/journalmovement')}>
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal Movement</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/journalcounting')}>
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal Counting</p>
                    </div>

                </div>
            )}

            <div className='main-images-container' onClick={() => setWmsMobileApp(!wmsMobileApp)}>
                <img src={wms} className='main-inside-image rounded-full bg-white' alt='' />
                <p className='sidebar-text'>WMS Mobile App</p>
            </div>

            {wmsMobileApp && (
                <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>

                    <div className='main-images-container'>
                        <img src={dispatch} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Dispatch Management</p>
                    </div>

                    <div className='main-images-container' onClick={() => {
                        // remove item from session storage
                        sessionStorage.removeItem('receiptsData');
                        navigate('/receipts')
                    }}>
                        <img src={receipts} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Receipts Management</p>
                    </div>

                    <div className='main-images-container' onClick={() => {
                        // remove item from session storage
                        sessionStorage.removeItem('receivingBycontainerIdData');
                        navigate('/receiving-by-containerid-first')
                    }}>
                        <img src={receipts} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>RECEIVING BY CONTAINER</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/transferpage1')}>
                        <img src={wmsbintobin} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Bin To Bin (Axapta)</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/bintobin')}>
                        <img src={wmslogin} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Bin To Bin (Internal)</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/bintobin2')}>
                        <img src={wmsjournal} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Bin To Bin (Journal)</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/itemallocation')}>
                        <img src={wmsallocation} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Item Re Allocation</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/wmsinventory')}>
                        <img src={inventory} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>WMS Inventory</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/wmsphysical')}>
                        <img src={wmsinventory} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>WMS Physical Inventory</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/wmsphysicalbinlocation')}>
                        <img src={wmslocation} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Inventory By BinLocation</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/wmsbinlocation')}>
                        <img src={move} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>WMS Inventory (by BIN)</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/putaway')}>
                        <img src={picklist} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Put-Away Transaction</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/wmsmapping')}>
                        <img src={wmsbarcode} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Product Barcode Mapping</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/palletscreen1')}>
                        <img src={wmspallet} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Palletization</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/dispatchingslip')}>
                        <img src={wmsdispatch} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Dispatching</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/pickinglistfrom')}>
                        <img src={wmspicking} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Picking Slip</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/rma')}>
                        <img src={productreturn} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Return RMA</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/rmaputaway')}>
                        <img src={wmsputaway} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>RMA PutAway</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/journalfirst')}>
                        <img src={movement} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Journal Movement Counting</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/profitloss')}>
                        <img src={profit} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Profit and Loss</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/cyclecounting')}>
                        <img src={cycle} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Cycle Counting Process</p>
                    </div>

                    {/* <div className='main-images-container' onClick={() => navigate('/rmaputaway')}>
                        <img src={movement} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>RMA PutAway</p>
                    </div> */}

                </div>
            )}


            <div className='main-images-container' onClick={() => setKpiDashbaord(!kpiDashboard)}>
                <img src={packing} className='main-inside-image' alt='' />
                <p className='sidebar-text'>KPI Dashboard's</p>
            </div>

            {kpiDashboard && (
                <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                    <div className='main-images-container' onClick={() => navigate('/kpireceiving')}>
                        <img src={inventory} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Receiving</p>
                    </div>

                    <div className='main-images-container'>
                        <img src={stocking} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Dispatching</p>
                    </div>
                </div>
            )}

            <div className='main-images-container'>
                <img src={setting} className='main-inside-image' alt='' />
                <p className='sidebar-text'>Settings</p>
            </div>

            <div className='main-images-container'
                onClick={() => navigate('/user-accounts')}
            >
                <img src={setting} className='main-inside-image' alt='' />
                <p className='sidebar-text'>Users Account</p>
            </div>

            <div className='main-images-container' onClick={handleLogout}>
                <img src={exit} className='main-inside-image' alt='' />
                <p className='sidebar-text'>Log-Out</p>
            </div>


            <div className='main-images-container'>
                <h2 className='text-white font-semibold'>USER ID:<span className='text-white' style={{ "marginLeft": "5px" }}>{initialUser?.UserID}</span></h2>
            </div>

        </div>
    )
}

export default FigmaSidebar