import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./TransferIDPage1.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';

const TransferIDPage = () => {
  const navigate = useNavigate();

  const [transferTag, setTransferTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  

  const handleRowClick = (item, index) => {
    // save data in session storage
    sessionStorage.setItem('transferData', JSON.stringify(item)); 
    navigate('/transferid')
  }

  
  const handleChangeValue = (e) => {
    setTransferTag(e.target.value);
  }

  const handleForm = (e) => {
    e.preventDefault();
    setIsLoading(true)

    userRequest.get(`/getExpectedTransferOrderByTransferId?TRANSFERID=${transferTag}`)
      .then(response => {
        console.log(response?.data);

        setData(response?.data ?? []);
        setIsLoading(false)
      })

      .catch(error => {
        console.error(error);
        setIsLoading(false)
      });
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
                  <SyncLoader

                      size={18}
                      color={"#FFA500"}
                      // height={4}
                      loading={isLoading}
                  />
              </div>
              }


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

            <form onSubmit={handleForm}>
            <div className='mb-6'>
              <label htmlFor='transfer' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Transfer ID<span className='text-[#FF0404]'>*</span></label>
              <div className='w-full flex'>
              <input 
                  id="transfer" 
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5" 
                      placeholder="Enter /Scan Transfer ID "
                     onChange={handleChangeValue}
                     />
                <button
                  type='submit' 
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm'
                    >
                      FIND
                </button>        
                  </div> 
            </div>
            </form>

            <div className='mb-6'>
              <label className='text-[#00006A] font-semibold'>Shipment Details<span className='text-[#FF0404]'>*</span></label>    
             <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>TRANSFER ID</th>
                      <th>TRANSFER STATUS</th>
                      <th>INVENT LOCATION ID FROM</th>
                      <th>INVENT LOCATION ID TO</th>
                      <th>ITEM ID</th>
                      <th>QTY TRANSFER</th>
                      <th>QTY RECEIVED</th>
                      <th>CREATED DATE TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} onClick={()=>handleRowClick(item,index)}>
                        <td>{item.TRANSFERID}</td>
                        <td>{item.TRANSFERSTATUS}</td>
                        <td>{item.INVENTLOCATIONIDFROM}</td>
                        <td>{item.INVENTLOCATIONIDTO}</td>
                        <td>{item.ITEMID}</td>
                        <td>{item.QTYTRANSFER}</td>
                        <td>{item.QTYRECEIVED}</td>
                        <td>{item.CREATEDDATETIME}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='mt-6'>
              <div className='w-full'>
                  <div className='flex justify-end items-center gap-2'>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                      <div
                        id="totals"
                        className="bg-gray-50 font-semibold text-center placeholder:text-[#00006A] border border-[#00006A] text-gray-900 text-xs rounded-lg block w-[30%] p-1.5 md:p-2.5"
                        placeholder="Totals"
                      >
                        {data.length}
                      </div>
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