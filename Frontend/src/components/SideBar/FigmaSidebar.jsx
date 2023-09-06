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
import palletmaster from "../../images/palletmaster.png"
import unallocation from "../../images/unallocation.png"
import palletid from "../../images/palletid.png"
import settingicon from "../../images/settingicon.png"
import zonereceving from "../../images/zonereceiving.png"
import dispatching from "../../images/dispatching.png"
import itemlabels from "../../images/itemlabels.png"
import shipmentTitle from "../../images/shipmentTitle.png"
import delivery from "../../images/delivery.png"
import bintobinMain from "../../images/bintobinMain.png"
import rmaMain from "../../images/rmaMain.png"
import inventoryMain from "../../images/inventoryMain.png"
import utility from "../../images/utility.png"
import controls from "../../images/controls.png"
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import userRequest from '../../utils/userRequest'

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const FigmaSidebar = () => {
    const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
    const [showMasterData, setShowMasterData] = useState(false);
    const [wmsMobileApp, setWmsMobileApp] = useState(false);
    const [showShipment, setShowShipment] = useState(false);
    const [showdelivery, setShowdelivery] = useState(false);
    const [showbintobin, setShowbintobin] = useState(false);
    const [showRma, setShowRma] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [showUtility, setShowUtility] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [kpiDashboard, setKpiDashbaord] = useState(false);
    const [settingtitle, setSettingTitle] = useState(false);

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



    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedPath, setSelectedPath] = useState('');
  
    // const handleItemClick = (path) => {
    //   if (path === selectedPath) {
    //     window.open(path, '_blank');
    //   } else {
    //     navigate(path);
    //   }
    // };
    const handleItemClick = (path) => {
        setSelectedItem(path);
        navigate(path);
      };
  
    const handleContextMenu = (event, path) => {
      event.preventDefault();
      const clickX = event.clientX;
      const clickY = event.clientY;
      setContextMenuPosition({ x: clickX, y: clickY });
      setSelectedPath(path);
      setShowContextMenu(true);
    };
  
    const handleContextMenuOptionClick = (option) => {
      if (option === 'openNewTab') {
        window.open(selectedPath, '_blank');
      }
      setShowContextMenu(false);
    };
  
    const [selectedItem, setSelectedItem] = useState(null);


    return (
        <div className='main-sidebar'>

            <div
              className={`main-images-container ${selectedItem === '/dashboard' ? 'selected-item' : ''}`}
              onClick={() => handleItemClick('/dashboard')}      
            // className='main-images-container' onClick={() => navigate('/dashboard')}
                   onContextMenu={(event) => handleContextMenu(event, '/dashboard')}
            >
                <img src={packing} className='main-inside-image' alt='' />
                <p className='sidebar-text'>Dashboard</p>
            </div>

            <div className='main-images-container' 
                onClick={() => setShowWarehouseDropdown(!showWarehouseDropdown)}>
                <img src={inventory} className='main-inside-image' alt='' />
                <p className='sidebar-text sm:-mr-3 mr-0'>Warehouse Operation</p>
                {showWarehouseDropdown ? (
                    <ExpandLessIcon sx={{ color: 'white' }} />
                    ) : (
                    <ExpandMoreIcon sx={{ color: 'white' }} />
                )}
            </div>

        
            {showWarehouseDropdown && (
                <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                    <div
                       className={`main-images-container ${selectedItem === '/itemscl' ? 'selected-item' : ''}`}
                       onClick={() => handleItemClick('/itemscl')}
                    
                    // className='main-images-container' onClick={() => navigate('/itemscl')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/itemscl')
                          }
                    >
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Stock Master</p>
                    </div>

                    <div 
                        className={`main-images-container ${selectedItem === '/palletmaster' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/palletmaster')}
                        // className='main-images-container' onClick={() => navigate('/palletmaster')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/palletmaster')
                          }
                    >
                        <img src={palletmaster} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Pallet Master</p>
                    </div>

                    <div
                      className={`main-images-container ${selectedItem === '/shipmentreceived' ? 'selected-item' : ''}`}
                      onClick={() => handleItemClick('/shipmentreceived')}
                    // className='main-images-container' onClick={() => navigate('/shipmentreceived')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/shipmentreceived')
                          }
                    >
                        <img src={expected} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Shipment Received</p>
                    </div>

                    <div 
                        className={`main-images-container ${selectedItem === '/tbldispatching' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/tbldispatching')}
                        // className='main-images-container' onClick={() => navigate('/tbldispatching')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/tbldispatching')
                          }
                    >
                        <img src={shipment} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Dispatching</p>
                    </div>

                    <div
                       className={`main-images-container ${selectedItem === '/tblLocation' ? 'selected-item' : ''}`}
                       onClick={() => handleItemClick('/tblLocation')} 
                    // className='main-images-container' onClick={() => navigate('/tblLocation')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/tblLocation')
                          }
                    >
                        <img src={transfer} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Warehouse Locations</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/warehousemovement' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/warehousemovement')}   
                    // className='main-images-container' onClick={() => navigate('/warehousemovement')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/warehousemovement')
                          }
                    >
                        <img src={picklist} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal Movement</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/warehouseprofitloss' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/warehouseprofitloss')} 
                    // className='main-images-container' onClick={() => navigate('/warehouseprofitloss')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/warehouseprofitloss')
                          }
                    >
                        <img src={profit} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Journal ProfitLoss</p>
                    </div>

                    <div
                       className={`main-images-container ${selectedItem === '/warehousecounting' ? 'selected-item' : ''}`}
                       onClick={() => handleItemClick('/warehousecounting')}  
                    // className='main-images-container' onClick={() => navigate('/warehousecounting')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/warehousecounting')
                          }
                    >
                        <img src={cycle} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Journal Counting</p>
                    </div>

                    <div
                     className={`main-images-container ${selectedItem === '/warehousereturn' ? 'selected-item' : ''}`}
                     onClick={() => handleItemClick('/warehousereturn')}
                    // className='main-images-container' onClick={() => navigate('/warehousereturn')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/warehousereturn')
                          }
                    >
                        <img src={inventory} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Return Sales Order</p>
                    </div>

                    <div
                       className={`main-images-container ${selectedItem === '/warehouseinventory' ? 'selected-item' : ''}`}
                       onClick={() => handleItemClick('/warehouseinventory')} 
                    // className='main-images-container' onClick={() => navigate('/warehouseinventory')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/warehouseinventory')
                          }
                    >
                        <img src={profit} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Wms Inventory</p>
                    </div>

                    <div
                       className={`main-images-container ${selectedItem === '/printinglabels' ? 'selected-item' : ''}`}
                       onClick={() => handleItemClick('/printinglabels')}  
                    // className='main-images-container' onClick={() => navigate('/printinglabels')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/printinglabels')
                          }
                    >
                        <img src={printinglabel} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Printing Pallet Labels</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/printingbarcode' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/printingbarcode')}    
                    // className='main-images-container' onClick={() => navigate('/printingbarcode')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/printingbarcode')
                          }
                    >
                        <img src={printing} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Printing Item Barcode</p>
                    </div>
                    <div
                        className={`main-images-container ${selectedItem === '/printing-item-label' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/printing-item-label')}    
                    // className='main-images-container' onClick={() => navigate('/printingbarcode')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/printing-item-label')
                          }
                    >
                        <img src={itemlabels} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Printing Item Labels</p>
                    </div>

                    {/* <div className='main-images-container'>
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>PutAway</p>
                    </div> */}

                    <div 
                       className={`main-images-container ${selectedItem === '/pickingcl' ? 'selected-item' : ''}`}
                       onClick={() => handleItemClick('/pickingcl')}
                    // className='main-images-container' onClick={() => navigate('/pickingcl')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/pickingcl')
                          }
                    >
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Picking</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/shipmentpalletizing' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/shipmentpalletizing')}     
                    // className='main-images-container' onClick={() => navigate('/shipmentpalletizing')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/shipmentpalletizing')
                          }
                    >
                        <img src={picklist} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Pallets</p>
                    </div>

                    <div
                         className={`main-images-container ${selectedItem === '/mappeditems' ? 'selected-item' : ''}`}
                         onClick={() => handleItemClick('/mappeditems')}       
                    // className='main-images-container' onClick={() => navigate('/mappeditems')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/mappeditems')
                          }
                    >
                        <img src={packing} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Mapped Items</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/reallocation' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/reallocation')}          
                    // className='main-images-container' onClick={() => navigate('/reallocation')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/reallocation')
                          }
                    >
                        <img src={stocking} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>1 Reallocation Picked</p>
                    </div>

                    <div 
                        className={`main-images-container ${selectedItem === '/bintobincl' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/bintobincl')}    
                    // className='main-images-container' onClick={() => navigate('/bintobincl')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/bintobincl')
                          }
                    >
                        <img src={dispatch} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>2  Bin To Bin CL</p>
                    </div>

                    {/* <div className='main-images-container' onClick={() => navigate('/Picklistassign')}>
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Picklist Assigned</p>
                    </div> */}

                    <div
                        className={`main-images-container ${selectedItem === '/pickingsales' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/pickingsales')}     
                    // className='main-images-container' onClick={() => navigate('/pickingsales')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/pickingsales')
                          }
                    >
                        <img src={packing} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Pick List Assigned</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/truckdata' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/truckdata')}      
                    // className='main-images-container' onClick={() => navigate('/truckdata')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/truckdata')
                          }
                    >
                        <img src={truckdata} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Truck Master Data</p>
                    </div>

                    {/* <div
                        className={`main-images-container ${selectedItem === '/zonemaster' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/zonemaster')}       
                    // className='main-images-container' onClick={() => navigate('/zonemaster')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/zonemaster')
                          }
                    >
                        <img src={zonemaster} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Zone Master</p>
                    </div> */}


                    <div
                        className={`main-images-container ${selectedItem === '/zonereceiving' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/zonereceiving')}       
                    // className='main-images-container' onClick={() => navigate('/zonemaster')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/zonereceiving')
                          }
                    >
                        <img src={zonereceving} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Zone Receiving</p>
                    </div>


                    <div
                        className={`main-images-container ${selectedItem === '/zonedispatching' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/zonedispatching')}       
                    // className='main-images-container' onClick={() => navigate('/zonemaster')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/zonedispatching')
                          }
                    >
                        <img src={dispatching} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Zone Dispatching</p>
                    </div>


                    <div 
                        className={`main-images-container ${selectedItem === '/binmaster' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/binmaster')}       
                    // className='main-images-container' onClick={() => navigate('/binmaster')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/binmaster')
                          }
                    >
                        <img src={binmaster} className='main-inside-image bg-white rounded-full' alt='' />
                        <p className='sidebar-text'>Bin Master</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/transhistory' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/transhistory')}   
                    // className='main-images-container' onClick={() => navigate('/transhistory')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/transhistory')
                          }
                    >
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
                <p className='sidebar-text sm:-mr-3 mr-0'>Master Data (Axapta)</p>
                {showMasterData ? (
                   <ExpandLessIcon sx={{ color: 'white' }} />
                   ) : (
                   <ExpandMoreIcon sx={{ color: 'white' }} />
                )}
            </div>

            {showMasterData && (
                <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>

                    <div
                        className={`main-images-container ${selectedItem === '/items' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/items')}
                    // className='main-images-container' onClick={() => navigate('/items')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/items')
                          }
                    >
                        <img src={inventory} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Inventory Items</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/expectedreceipts' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/expectedreceipts')} 
                    // className='main-images-container' onClick={() => navigate('/expectedreceipts')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/expectedreceipts')
                          }
                    >
                        <img src={expected} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Expected Receipts</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/expectedshipments' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/expectedshipments')}  
                    // className='main-images-container' onClick={() => navigate('/expectedshipments')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/expectedshipments')
                          }
                    >
                        <img src={shipment} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Expected Shipments</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/expectedorder' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/expectedorder')}  
                    // className='main-images-container' onClick={() => navigate('/expectedorder')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/expectedorder')
                          }
                    >
                        <img src={transfer} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Expected Transfer Orders</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/alldispatch' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/alldispatch')}    
                    // className='main-images-container' onClick={() => navigate('/alldispatch')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/alldispatch')
                          }
                    >
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Items For Dispatch</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/internal' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/internal')}    
                    // className='main-images-container' onClick={() => navigate('/internal')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/internal')
                          }
                    >
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Internal Transfer</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/Picklistassign' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/Picklistassign')}         
                    // className='main-images-container' onClick={() => navigate('/Picklistassign')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/Picklistassign')
                          }
                    >
                        <img src={picklist} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Pick List</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/journallist' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/journallist')}   
                    // className='main-images-container' onClick={() => navigate('/journallist')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/journallist')
                          }
                    >
                        <img src={inventory} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal List</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/pickingsales' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/pickingsales')}       
                    // className='main-images-container' onClick={() => navigate('/pickingsales')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/pickingsales')
                          }
                    >
                        <img src={items} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Sales Picking List</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/returnsales' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/returnsales')}            
                    // className='main-images-container' onClick={() => navigate('/returnsales')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/returnsales')
                          }
                    >
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Return Sales Order</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/journalprofit' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/journalprofit')}                 
                    // className='main-images-container' onClick={() => navigate('/journalprofit')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/journalprofit')
                          }
                    >
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal Profit Lost</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/journalmovement' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/journalmovement')}                         
                    // className='main-images-container' onClick={() => navigate('/journalmovement')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/journalmovement')
                          }
                    >
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal Movement</p>
                    </div>

                    <div
                        className={`main-images-container ${selectedItem === '/journalcounting' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/journalcounting')} 
                    // className='main-images-container' onClick={() => navigate('/journalcounting')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/journalcounting')
                          }
                    >
                        <img src={internal} className='main-inside-image' alt='' />
                        <p className='sidebar-text'>Journal Counting</p>
                    </div>

                </div>
            )}

            <div className='main-images-container' onClick={() => setWmsMobileApp(!wmsMobileApp)}>
                <img src={wms} className='main-inside-image rounded-full bg-white' alt='' />
                <p className='sidebar-text sm:-mr-3 mr-0'>WMS Mobile App</p>
                {wmsMobileApp ? (
                    <ExpandLessIcon sx={{ color: 'white' }} />
                    ) : (
                    <ExpandMoreIcon sx={{ color: 'white' }} />
                )}
            </div>

            {wmsMobileApp && (
                <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>

                    <div className='main-images-container' onClick={() => navigate('/wmsmapping')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/wmsmapping')
                        }
                    >
                        <img src={wmsbarcode} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Barcode Mapping</p>
                    </div>

                    
                    <div className='main-images-container' onClick={() => setShowShipment(!showShipment)}>
                        <img src={shipmentTitle} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text sm:-mr-3 mr-0'>Shipments</p>
                        {showShipment ? (
                            <ExpandLessIcon sx={{ color: 'white' }} />
                            ) : (
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                        )}
                    </div>


                    {showShipment && (
                        <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                          <div className='main-images-container' onClick={() => {
                            // remove item from session storage
                            sessionStorage.removeItem('receiptsData');
                            navigate('/receipts')
                        }}
                            onContextMenu={(event) =>
                                handleContextMenu(event, '/receipts')
                            }
                        >
                            <img src={receipts} className='main-inside-image rounded-full bg-white' alt='' />
                            <p className='sidebar-text'>Receiving</p>
                        </div>
    
                     
                        <div className='main-images-container' onClick={() => navigate('/palletscreen1')}
                             onContextMenu={(event) =>
                                handleContextMenu(event, '/palletscreen1')
                            }
                        >
                            <img src={wmspallet} className='main-inside-image bg-white rounded-full' alt='' />
                            <p className='sidebar-text'>Palletization</p>
                        </div>
    
    
                        <div className='main-images-container' onClick={() => navigate('/putaway')}
                            onContextMenu={(event) =>
                                handleContextMenu(event, '/putaway')
                            }
                        >
                            <img src={picklist} className='main-inside-image rounded-full bg-white' alt='' />
                            <p className='sidebar-text'>Shipment Put-Away</p>
                        </div>
                       </div>     
                    )}


                    <div className='main-images-container' onClick={() => setShowdelivery(!showdelivery)}>
                        <img src={delivery} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text sm:-mr-3 mr-0'>Delivery</p>
                        {showdelivery ? (
                            <ExpandLessIcon sx={{ color: 'white' }} />
                            ) : (
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                        )}
                    </div>

                    {showdelivery && (
                     <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                         <div className='main-images-container' onClick={() => navigate('/pickinglistfrom')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/pickinglistfrom')
                        }
                    >
                        <img src={wmspicking} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Picking Slip</p>
                    </div>

                        <div className='main-images-container' onClick={() => navigate('/dispatchingslip')}
                            onContextMenu={(event) =>
                                handleContextMenu(event, '/dispatchingslip')
                            }
                        >
                            <img src={wmsdispatch} className='main-inside-image rounded-full bg-white' alt='' />
                            <p className='sidebar-text'>Dispatching</p>
                        </div>
                      </div>
                    )}
                    
                    
                    <div className='main-images-container' onClick={() => setShowbintobin(!showbintobin)}>
                        <img src={bintobinMain} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text sm:-mr-3 mr-0'>Transfers</p>
                        {showbintobin ? (
                            <ExpandLessIcon sx={{ color: 'white' }} />
                            ) : (
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                        )}
                    </div>

                    {showbintobin && (
                      <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                          <div className='main-images-container' onClick={() => navigate('/transferpage1')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/transferpage1')
                        }
                    >
                        <img src={wmsbintobin} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Bin To Bin (Axapta)</p>
                    </div>

                        <div className='main-images-container' onClick={() => navigate('/bintobin')}
                            onContextMenu={(event) =>
                                handleContextMenu(event, '/bintobin')
                            }  
                        >
                            <img src={wmslogin} className='main-inside-image rounded-full bg-white' alt='' />
                            <p className='sidebar-text'>Bin To Bin (Internal)</p>
                        </div>

                        <div className='main-images-container' onClick={() => navigate('/bintobin2')}
                            onContextMenu={(event) =>
                                handleContextMenu(event, '/bintobin2')
                            }  
                        >
                            <img src={wmsjournal} className='main-inside-image rounded-full bg-white' alt='' />
                            <p className='sidebar-text'>Bin To Bin (Journal)</p>
                        </div>
                      </div>
                    )}
                    

                    <div className='main-images-container' onClick={() => setShowRma(!showRma)}>
                        <img src={rmaMain} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text sm:-mr-3 mr-0'>Rma</p>
                        {showRma ? (
                            <ExpandLessIcon sx={{ color: 'white' }} />
                            ) : (
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                        )}
                    </div>

                    {showRma && (
                     <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                        <div className='main-images-container' onClick={() => navigate('/rma')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/rma')
                        }
                    >
                        <img src={productreturn} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Return RMA</p>
                    </div>

                    <div className='main-images-container' onClick={() => navigate('/rmaputaway')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/rmaputaway')
                        }
                    >
                        <img src={wmsputaway} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>RMA Put-Away</p>
                    </div>
                      </div>
                    )}
                  
                    
                    <div className='main-images-container' onClick={() => setShowInventory(!showInventory)}>
                        <img src={inventoryMain} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text sm:-mr-3 mr-0'>Inventory</p>
                        {showInventory ? (
                           <ExpandLessIcon sx={{ color: 'white' }} />
                           ) : (
                           <ExpandMoreIcon sx={{ color: 'white' }} />
                        )}
                    </div>

                    {showInventory && (
                    <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                       <div className='main-images-container' onClick={() => navigate('/wmsphysicalbinlocation')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/wmsphysicalbinlocation')
                        }
                    >
                        <img src={wmslocation} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Wms Inventory</p>
                    </div>

                      <div className='main-images-container' onClick={() => navigate('/journalfirst')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/journalfirst')
                        }
                    >
                        <img src={movement} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Journal Movement Counting</p>
                     </div>

                     <div className='main-images-container' onClick={() => navigate('/profitloss')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/profitloss')
                        }
                    >
                        <img src={profit} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Profit and Loss</p>
                     </div>

                     </div>
                    )}


                    <div className='main-images-container' onClick={() => setShowUtility(!showUtility)}>
                        <img src={utility} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text sm:-mr-3 mr-0'>Utility</p>
                        {showUtility ? (
                            <ExpandLessIcon sx={{ color: 'white' }} />
                            ) : (
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                        )}
                    </div>
                    
                    {showUtility && (
                      <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                        <div className='main-images-container' onClick={() => navigate('/itemallocation')}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/itemallocation')
                        }
                    >
                        <img src={wmsallocation} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Item Re Allocation</p>
                    </div>
       
                        <div className='main-images-container' onClick={() => navigate('/itemunallocation')}
                            onContextMenu={(event) =>
                                handleContextMenu(event, '/itemunallocation')
                            }
                        >
                            <img src={unallocation} className='main-inside-image rounded-full bg-white' alt='' />
                            <p className='sidebar-text'>Un-Allocated Items</p>
                        </div>


                        <div className='main-images-container' onClick={() => navigate('/palletIdInquiry')}
                            onContextMenu={(event) =>
                                handleContextMenu(event, '/palletIdInquiry')
                            }
                        >
                            <img src={palletid} className='main-inside-image bg-white rounded-full' alt='' />
                            <p className='sidebar-text'>Pallet ID Inquiry</p>
                        </div>
                       </div>
                    )}

                    
                    <div className='main-images-container' onClick={() => setShowControls(!showControls)}>
                        <img src={controls} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text sm:-mr-3 mr-0'>Controls</p>
                        {showControls ? (
                            <ExpandLessIcon sx={{ color: 'white' }} />
                            ) : (
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                        )}
                    </div>

                    {showControls && (
                      <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                        <div className='main-images-container' onClick={() => navigate('/wmsinventory')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/wmsinventory')
                        }
                       >
                        <img src={inventory} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>WMS Inventory (Assign)</p>
                     </div>
                     
                    <div className='main-images-container' onClick={() => navigate('/cyclecounting')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/cyclecounting')
                        }
                    >
                        <img src={cycle} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Cycle Counting Process</p>
                    </div>

                       </div> 
                    )}
  
                 
                    {/* <div className='main-images-container' onClick={() => navigate('/wmsphysicalbinlocation')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/wmsphysicalbinlocation')
                        }
                    >
                        <img src={wmslocation} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Inventory By Bin Location</p>
                    </div>

                
                    <div className='main-images-container' onClick={() => navigate('/wmsphysical')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/wmsphysical')
                        }
                    >
                        <img src={wmsinventory} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Physical Count (WMS)</p>
                    </div>

                
                    <div className='main-images-container' onClick={() => {
                        // remove item from session storage
                        sessionStorage.removeItem('receivingBycontainerIdData');
                        navigate('/receiving-by-containerid-first')
                    }}
                        onContextMenu={(event) =>
                            handleContextMenu(event, '/receiving-by-containerid-first')
                        }
                    >
                        <img src={receipts} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>RECEIVING BY CONTAINER</p>
                    </div> */}
                </div>
            )}


            {/* <div className='main-images-container' onClick={() => setKpiDashbaord(!kpiDashboard)}>
                <img src={packing} className='main-inside-image' alt='' />
                <p className='sidebar-text'>KPI Dashboard's</p>
            </div>

            {kpiDashboard && (
                <div className='ml-0 md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 3xl:ml-3'>
                    <div
                        className={`main-images-container ${selectedItem === '/kpireceiving' ? 'selected-item' : ''}`}
                        onClick={() => handleItemClick('/kpireceiving')}  
                    // className='main-images-container' onClick={() => navigate('/kpireceiving')}
                         onContextMenu={(event) =>
                            handleContextMenu(event, '/kpireceiving')
                        }
                    >
                        <img src={inventory} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Receiving</p>
                    </div>

                    <div className='main-images-container'>
                        <img src={stocking} className='main-inside-image rounded-full bg-white' alt='' />
                        <p className='sidebar-text'>Dispatching</p>
                    </div>
                </div>
            )} */}

            {/* <div className='main-images-container' onClick={() => setSettingTitle(!settingtitle)}>
                <img src={settingicon} className='main-inside-image bg-white rounded-full' alt='' />
                <p className='sidebar-text'>Settings</p>
            </div> */}
            
                <div
                className={`main-images-container ${selectedItem === '/user-accounts' ? 'selected-item' : ''}`}
                onClick={() => handleItemClick('/user-accounts')}
                onContextMenu={(event) =>
                    handleContextMenu(event, '/user-accounts')
                }  
                // className='main-images-container'
                //     onClick={() => navigate('/user-accounts')}
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



            {/* Context Menu */}
            {showContextMenu && (
                <div
                className='context-menu'
                style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
                >
                <div
                    className='context-menu-option'
                    onClick={() => handleContextMenuOptionClick('openNewTab')}
                >
                    Open in New Tab
                </div>
                <div
                    className='context-menu-option'
                    onClick={() => handleContextMenuOptionClick('someOption')}
                >
                    Close
                </div>
                {/* ...other context menu options... */}
                </div>
            )}


        </div>
    )
}

export default FigmaSidebar