import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import userRequest from "../../utils/userRequest"
import DispatchingPickingSlipTable from '../../components/DispatchingPickingTable/DispatchingPickingTable';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { SyncLoader } from 'react-spinners';

const DispatchingPickingSlip = () => {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [packingSlipData, setPackingSlipData] = useState('');
  // const [vehicleBarcode, setVehicleBarcode] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  const handleChangeValue = (e) => {
    setPackingSlipData(e.target.value);
  }

  const handleForm = (e) => {
    e.preventDefault();
    setIsLoading(true)
    userRequest.get(`/getPackingSlipTableByPackingSlipId?packingSlipId=${packingSlipData}`)
      .then(response => {
        console.log(response?.data);
        setData(response?.data ?? []);
        setIsLoading(false)
      })

      .catch(error => {
        console.error(error);
        setIsLoading(false)
        setError(error?.response?.data?.message ?? "Something went wrong")
        setData([]);

      });
  }


  const handleRowClick = (item, index) => {
    // save data in session storage
    console.log(item);




    sessionStorage.setItem('selectedDispactchingRowData', JSON.stringify(item));


    navigate('/dispatchingslip-step-two')
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
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-300 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-6 rounded-lg">
            <div className="w-full flex justify-center text-black font-semibold text-xl mb:2 md:mb-5">
              Dispatching Form
            </div>
            <button onClick={() => navigate(-1)} className='w-[15%] rounded-sm text-[#fff] bg-[#e69138]'>
              Back
            </button>
            <form onSubmit={handleForm}>
              {/* <form> */}
              <div className="mt-6 md:mt-10 flex justify-between items-center w-full text-sm md:text-xl py-2 rounded-md">
                <label htmlFor="total" className="block text-xs font-medium text-black">PackingSlipID</label>
                <input
                  id="total"
                  onChange={handleChangeValue}
                  placeholder='Packing Slip ID'
                  className="bg-white border border-gray-300 text-gray-900 text-xs font-bold tracking-wider rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[70%] p-1.5 md:p-2.5 "
                  value={packingSlipData}
                />

                <button
                  type='submit'
                  className="bg-[#e69138] hover:bg-[#efae68] text-white font-medium py-1 px-6 rounded-sm w-[15%]">
                  <span className='flex justify-center items-center'>
                    <p>Find</p>
                    {/* <img src={accept} className='h-6 w-9' alt='' /> */}
                  </span>
                </button>

              </div>
            </form >

            {/* <div className="mb-6" style={{ marginLeft: '-20px', marginRight: '-20px' }}>

              <DispatchingPickingSlipTable
                data={data}
                secondaryColor="secondary"
                title={"Dispatching Picking Slip"}
                columnsName={TblPackingSlipTableColumn}
                uniqueId="dispatchingFirstScreen" />
            </div > */}


            <div className='mb-6'>
              <label className='text-[#00006A] font-semibold'>List of Items on Bin<span className='text-[#FF0404]'>*</span></label>
              {/* // create excel-like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      {/* Table header columns */}
                      <th>SALESID</th>
                      <th>ITEMID</th>
                      <th>NAME</th>
                      <th>INVENTLOCATIONID</th>
                      <th>CONFIGID</th>
                      <th>ORDERED</th>
                      <th>PACKINGSLIPID</th>
                      <th>VEHICLESHIPPLATENUMBER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map over the fetched data to render rows */}
                    {data.map((item, index) => (
                      <tr key={index} onClick={() => handleRowClick(item, index)} >
                        {/* Table data cells */}
                        <td>{item.SALESID}</td>
                        <td>{item.ITEMID}</td>
                        <td>{item.NAME}</td>
                        <td>{item.INVENTLOCATIONID}</td>
                        <td>{item.CONFIGID}</td>
                        <td>{item.ORDERED}</td>
                        <td>{item.PACKINGSLIPID}</td>
                        <td>{item.VEHICLESHIPPLATENUMBER}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>




            <div className='flex justify-end items-center gap-3'>
              <label htmlFor="total" className="block ml-8 text-xs font-medium text-black">TOTALS</label>
              <input
                id="total"
                value={data.length}
                className="bg-gray-50 border text-center border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[15%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>



          </div >
        </div >
      </div >
    </>
  )
}

export default DispatchingPickingSlip