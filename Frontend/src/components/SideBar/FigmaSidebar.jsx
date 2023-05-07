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

import { useNavigate } from 'react-router-dom'



const FigmaSidebar = () => {
    const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
    const [showMasterData, setShowMasterData] = useState(false);
    const [wmsMobileApp, setWmsMobileApp] = useState(false);
    const [kpiDashboard, setKpiDashbaord] = useState(false);

    const navigate = useNavigate();
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
                        <p className='sidebar-text'>Items</p>
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

                    <div className='main-images-container'>
                        <img src={inventory} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>RMA</p>
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

                    <div className='main-images-container' onClick={() => navigate('/picklist')}>
                        <img src={picklist} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Pick List</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/packingslip')}>
                        <img src={packing} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Packing Slip</p>
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

                    <div className='main-images-container'>
                        <img src={stocking} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Internal Transfer Order</p>
                    </div>

                    <div className='main-images-container'>
                        <img src={inventory} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Physical Inventory</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/putaway')}>
                        <img src={picklist} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Put-Away Transaction</p>
                    </div>

                    <div className='main-images-container'>
                        <img src={barcode} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Product Barcode Mapping</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/palletscreen1')}>
                        <img src={picklist} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Palletizing</p>
                    </div>

                    <div className='main-images-container'>
                        <img src={productreturn} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Return RMA</p>
                    </div>

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

        </div>
    )
}

export default FigmaSidebar