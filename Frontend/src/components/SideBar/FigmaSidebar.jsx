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



const FigmaSidebar = () => {
    const [showMasterData, setShowMasterData] = useState(false);

  return (
    <div className='main-sidebar'>
        <div className='main-images-container' onClick={() => setShowMasterData(!showMasterData)}>
            <img src={image} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Master Data</p>
        </div>

        {showMasterData && (
            <div>

        <div className='main-images-container'>
            <img src={inventory} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Inventory Items</p>
        </div>

        <div className='main-images-container'>
            <img src={expected} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Expected Receipts</p>
        </div>

        <div className='main-images-container'>
            <img src={shipment} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Expected Shipments</p>
        </div>

        <div className='main-images-container'>
            <img src={transfer} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Expected Transfer Orders</p>
        </div>

        <div className='main-images-container'>
            <img src={items} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Items For Dispatch</p>
        </div>

        <div className='main-images-container'>
            <img src={internal} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Internal Transfer</p>
        </div>

        <div className='main-images-container'>
            <img src={picklist} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Pick List</p>
        </div>

        <div className='main-images-container'>
            <img src={packing} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Packing Slip</p>
        </div>

        <div className='main-images-container'>
            <img src={setting} className='main-inside-image' alt='' />
            <p className='sidebar-text'>Settings</p>
        </div>

        </div>
        )}
    </div>
  )
}

export default FigmaSidebar