import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import userRequest from "../../utils/userRequest"
import "./PickingListForm.css";
// import { ReceiptsContext } from '../../contexts/ReceiptsContext';
import { TblReceiptsManagementColumn } from '../../utils/datatablesource';
import PickingListTable from '../../components/PickingListTable/PickingListTable';


const Pickinglistform = () => {

  const navigate = useNavigate();
  const [data , setData] = useState([]);
//   const { statedata, updateData } = useContext(ReceiptsContext);
  const [shipmentTag, setShipmentTag] = useState('');
//   const [data, setData] = useState(
//     JSON.parse(sessionStorage.getItem('receiptsData')) ?? []

//   );
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  const handleRowClick = (rowData, index) => {
    setSelectedRowIndex(index);

    setSelectedRow(rowData);
    // updateData(rowData); // update context data
  };

//   useEffect(() => {
//     console.log('Updated data:', statedata);
//   }, [statedata]);



  const handleChangeValue = (e) => {
    setShipmentTag(e.target.value);
  }

  const handleForm = (e) => {
    e.preventDefault();

    userRequest.post(`/getShipmentDataFromtShipmentReceiving?SHIPMENTID=${shipmentTag}`)
      .then(response => {
        console.log(response?.data);

        setData(response?.data ?? []);
        setSelectedRow(response?.data[0] ?? []);
        // save data in session storage
        sessionStorage.setItem('receiptsData', JSON.stringify(response?.data ?? []));
     
      })

      .catch(error => {
        console.error(error);

      });
  }



  return (
    <>

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-300 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-6 rounded-lg">
            <div className="w-full flex justify-center text-black font-semibold text-xl mb:2 md:mb-5">
              Picking List Form
            </div>
              <button onClick={() => navigate(-1)} className='w-[15%] rounded-sm text-[#fff] bg-[#e69138]'>
                  Back
              </button>
            <form onSubmit={handleForm}>
            {/* <form> */}
              <div className="mt-6 md:mt-10 flex justify-between items-center w-full text-sm md:text-xl py-2 rounded-md">
                <label htmlFor="total" className="block text-xs font-medium text-black">Route ID</label>
                <input
                  id="total"
                  onChange={handleChangeValue}
                  placeholder='Route ID'
                  className="bg-white border border-gray-300 text-gray-900 text-xs font-bold tracking-wider rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[70%] p-1.5 md:p-2.5 "
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

              <div className="mb-6">

                <PickingListTable data={data} title={"Items"} columnsName={TblReceiptsManagementColumn}
                  uniqueId=""

                />
              </div >


              <div className='flex justify-end items-center gap-3'>
                <label htmlFor="total" className="block ml-8 text-xs font-medium text-black">TOTALS</label>
                <input
                  id="total"
                  value={data.length}
                  className="bg-gray-50 border text-center border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[15%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </form >
          </div >
        </div >
      </div >
    </>
  )
}

export default Pickinglistform