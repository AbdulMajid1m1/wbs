import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa"
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./TransferIDPage1.css";
// import CustomSnakebar from '../../utils/CustomSnakebar';
// import back from "../../images/back.png"
import undo from "../../images/undo.png"

const TransferIDPage = () => {
  const navigate = useNavigate();
 
  const handleRowClick = () => {
    navigate('/transferid')
  }

  return (
    <>
      {/* {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />} */}
      {/* {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />} */}

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                  <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                    <span>
                      <img src={undo} className='h-auto w-8 object-contain' alt='' />
                    </span>
                  </button>

                   <h2 className='text-center text-[#fff]'>BIN to BIN TRANSFER</h2> 
                
                  <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                    <span>
                      <img src={icon} className='h-auto w-8 object-contain' alt='' />
                    </span>
                  </button>
              </div>
            </div>

            <div className=''>
                <h2 className='text-[#00006A] text-center font-semibold'>From AXAPTA<span className='text-[#FF0404]'>*</span></h2>
            </div>
      
            <div className='mb-6'>
              <label htmlFor='transfer' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Transfer ID<span className='text-[#FF0404]'>*</span></label>
              <div className='w-full flex'>
              <input 
                  id="transfer" 
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5" 
                      placeholder="Enter /Scan Transfer ID "
                     // value={palletCode}
                  //    onChange={handleInputChange}
                  />
                <button
                  type='button' 
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm'
                    >
                      FIND
                </button>        
                  </div> 
            </div>

            <div className='mb-6'>
              <label className='text-[#00006A] font-semibold'>Shipment Details<span className='text-[#FF0404]'>*</span></label>
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
                  <tbody onClick={handleRowClick}>
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
            </div>

            <div className='mt-6'>
              <div className='w-full flex justify-end place-items-end'>
                  <div>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                      <input
                        id="totals"
                        className="bg-gray-50 font-semibold text-center placeholder:text-[#00006A] border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Totals"
                      />
                  </div>
                </div>
                  
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransferIDPage