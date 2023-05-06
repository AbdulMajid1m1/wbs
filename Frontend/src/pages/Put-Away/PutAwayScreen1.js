import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { PalletizingByTransferIdColumn } from '../../utils/datatablesource';
import PutAwayTable from '../../components/Put-AwayTable/PutAwayTable';
import {FaSearch} from "react-icons/fa"
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import Swal from 'sweetalert2';
import { BeatLoader } from 'react-spinners';

const PutAway = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [shipmentTag, setShipmentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
  // const [selectedRow, setSelectedRow] = useState(null);


  const handleForm = (e) => {
    e.preventDefault();
    setIsLoading(true)

    userRequest.get(`/getShipmentPalletizingByTransferId?TRANSFERID=${shipmentTag}`)
      .then(response => {
        // console.log(response?.data);
        setData(response?.data ?? []);
        // setSelectedRow(response?.data[0] ?? []);
        // save data in session storage
        sessionStorage.setItem('putawaydata', JSON.stringify(response?.data ?? []));
        setIsLoading(false); 
      })

      .catch(error => {
        console.error(error);
        setIsLoading(false); 
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message ?? 'Something went wrong!',
        })
      });
  }

  const handleChangeValue = (e) => {
    setShipmentTag(e.target.value);
  }


  return (
    <>
         {isLoading &&

            <div className='loading-spinner-background'
                style={{
                    zIndex: 9999, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed'


                }}
            >
                <BeatLoader
                    size={18}
                    color={"#6439ff"}
                    // height={4}
                    loading={isLoading}
                />
            </div>
            }

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-300 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#e69138] text-xl mb:2 md:mb-5">

            <form onSubmit={handleForm}>
              <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                <div className='w-full flex justify-between'>
                  <div className='w-[85%]'>
                    <div className='relative'>
                      <input
                        className='w-full text-lg font-thin placeholder:text-[#fff] text-[#fff] bg-[#e69138] border-gray-300 focus:outline-none focus:border-blue-500 pl-8'
                        placeholder='Shipment Palletizing'
                      />
                      <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
                        <FaSearch size={20} className='text-[#FFF]' />
                      </div>
                    </div>
                  </div>
                  
                  <button type='button' onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium -mt-2 rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                    <span>
                        <img src={icon} className='h-auto w-8 object-contain' alt='' />
                    </span>
                  </button>
                </div>

                <span className='text-white'>Enter/scan Transfer Order ID</span>
                
                <div className='flex justify-center gap-1'>
                <input
                  onChange={handleChangeValue} 
                    name=''
                     className="bg-gray-50 border border-gray-300 text-xs text-[#00006A] rounded-lg focus:ring-blue-500
                      block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Enter/scan Transfer Order ID"
                  
                />

                 <button
                  type='submit'
                  className="bg-[#fff] hover:bg-[#edc498] text-[#e69138] font-medium py-1 px-6 rounded-sm w-[15%]">
                  <span className='flex justify-center items-center'>
                    <p>Find</p>
                  </span>
                </button>

                  </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-white'>
                  <span>Results:</span>
                  <span>0</span>
                </div>
              </div>
              </form>
            </div>

            <div className="mb-6">

            <PutAwayTable data={data} columnsName={PalletizingByTransferIdColumn}

            />
            </div >

          </div>
        </div>
      </div>
    </>
  )
}

export default PutAway