import React, { useEffect, useState } from 'react'
import "./MainDashboard.css"
import alessa from "../../images/alessalogo.png"
import SideBar2 from '../SideBar/SideBar2'
import userRequest from '../../utils/userRequest'
import DashboardTable from '../AlessaDashboardTable/DashboardTable'
import { ExpectedReceiptsColumn, InternalTransferColumn, TblDispatchingCLColumn, allUserAssetsColumns } from '../../utils/datatablesource'
import expected from "../../images/expected.png"
import shipment from "../../images/shipment.png"
import transfer from "../../images/transfer.png"
import items from "../../images/items.png"

const MainComponent = () => {
  const [newExpectedReceipts, setNewExpectedReceipts] = useState([]);
  const [newExpectedShipments, setNewExpectedShipments] = useState([]);
  const [newItemsDispatch, setNewItemsDispatch] = useState([]);
  const [newTransferOrder, setNewTransferOrder] = useState([]);

  useEffect(() => {

    const getAllAssetsList = async () => {
      try {

        const response = await userRequest.get("/getAllExpectedShipments")

        setNewExpectedReceipts(response.data)

      }
      catch (error) {
        console.log(error);

      }
    };

    const getAllExpectedShipments = async () => {
      try {

        // userRequest.get("/getAllShipmentDataFromtShipmentReceivingCL")
        userRequest.get("/getAllShipmentDataFromtShipmentReceiving")
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

        // userRequest.get("/getAllTblDispatchingData")
        userRequest.get("/getAllPackingSlips")
          .then(response => {
            // response.data == "no data available" ? setNewItemsDispatch([]) : setNewItemsDispatch(response.data);
            setNewItemsDispatch(response.data)
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

        // userRequest.get("/getAllExpectedTransferOrder")
        userRequest.get("/getAllTblShipmentPalletizing")
          .then(response => {
            // response.data == "no data available" ? setNewTransferOrder([]) : setNewTransferOrder(response.data);
            setNewTransferOrder(response.data)
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
  }, [])
  return (
    <div>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white text-black dark:text-white">

        <div className="h-full mb-10">

          {/* <!-- Statistics Cards --> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
            <div className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <img src={expected} className='' alt='' />
              </div>
              <div className="text-right">
                <span>{newExpectedReceipts.length > 0 ? newExpectedReceipts.length : null}</span>
                <p>Expected Receipts</p>
              </div>
            </div>
            <div className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                {/* <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> */}
                <img src={shipment} className='' alt='' />
              </div>
              <div className="text-right">
                <span>{newExpectedShipments.length > 0 ? newExpectedShipments.length : null}</span>
                <p>Expected Shipments</p>
              </div>
            </div>
            <div className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <img src={items} className='' alt='' />
              </div>
              <div className="text-right">
                <span>{newItemsDispatch.length > 0 ? newItemsDispatch.length : null}</span>
                <p>Items For Dispatch</p>
              </div>
            </div>
            <div className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <img src={transfer} className='' alt='' />
              </div>
              <div className="text-right">
                <span>{newTransferOrder.length > 0 ? newTransferOrder.length : null}</span>
                <p>Transfer Orders</p>
              </div>
            </div>
          </div>
          {/* <!-- ./Statistics Cards --> */}

          <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 bg-gradient-to-r from-[#5666e2]">
            {/* <!-- Social Traffic --> */}
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 w-full shadow-lg rounded">
              <DashboardTable data={newExpectedReceipts} columnsName={ExpectedReceiptsColumn} title={"Expected Receipts"} UniqueId="assetPrintingId" />
            </div>

            {/* <!-- Social Traffic2 --> */}
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50  w-full shadow-lg rounded">
              <DashboardTable data={newExpectedShipments} columnsName={allUserAssetsColumns} title={"Expected Shipments"} UniqueId="assetPrintingId" />
            </div>

            {/* <!-- Social Traffic2 --> */}
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 w-full shadow-lg rounded">
              <DashboardTable data={newItemsDispatch} columnsName={TblDispatchingCLColumn} title={"Items Dispatch"} UniqueId="assetPrintingId" />
            </div>

            {/* <!-- Social Traffic2 --> */}
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 w-full shadow-lg rounded">
              <DashboardTable data={newTransferOrder} columnsName={InternalTransferColumn} title={"Internal Transfer"} UniqueId="assetPrintingId" />
            </div>

          </div>

        </div>
      </div>
    </div>

    // </div>
  )
}

export default MainComponent