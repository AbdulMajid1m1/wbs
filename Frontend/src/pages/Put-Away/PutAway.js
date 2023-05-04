import React, { useContext, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import userRequest from '../../utils/userRequest';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { ReceiptsContext } from '../../contexts/ReceiptsContext';
import DashboardTable from '../../components/AlessaDashboardTable/DashboardTable';
import { TblReceiptsManagementColumn } from '../../utils/datatablesource';

const PutAway = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  return (
    <>
      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#e69138] text-xl mb:2 md:mb-5">

              <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                <div className='w-full flex justify-end'>
                  <button onClick={() => navigate(-1)} className='w-[15%] rounded-sm bg-[#fff] text-[#e69138]'>
                    Back
                  </button>
                </div>
                <span className='text-white'>Transfer ID</span>
                
                <div className='flex justify-center gap-1'>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 " placeholder="Enter/Scan Transfer ID"
                  
                />

                 <button
                  type='submit'
                  className="bg-[#fff] hover:bg-[#efae68] text-[#e69138] font-medium py-1 px-6 rounded-sm w-[15%]">
                  <span className='flex justify-center items-center'>
                    <p>Find</p>
                  </span>
                </button>

                  </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                {/* <div className='flex items-center sm:text-lg gap-2 text-white'>
                  <span>Results:</span>
                  <span>0</span>

                </div> */}

              </div>

            </div>

            <div className="mb-6">

            <DashboardTable data={data} title={"Shipment Details"} columnsName={TblReceiptsManagementColumn}

            />
            </div >

          </div>
        </div>
      </div>
    </>
  )
}

export default PutAway