import React, { useEffect, useState } from 'react'
import UserDataTable from '../components/UserDatatable/UserDataTable'
import { allUserAssetsColumns } from '../utils/datatablesource'
import userRequest from "../utils/userRequest"

const TableShipmentReceiveCl = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
       const getAllAssetsList = async () => {
         try {
   
           userRequest.post("/getShipmentDataFromtShipmentReceivingCL", {
             SHIPMENTID: "BSP-0001008",
             CONTAINERID: "1"
           })
             .then(response => {
               // response.data == "no data available" ? setData([]) : setData(response.data);
               console.log(response?.data);
               setData(response?.data ?? [])
   
         })
         .catch(error => {
           // handleUserError(error)
           console.error(error);
         });
   
         }
         catch (error) {
           console.log(error);
         }
       };
       getAllAssetsList();
     }, []);

  return (
    <div>
        <UserDataTable data={data} title="SHIPMENT RECEIVING CL" columnsName={allUserAssetsColumns} backButton={true} nextButton={true} shipment={true} shipmentCl={true}/>
    </div>
  )
}

export default TableShipmentReceiveCl