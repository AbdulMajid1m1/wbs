import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./TransferID.css";
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"

const TransferID = () => {
    const navigate = useNavigate();

  return (
    <>
      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                <div className='w-full flex justify-end'>
                  <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                    <span>
                      <img src={icon} className='h-auto w-8 object-contain' alt='' />
                    </span>
                  </button>
                </div>
                <span className='text-white -mt-7'>TRANSFER ID#:</span>
                <input className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Transfer ID Number"
                />
                
                <div className='flex gap-2 justify-center items-center'>
                    <span className='text-white'>FROM:</span>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Location Reference"
                    />
                  </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Item Code:</span>
                  <span>ITEM-0001</span>
                </div>

                <div className='text-[#FFFFFF]'>
                    <span>CLASS G</span>
                </div>
              </div>
              
              <div>
                <div className='flex gap-6 justify-center items-center text-xs mt-2 sm:mt-0 sm:text-lg'>
                    <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                        <span>Quantity<span className='text-[#FF0404]'>*</span></span>
                        <span>67</span>
                    </div>

                    <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                        <span>Picked<span className='text-[#FF0404]'>*</span></span>
                        <span>4567</span>
                    </div>
                    </div>
                </div>


            <div class="text-center">
                <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                >
                    <label className="inline-flex items-center mt-1">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-[#00006A] border-gray-300 rounded-md" />
                        <span className="ml-2 text-[#00006A]">BY PALLETE</span>
                    </label>
                    <label className="inline-flex items-center mt-1">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-[#00006A] border-gray-300 rounded-md" />
                        <span className="ml-2 text-[#00006A]">BY SERIAL</span>
                    </label>
                </div>
            </div>

            </div>
            
            <form
            //   onSubmit={handleFormSubmit}
            >
              <div className="mb-6">
                <label htmlFor='scan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Pallete#<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="scan"
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Scan/Pallete Number"
              />
              </div>

              <div className='mb-6'>
              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>TransferID</th>
                      <th>Config</th>
                      <th>InventoryLocationIDFrom</th>
                      <th>InventoryLocationIDTo</th>
                      <th>Item ID </th>
                      <th>InventDIMID</th>
                      <th>Qty.Transfer</th>
                      <th>Qty.RemainRecieve </th>
                      <th>Created DateTime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {serialNumbers.map((serialNumber, index) => (
                      <tr key={index}>
                        <td>{serialNumber}</td>
                      </tr>
                    ))} */}
                    <tr>
                        <td>1</td>
                        <td>IRT-00398365</td>
                        <td>G</td>
                        <td>RMW01</td>
                        <td>RSR01</td>
                        <td>SF-P110XAV 2206 WH</td>
                        <td>ID00000000003</td>
                        <td>1.000000000000</td>
                        <td>1.000000000000</td>
                        <td>2023-04-28 12:04:13.000</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>IRT-00398365</td>
                        <td>G</td>
                        <td>RMW01</td>
                        <td>RSR01</td>
                        <td>SF-P110XAV 2206 WH</td>
                        <td>ID00000000003</td>
                        <td>1.000000000000</td>
                        <td>1.000000000000</td>
                        <td>2023-04-28 12:04:13.000</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>IRT-00398365</td>
                        <td>G</td>
                        <td>RMW01</td>
                        <td>RSR01</td>
                        <td>SF-P110XAV 2206 WH</td>
                        <td>ID00000000003</td>
                        <td>1.000000000000</td>
                        <td>1.000000000000</td>
                        <td>2023-04-28 12:04:13.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              </div >

            </form>

            <div className="mb-6">
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Location To:<span className='text-[#FF0404]'>*</span></label>
              <input
                id="enterscan"
                className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter/Scan Location"
              />
            </div >
            
              <div className='mb-6 flex justify-center items-center'>
              <button
                    type='submit'
                      className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[25%]'>
                    <span className='flex justify-center items-center'>
                      <p>Save</p>
                    </span>
                  </button>
              </div>
          </div>
        </div >
      </div >
    </>
  )
}

export default TransferID