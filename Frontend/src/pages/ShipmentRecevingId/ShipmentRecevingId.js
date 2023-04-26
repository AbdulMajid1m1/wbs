import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { allUserAssetsColumns } from '../../utils/datatablesource'
// import userRequest from "../utils/userRequest";
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import SideBar from '../../components/SideBar/SideBar';


const ShipmentRecevingId = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllAssetsList = async () => {
      try {

        userRequest.get("/getAllShipmentDataFromtShipmentReceiving")
          // userRequest.post("/getShipmentDataFromtShipmentReceiving", {
          //   SHIPMENTID: "BSP-0001008",
          //   CONTAINERID: "1"
          // })
          .then(response => {
            // response.data == "no data available" ? setData([]) : setData(response.data);
            console.log(response?.data);
            setData(response?.data ?? [])
            setIsLoading(false)

          })
          .catch(error => {
            // handleUserError(error)
            console.error(error);
            setIsLoading(false)
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
  
      <UserDataTable data={data} title="SHIPMENT RECEIVING" columnsName={allUserAssetsColumns}
       backButton={true}
        uniqueId="SHIPMENTID"
        addNewNavigation="/addNew"
        ShipmentIdSearchEnable={true}
        ContainerIdSearchEnable={true}

       />


       
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

    </div>
  )
}

export default ShipmentRecevingId