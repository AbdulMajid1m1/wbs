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
import { useNavigate } from 'react-router-dom'



const FigmaSidebar = () => {
    const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
    const [showMasterData, setShowMasterData] = useState(false);

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
            <div>
               <div className='main-images-container' onClick={() => navigate('/itemscl')}>
                    <img src={items} className='main-inside-image' alt='' />
                    <p className='sidebar-text'>Items</p>
               </div>

               <div className='main-images-container' onClick={() => navigate('/shipment')}>
                    <img src={expected} className='main-inside-image' alt='' />
                    <p className='sidebar-text'>Receving</p>
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

               <div className='main-images-container'>
                    <img src={internal} className='main-inside-image' alt='' />
                    <p className='sidebar-text'>Picking</p>
               </div>

               <div className='main-images-container'>
                    <img src={picklist} className='main-inside-image' alt='' />
                    <p className='sidebar-text'>Pallets</p>
               </div>

               <div className='main-images-container'>
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
            <p className='sidebar-text'>Master Data</p>
        </div>

        {showMasterData && (
            <div>

        <div className='main-images-container' onClick={() => navigate('/items')}>
            <img src={inventory} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Inventory Items</p>
        </div>

        <div className='main-images-container' onClick={() => navigate('/expectedreceipts')}>
            <img src={expected} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Expected Receipts</p>
        </div>

        <div className='main-images-container' onClick={() => navigate('/shipment')}>
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

        <div className='main-images-container'>
            <img src={setting} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Settings</p>
        </div>

    </div>
  )
}

export default FigmaSidebar