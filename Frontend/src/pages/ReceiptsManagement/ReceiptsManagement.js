import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import accept from "../../images/success.png"
import userRequest from "../../utils/userRequest"
import "./ReceiptsManagement.css";
import Swal from 'sweetalert2';
import { ReceiptsContext } from '../../contexts/ReceiptsContext';
import UserDataTable from '../../components/UserDatatable/UserDataTable';
import { TblShipmentReceivedClColumn } from '../../utils/datatablesource';
import DashboardTable from '../../components/AlessaDashboardTable/DashboardTable';


const ReceiptsManagement = () => {
  const navigate = useNavigate();
  const { statedata, updateData } = useContext(ReceiptsContext);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [shipmentTag, setShipmentTag] = useState('');

  const handleRowClick = (rowData, index) => {
    setSelectedRowIndex(index);
    
    setSelectedRow(rowData);
    updateData(rowData); // update context data
  };

  // useEffect(() => {
  //   console.log('Updated data:', statedata);
  // }, [statedata]);



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
      })

      .catch(error => {
        console.error(error);

      });
  }


  useEffect(() => {

  }, []);



  const handleNextBtnClick = () => {

    navigate('/receiptsecond')
  }
  //   }
  return (
    <>

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-200 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-6 rounded-lg">
            <div className="w-full flex justify-center text-black font-semibold text-xl mb:2 md:mb-5">
              Receipts Management
            </div>
            <form onSubmit={handleForm}>
              <div className="mt-6 md:mt-10 flex justify-between items-center w-full text-sm md:text-xl py-2 rounded-md">
                <label htmlFor="total" className="block text-xs font-medium text-black">SHIPMENT ID</label>
                <input
                  id="total"
                  onChange={handleChangeValue}
                  placeholder='Enter Shipment ID'
                  className="bg-white border border-gray-300 text-gray-900 text-xs font-bold tracking-wider rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[70%] p-1.5 md:p-2.5 "
                />

                <button
                  type='submit'
                  className="bg-[#e69138] hover:bg-[#efae68] text-white font-medium py-1 px-6 rounded-sm w-[15%]">
                  <span className='flex justify-center items-center'>
                    <p>Click</p>
                    {/* <img src={accept} className='h-6 w-9' alt='' /> */}
                  </span>
                </button>

              </div>

              <div className="mb-6">
                {/* <label className="block mb-2 text-xs font-medium text-black">Receipts Management</label> */}

                {/* // creae excel like Tables  */}
                {/* <div className="table-location-generate">
                  <table>
                    <thead>
                      <tr>
                        <th>SHIPMENTSTATUS</th>
                        <th>ENTITY</th>
                        <th>CONTAINERID</th>
                        <th>ARRIVALWAREHOUSE</th>
                        <th>ITEMNAME</th>
                        <th>QTY</th>
                        <th>ITEMID</th>
                        <th>PURCHID</th>
                        <th>CLASSIFICATION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 &&
                        data.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              onClick={() => handleRowClick(item, index)}
                              style={{ backgroundColor: selectedRowIndex === index && 'orange' }}
                            >
                              <td>{item.SHIPMENTSTATUS}</td>
                              <td>{item.ENTITY}</td>
                              <td>{item.CONTAINERID}</td>
                              <td>{item.ARRIVALWAREHOUSE}</td>
                              <td>{item.ITEMNAME}</td>
                              <td>{item.QTY}</td>
                              <td>{item.ITEMID}</td>
                              <td>{item.PURCHID}</td>
                              <td>{item.CLASSIFICATION}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div> */}

                <DashboardTable data={data} title={"Receipts Management"} columnsName={TblShipmentReceivedClColumn}
                  uniqueId="receiptsManagement"

                />
              </div >

              <div className="mb-6">
                <span
                  onClick={handleNextBtnClick}
                >
                  {/* <button
                    className="bg-gray-300 hover:bg-gray-400 border border-gray-300 font-bold tracking-wider text-gray-900 text-xs rounded-lg block w-full p-1.5 md:p-2.5 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    Next Screen
                  </button> */}
                </span>

              </div>
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

export default ReceiptsManagement