import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./ReturnRMA.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const ReturnRMA = () => {
  const navigate = useNavigate();


  const [transferTag, setTransferTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('')) || []);
  const [journalRowIndex, setJournalRowIndex] = useState(JSON.parse(sessionStorage.getItem('PickingRowIndex')) || '');
  const [binlocation, setBinLocation] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [currentUser, setCurrentUser] = useState(initialUser);

  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };


  const handleChangeValue = (e) => {
    setTransferTag(e.target.value);
  }

  const handleForm = (e) => {
    e.preventDefault();
    setIsLoading(true)

    // userRequest.get(`/getAllWmsSalesPickingListClFromWBSByPickingRouteId?PICKINGROUTEID=${transferTag}`)
    userRequest.get(`/getWmsReturnSalesOrderByReturnItemNum?RETURNITEMNUM=${transferTag}`)
      .then(response => {
        console.log(response?.data);

        setData(response?.data ?? []);
        // sessionStorage.setItem('allJournalRows', JSON.stringify(response?.data ?? []));
        sessionStorage.setItem('rmaRows', JSON.stringify(response?.data ?? []));
        setIsLoading(false)
        setMessage(response?.data?.message ?? 'Show All data');

      })

      .catch(error => {
        console.error(error);
        setIsLoading(false)
        setError(error?.response?.data?.message ?? 'Wrong Route ID');

      });

  }

  const handleRowClick = (item, index) => {
    // save data in session storage

    // sessionStorage.setItem('PickingRowData', JSON.stringify(item));
    sessionStorage.setItem('RmaRowData', JSON.stringify(item));
    sessionStorage.setItem('RmaRowIndex', index);
    // sessionStorage.setItem('PickingRowIndex', index);
    navigate('/rmalastform')
  }


  const handleBinLocation = (e) => {
    e.preventDefault();
    console.log(data[0].BinLocation)
    console.log(binlocation)

    userRequest.put('/updateTblMappedBarcodeBinLocation', {}, {
      headers: {
        'oldbinlocation': data[0].BinLocation,
        'newbinlocation': binlocation
      }
    })
      .then((response) => {
        console.log(response);
        setMessage(response?.data?.message);
        // alert('done')
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.message);
        // alert(error)
      });
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
        <div className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-center text-[#fff]'>Return RMA Screen</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>

            <div className=''>
              <h2 className='text-[#00006A] text-center font-semibold'>Current Logged in User ID:<span className='text-[#FF0404]' style={{ "marginLeft": "5px" }}>{currentUser?.UserID}</span></h2>
            </div>

            <form onSubmit={handleForm}>
              <div className='mb-6'>
                <label htmlFor='rma' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">RMA<span className='text-[#FF0404]'>*</span></label>
                <div className='w-full flex'>
                  <input
                    id="rma"
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                    placeholder="RMA"
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
              <label className='text-[#00006A] font-semibold'>List of Items on RMA<span className='text-[#FF0404]'>*</span></label>
              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ITEMID</th>
                      <th>NAME</th>
                      <th>EXPECTEDRETQTY</th>
                      <th>SALESID</th>
                      <th>RETURNITEMNUM</th>
                      <th>INVENTSITEID</th>
                      <th>INVENTLOCATIONID</th>
                      <th>CONFIGID</th>
                      <th>WMSLOCATIONID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} onClick={() => handleRowClick(item, index)}

                        style={journalRowIndex == index ? { backgroundColor: '#F98E1A' } : {}}

                      >
                        <td>{item.ITEMID}</td>
                        <td>{item.NAME}</td>
                        <td>{item.EXPECTEDRETQTY}</td>
                        <td>{item.SALESID}</td>
                        <td>{item.RETURNITEMNUM}</td>
                        <td>{item.INVENTSITEID}</td>
                        <td>{item.INVENTLOCATIONID}</td>
                        <td>{item.CONFIGID}</td>
                        <td>{item.WMSLOCATIONID}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>

            <form >


              <div className='mt-6'>
                <div className='w-full flex justify-between place-items-end'>
                  {/* <div>
                  <button
                    type='submit'
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-full'>
                    <span className='flex justify-center items-center'>
                      <p>Save</p>
                    </span>
                  </button>
                  </div> */}

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
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReturnRMA


