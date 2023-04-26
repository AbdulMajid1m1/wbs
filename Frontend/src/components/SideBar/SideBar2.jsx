import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import icons from "../../images/icons.png"
import city from "../../images/city.png"
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io"


const SideBar2 = () => {
    const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
    const [showMasterDataDropdown, setShowMasterDataDropdown] = useState(false);

    const navigate = useNavigate();

    return (
        <div>
            {/* <SideBar /> */}
            <div className="fixed flex flex-col left-0 w-14 md:w-64 bg-blue-900 dark:bg-gray-900 h-full text-white border-none z-10">
                <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
                    <ul className="flex flex-col py-4 space-y-4">
                        <li className="px-5 hidden md:block">
                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Main</div>
                            </div>
                        </li>
                        <li onClick={() => navigate('/dashboard')} className='cursor-pointer lg:flex lg:items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800'>
                            {/* <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"> */}
                            <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-2">
                                <img src={city}
                                    className='h-5 w-5' alt='' />
                            </span>
                            <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Dashboard</span>
                            {/* </a> */}
                        </li>


                        {/* Warehouse Data Icons */}
                        <li className='cursor-pointer lg:flex lg:items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800' onClick={() => setShowWarehouseDropdown(!showWarehouseDropdown)}>
                            <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-2">
                                <img src={icons}
                                    className='h-5 w-5' alt='' />
                            </span>
                            <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Warehouse Operation</span>
                        </li>

                        {showWarehouseDropdown && (
                            <ul className="flex flex-col space-y-5 pt-2 pl-0 md:pl-5 lg:pl-5 xl:pl-5 2xl:pl-5 3xl:pl-5">

                                <li className='cursor-pointer' onClick={() => navigate('/items')}>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Items</span>
                                </li>

                                <li
                                    className='cursor-pointer' onClick={() => navigate('/shipment')}>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Receving</span>
                                </li>
                                <li
                                    className='cursor-pointer' onClick={() => navigate('/tbldispatching')}>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Dispatching</span>
                                </li>
                                <li
                                    className='cursor-pointer' onClick={() => navigate('/tblLocation')}>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Warehouse Locations</span>
                                </li>
                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">PutAway</span>
                                </li>
                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Picking</span>
                                </li>
                                <li
                                >
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Pallets</span>
                                </li>
                                <li
                                    className='cursor-pointer'
                                >
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Mapped Items</span>
                                </li>
                                <li className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">RMA</span>
                                </li>
                                <li
                                >
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Physical Count</span>
                                </li>


                            </ul>
                        )}



                        {/* Master Data Icons */}
                        <li className='cursor-pointer lg:flex lg:items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800' onClick={() => setShowMasterDataDropdown(!showMasterDataDropdown)}>
                            <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-3">
                                <img src={city} className='h-5 w-5' alt='' />
                            </span>
                            <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">MasterData</span>
                        </li>


                        {showMasterDataDropdown && (
                            <ul className="flex flex-col space-y-5 pt-2 pl-0 md:pl-5 lg:pl-5 xl:pl-5 2xl:pl-5 3xl:pl-5">
                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Inventory Items</span>
                                </li>

                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Expected Receipts</span>
                                </li>

                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Expexted Shipments</span>
                                </li>

                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Expected Transfer Orders</span>
                                </li>

                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Items for Dispatch</span>
                                </li>

                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Internal Transfer</span>
                                </li>

                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={city} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Pick List</span>
                                </li>

                                <li
                                    className='cursor-pointer'>
                                    <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                                        <img src={icons} className='h-5 w-5' alt='' />
                                    </span>
                                    <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Packing Slip</span>
                                </li>
                            </ul>
                        )}

                        {/* <li className='cursor-pointer'>
            <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
                <img src={city} className='h-5 w-5' alt='' />
            </span>
         <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Settings</span>
       </li> */}

                        <li className='cursor-pointer lg:flex lg:items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800'>
                            <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-3">
                                <img src={icons} className='h-5 w-5' alt='' />
                            </span>
                            <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Settings</span>
                        </li>

                    </ul>
                </div>
            </div>
            {/* <!-- ./Sidebar --> */}

        </div>
    )
}

export default SideBar2