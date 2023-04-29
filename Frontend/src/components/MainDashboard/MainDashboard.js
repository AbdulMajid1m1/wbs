import React, { useEffect, useState } from 'react'
import "./MainDashboard.css"
import alessa from "../../images/alessalogo.png"
import SideBar2 from '../SideBar/SideBar2'
import userRequest from '../../utils/userRequest'
import DashboardTable from '../AlessaDashboardTable/DashboardTable'
import { ExpectedReceiptsColumn, TblDispatchingCLColumn, allUserAssetsColumns } from '../../utils/datatablesource'
// import SideBar from '../SideBar/SideBar'

const MainComponent = () => {
  const [newExpectedReceipts, setNewExpectedReceipts] = useState([]);
  const [newExpectedShipments, setNewExpectedShipments] = useState([]);
  const [newItemsDispatch, setNewItemsDispatch] = useState([]);
  const [newTransferOrder, setNewTransferOrder] = useState([]);

  useEffect(() => {

    const getAllAssetsList = async () => {
      try {

      userRequest.get("/getAllExpectedShipments")
        .then(response => {
          setNewExpectedReceipts([])
        })
        .catch(error => {


          console.error(error);
        });

    }
    catch (error) {
      console.log(error);

    }
  };

  const getAllExpectedShipments = async () => {
    try {

      userRequest.get("/getAllShipmentDataFromtShipmentReceivingCL")
        .then(response => {
            console.log(response.data)
            setNewExpectedShipments(response.data)
        })
        .catch(error => {
          

          console.error(error);
        });
        
    }
    catch (error) {
      console.log(error);

    }
  };

  const getNewItemsDispatch = async () => {
    try {

      userRequest.get("/getAllTblDispatchingData")
        .then(response => {
          response.data == "no data available" ? setNewItemsDispatch([]) : setNewItemsDispatch(response.data);
        })
        .catch(error => {
          
          // setError(error?.response?.data?.message ?? "Something went wrong");

          console.error(error);
        });
        
    }
    catch (error) {
      console.log(error);

    }
  };

  const getNewTransferOrder = async () => {
    try {

      userRequest.get("/getAllExpectedTransferOrder")
        .then(response => {
          response.data == "no data available" ? setNewTransferOrder([]) : setNewTransferOrder(response.data);
        })
        .catch(error => {
          
          // setError(error?.response?.data?.message ?? "Something went wrong");

          console.error(error);
        });
        
    }
    catch (error) {
      console.log(error);

    }
  };

  getAllAssetsList();
  getAllExpectedShipments();
  getNewItemsDispatch();
  getNewTransferOrder();
},[])
  return (
    <div>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white">

        <div className="h-full mb-10">

          {/* <!-- Statistics Cards --> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <div className="text-right">
                <span>{newExpectedReceipts.length > 0 ? newExpectedReceipts.length : null}</span>
                <p>Expected Receipts</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <div className="text-right">
                <span>{newExpectedShipments.length > 0 ? newExpectedShipments.length : null}</span>
                <p>Expected Shipments</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <div className="text-right">
                <span>{newItemsDispatch.length > 0 ? newItemsDispatch.length : null}</span>
                <p>Items For Dispatch</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="text-right">
                <span>{newTransferOrder.length > 0 ? newTransferOrder.length : null}</span>
                <p>Transfer Orders</p>
              </div>
            </div>
          </div>
          {/* <!-- ./Statistics Cards --> */}

          <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 ">

            {/* <!-- Social Traffic --> */}
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
                  {/* <DashboardTable data={newExpectedReceipts} columnsName={ExpectedReceiptsColumn} title={"Expacted Receipts"} UniqueId="assetPrintingId"/> */}
            </div>

             {/* <!-- Social Traffic2 --> */}
             <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
               <DashboardTable data={newExpectedShipments} columnsName={allUserAssetsColumns} title={"Expacted Shipments"} UniqueId="assetPrintingId"/>
            </div>

            {/* <!-- Social Traffic2 --> */}
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
               {/* <DashboardTable data={newExpectedShipments} columnsName={allUserAssetsColumns} title={"Expacted Shipments"} UniqueId="assetPrintingId"/> */}
            </div>

          </div>

        </div>
      </div>
    </div>

    // </div>
  )
}

export default MainComponent