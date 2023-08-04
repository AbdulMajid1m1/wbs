import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { TblShipmentReceivedClColumn } from '../../utils/datatablesource'
// import userRequest from "../utils/userRequest";
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';


const TblShipmentReceivedCl = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };



  useEffect(() => {
    const getAllAssetsList = async () => {
      try {
        const response = await userRequest.get("/getAllTblShipmentReceivedCL");
        console.log(response?.data);
        setData(response?.data ?? []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setError(error?.response?.data?.message ?? "Something went wrong");
      }
    };

    getAllAssetsList();
  }, []);

  return (
    <div>


      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


      {/* <SideBar2 /> */}
      <UserDataTable data={data} title="SHIPMENT RECEIVED (Warehouse Operation)" columnsName={TblShipmentReceivedClColumn}
        backButton={true}
        uniqueId="SERIALNUM"
        addNewNavigation="/receipts"
        ShipmentIdSearchEnable={true}
        actionColumnVisibility={true}
        emailButton={true}
        printButton={true}
        PrintName={"Print Shipment"}
        loading={isLoading}
        setIsLoading={setIsLoading}

      />


    </div>
  )
}

export default TblShipmentReceivedCl