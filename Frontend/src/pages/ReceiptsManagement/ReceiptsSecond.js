import React, { useEffect, useState } from 'react'

const Details1 = () => {
  return (
    <>
      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-[79%] h-screen px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
          <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#f4d0a9] text-xl mb:2 md:mb-5">
              <div className='flex flex-col gap-2'>
                    <span>Job Order Number</span>
                    <span>Container Number</span>
              </div>
              <div className='flex justify-between'>
                    <div className='flex items-center'>
                        <span>Item Code</span>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex flex-col justify-center items-center gap-2'>
                            <span>Qty</span>
                            <span>45</span>    
                        </div>
                        <div className='flex flex-col justify-center items-center gap-2'>
                            <span>Received</span>
                            <span>23</span>
                        </div>
                    </div>
              </div>
            </div>
            <form>

              <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-black">ITEM NAME</label>
              </div>

              <div className="mb-6">
                <label htmlFor="scan" className="block mb-2 text-xs font-medium text-black">Enter Scan/GTIN</label>
                <input id="scan" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Scan/GTIN" required />
              </div>

              <div className="mb-6">
                <label htmlFor="zone" className="block mb-2 text-xs font-medium text-black">Enter/Scan Receiving Zone</label>
                <input id="zone" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter/Scan Receiving Zone" required />
              </div>


              <div className="mt-4 md:mt-10 w-full flex justify-end text-sm md:text-xl py-2 rounded-md">
                  <button type='submit' className="bg-[#e69138] text-white font-semibold py-2 px-10 rounded-sm">
                    Scan Serial Numbers
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Details1