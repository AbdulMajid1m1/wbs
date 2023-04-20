import React from 'react'
import icons from "../../images/icons.png"
import city from "../../images/city.png"

const SideBar = () => {
  return (
    <div>
     {/* <!-- Sidebar --> */}
 <div className="fixed left-0 2xl:mt-0 xl:mt-0 lg:mt-0 md:mt-0 w-14 md:w-56 xl:w-64 2xl:w-64 3xl:w-80 pt-5 bg-gray-500 dark:bg-gray-900 h-full text-white border-none overflow-scroll">
  <div className="flex flex-col justify-between">
    <ul className="flex flex-col py-4 space-y-5">
      <li className='cursor-pointer'>
        <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
        <img src={city}
          className='h-5 w-5' alt='' />
      </span>
      <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] font-bold flex flex-col justify-center text-center md:inline-block tracking-wide">Dashboard</span>
    </li>
    <li
      // onClick={() =>
      //   navigate('/newasset') } 
      className='cursor-pointer'>
      <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
        <img src={icons} className='h-5 w-5' alt='' />
      </span>
      <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Warehouse Operation</span>
    </li>
    <li
      className='cursor-pointer'>
      <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
        <img src={city} className='h-5 w-5' alt='' />
      </span>
      <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Items</span>
    </li>
    <li
      className='cursor-pointer'>
      <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
        <img src={icons} className='h-5 w-5' alt='' />
      </span>
      <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Receving</span>
    </li>
    <li
      className='cursor-pointer'>
      <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
        <img src={city} className='h-5 w-5' alt='' />
      </span>
      <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] flex flex-col justify-center text-center md:inline-block tracking-wide">Dispatching</span>
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
    <li  className='cursor-pointer'>
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
    <li
      className='cursor-pointer'>
      <span className="inline-flex bg-white w-7 h-7 rounded-full justify-center items-center ml-4">
        <img src={icons} className='h-5 w-5' alt='' />
      </span>
      <span className="xl:ml-2 2xl:ml-2 md:ml-2 ml-0 xl:text-sm 2xl:text-sm md:text-sm text-[7px] font-bold flex flex-col justify-center text-center md:inline-block tracking-wide">MasterData</span>
    </li>

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
</div>
</div>
{/* <!-- ./Sidebar --> */}

    </div>
  )
}

export default SideBar