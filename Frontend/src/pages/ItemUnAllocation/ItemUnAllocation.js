import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./ItemUnAllocation.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const ItemUnAllocation = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('')) || []);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  useEffect(() => {
    userRequest.get('/getAllItemsReAllocationPicked')
       .then((response) => {
            setData(response.data)
            console.log(response.data)
            setIsLoading(false)
       })
       .catch((error) => {
        console.log(error)
        setIsLoading(false)

       })
  },[])


  const handleRowClick = (item, index) => {
    // save data in session storage

    // sessionStorage.setItem('PickingRowData', JSON.stringify(item));
    sessionStorage.setItem('ItemUnAllocation', JSON.stringify(item));
    sessionStorage.setItem('ItemAllocation', index);
    // sessionStorage.setItem('PickingRowIndex', index);
    navigate('/secondItemunallocation')
  }


  return (
    <>
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


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

                <h2 className='text-center text-[#fff]'>Un-Allocation Items</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>
           
            <div className='mt-6'>
              <label className='text-[#00006A] font-semibold'>List of Items<span className='text-[#FF0404]'>*</span></label>
              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ItemCode</th>
                      <th>ItemDesc</th>
                      <th>GTIN</th>
                      <th>Remarks</th>
                      <th>User</th>
                      <th>Classification</th>
                      <th>MainLocation</th>
                      <th>BinLocation</th>
                      <th>IntCode</th>
                      <th>ItemSerialNo</th>
                      <th>MapDate</th>
                      <th>PalletCode</th>
                      <th>Reference</th>
                      <th>SID</th>
                      <th>CID</th>
                      <th>PO</th>
                      <th>Trans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} onClick={() => handleRowClick(item, index)}
                      >
                        <td>{item.ItemCode}</td>
                        <td>{item.ItemDesc}</td>
                        <td>{item.GTIN}</td>
                        <td>{item.Remarks}</td>
                        <td>{item.User}</td>
                        <td>{item.Classification}</td>
                        <td>{item.MainLocation}</td>
                        <td>{item.BinLocation}</td>
                        <td>{item.IntCode}</td>
                        <td>{item.ItemSerialNo}</td>
                        <td>{item.MapDate}</td>
                        <td>{item.PalletCode}</td>
                        <td>{item.Reference}</td>
                        <td>{item.SID}</td>
                        <td>{item.CID}</td>
                        <td>{item.PO}</td>
                        <td>{item.Trans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>

              <div className='mt-6'>
                <div className='w-full flex justify-between place-items-end'>
                  <div>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                    <input
                      id="totals"
                      className="bg-gray-50 font-semibold text-center placeholder:text-[#00006A] border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Totals"
                      value={data.length}
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

export default ItemUnAllocation


