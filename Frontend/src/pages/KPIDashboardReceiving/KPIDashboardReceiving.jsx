import React, { useEffect, useState } from 'react'
import "./KPIDashboardReceiving.css"
import userRequest from '../../utils/userRequest'
import DashboardTable from '../../components/AlessaDashboardTable/DashboardTable'
import { ExpectedReceiptsColumn, InternalTransferColumn, TblDispatchingCLColumn, allUserAssetsColumns } from '../../utils/datatablesource'
import expected from "../../images/expected.png"
import shipment from "../../images/shipment.png"
import transfer from "../../images/transfer.png"
import items from "../../images/items.png"



// Step 2 - Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";
// Step 3 - Include the fusioncharts library
import FusionCharts from "fusioncharts";
// Step 4 - Include the chart type
import Components from "fusioncharts/fusioncharts.charts";
// Step 5 - Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ItemsChart from '../../components/Charts/ItemsChart'
import DailyReceiptsChart from '../../components/Charts/DailyReceiptsChart'
import TotalShipment from '../../components/Charts/TotalShipment'
import ShipementReceivedChart from '../../components/Charts/ShipmentReceivedChart'
// Step 6 - Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Components, FusionTheme);


const KPIDashboardRece = () => {
  const [newExpectedReceipts, setNewExpectedReceipts] = useState([]);
  const [newExpectedShipments, setNewExpectedShipments] = useState([]);
  const [newItemsDispatch, setNewItemsDispatch] = useState([]);
  const [newTransferOrder, setNewTransferOrder] = useState([]);

  useEffect(() => {

    const getAllAssetsList = async () => {
      try {

      userRequest.get("/getAllExpectedShipments")
        .then(response => {
          setNewExpectedReceipts(response.data)
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

      userRequest.get("/getAllExpectedTransferOrder")
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
},[])
  return (
    <div>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white text-black dark:text-white">

        <div className="h-full mb-10">

          {/* <!-- Statistics Cards --> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <img src={expected} className='' alt='' />
              </div>
              <div className="text-right">
                <span>{newExpectedReceipts.length > 0 ? newExpectedReceipts.length : null}</span>
                <p>Daily Receipts</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                {/* <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> */}
                <img src={shipment} className='' alt='' />
              </div>
              <div className="text-right">
                <span>{newExpectedShipments.length > 0 ? newExpectedShipments.length : null}</span>
                <p>Total Shipments</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <img src={items} className='' alt='' />
              </div>
              <div className="text-right">
                <span>{newItemsDispatch.length > 0 ? newItemsDispatch.length : null}</span>
                <p>Total Items</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
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
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
                <DailyReceiptsChart ReactFC={ReactFC}/>
            </div>

             {/* <!-- Social Traffic2 --> */}
             <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
                <TotalShipment ReactFC={ReactFC}/>
            </div>

            {/* <!-- Social Traffic2 --> */}
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
                <ItemsChart ReactFC={ReactFC}/>
               {/* <DashboardTable data={newItemsDispatch} columnsName={TblDispatchingCLColumn} title={"Items Dispatch"} UniqueId="assetPrintingId"/> */}
            </div>

            {/* <!-- Social Traffic2 --> */}
            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
               <ShipementReceivedChart ReactFC={ReactFC}/>
               {/* <DashboardTable data={newTransferOrder} columnsName={InternalTransferColumn} title={"Internal Transfer"} UniqueId="assetPrintingId"/> */}
            </div>

          </div>

        </div>
      </div>
    </div>

    // </div>
  )
}

export default KPIDashboardRece