import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import userRequest from "../../utils/userRequest"
import { TblPackingSlipTableColumn } from '../../utils/datatablesource';
import DispatchingPickingSlipTable from '../../components/DispatchingPickingTable/DispatchingPickingTable';
import CustomSnakebar from '../../utils/CustomSnakebar';


const DispatchingPickingSlip = () => {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [packingSlipData, setPackingSlipData] = useState('');
  const [vehicleBarcode, setVehicleBarcode] = useState('');
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

    userRequest.get(`/getPackingSlipTableByPackingSlipId?packingSlipId=${packingSlipData}`)
      .then(response => {
        console.log(response?.data);
        setData(response?.data ?? []);
      })

      .catch(error => {
        console.error(error);

      });
  }

  const handleSaveBtnClick = async () => {

    console.log(data);
    try {


      // const res = await userRequest.post(`/insertTblDispatchingDataCL?vehicleShipPlateNumber=${vehicleBarcode}`,
      //   data)

      let apiData = data.map((item) => {
        return {
          ...item,
          VEHICLESHIPPLATENUMBER: vehicleBarcode
        }
      })

      const res = await userRequest.post(`/insertTblDispatchingDataCL`,
        apiData)

      console.log(res?.data);
      setMessage(res?.data?.message ?? "Data Saved Successfully");

      // clear the data
      setData([]);
      setVehicleBarcode('');
      setPackingSlipData('');


    }

    catch (error) {
      console.error(error);
      setError(error?.response?.data?.message ?? "Something went wrong");
    }
  }




  return (
    <>
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
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

            <div className="mb-6">

              <DispatchingPickingSlipTable
                data={data}
                title={"Dispatching Picking Slip"}
                columnsName={TblPackingSlipTableColumn}
                uniqueId="" />
            </div >


            <div className='flex justify-end items-center gap-3'>
              <label htmlFor="total" className="block ml-8 text-xs font-medium text-black">TOTALS</label>
              <input
                id="total"
                value={data.length}
                className="bg-gray-50 border text-center border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[15%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor='barcode' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Vehicle Barcode Serial #(Vehicle Plate#)<span className='text-[#FF0404]'>*</span></label>
              <input
                id="barcode"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Vehicle Barcode"
                value={vehicleBarcode}
                onChange={(e) => setVehicleBarcode(e.target.value)}
              />
            </div >

            <div className='mb-6'>
              <button
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[25%]'>
                <span className='flex justify-center items-center'
                  onClick={handleSaveBtnClick}
                >
                  <p>Save</p>
                </span>
              </button>
            </div>


          </div >
        </div >
      </div >
    </>
  )
}

export default DispatchingPickingSlip