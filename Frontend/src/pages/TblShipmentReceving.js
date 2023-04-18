import React from 'react'
import UserDataTable from '../components/UserDatatable/UserDataTable'
import { allUserAssetsColumns } from '../utils/datatablesource'
// import userRequest from "../utils/userRequest";


const FirstTable = () => {
  return (
    <div>
        <UserDataTable title="SHIPMENT RECEIVING" columnsName={allUserAssetsColumns} backButton={true} shipment={true}/>
    </div>
  )
}

export default FirstTable