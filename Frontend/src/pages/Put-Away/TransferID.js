import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./TransferID.css";
import userRequest from '../../utils/userRequest';
// import Swal from 'sweetalert2';

const TransferID = () => {
    const navigate = useNavigate();

  return (
    <>
      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#e69138] text-xl mb:2 md:mb-5">

              <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                <div className='w-full flex justify-end'>
                  <button onClick={() => navigate(-1)} className='w-[15%] rounded-sm bg-[#fff] text-[#e69138]'>
                    Back
                  </button>
                </div>
                <span className='text-white'>TRANSFER ID:</span>
                <input className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="TRANSFER ID NUMBER"
                />
                <div className='flex gap-2 justify-center items-center'>
                    <span className='text-white'>FROM:</span>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 " placeholder="Job Order Number"
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
                <div className='flex gap-6 justify-center items-center'>
                    <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                        <span>Quantity</span>
                        <span>67</span>
                    </div>

                    <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                        <span>Picked</span>
                        <span>4567</span>
                    </div>
                    </div>
                </div>

              {/* <div>
                <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    block h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="TRANSFER ID NUMBER"
                    >
                </div>
              </div>
               */}

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
                <label className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Pallete#*</label>
                <input id="scan" className="bg-gray-50 font-semibold border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Scan/Pallete Number"
                />

              </div>

              {/* <div className="mb-6">
                <button type='submit'
                  className="bg-[#e69138] text-white font-semibold py-2 px-10 rounded-sm">
                  Insert Serial Number
                </button>
              </div> */}

              <div className="mb-6">
                {/* // creae excel like Tables  */}
                <div className="table-location-generate1">
                  <table>
                    <thead>
                      <tr>
                        <th>ITEM NAME</th>
                        <th>ITEM ID</th>
                        <th>SERIAL NUMBER</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Majid</td>
                            <td>Hasnain</td>
                            <td>Faysal</td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              </div >

            </form>

            <div>
                <span className='text-[#00006A] font-semibold sm:text-lg text-xs'>Scan Location To :</span>
                    <input className="bg-gray-50 border border-gray-300 font-semibold text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5" placeholder="Enter /Scan Location"
                    />
            </div>
          </div>
        </div >
      </div >
    </>
  )
}

export default TransferID