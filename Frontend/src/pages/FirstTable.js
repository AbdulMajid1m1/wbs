import React from 'react'
import UserDataTable from '../components/UserDatatable/UserDataTable'
import { allUserAssetsColumns } from '../utils/datatablesource'
// import userRequest from "../utils/userRequest";


const FirstTable = () => {
  return (
    <div>
        <UserDataTable title="TABLE SHIPMENT RECEIVING" columnsName={allUserAssetsColumns} backButton="Back"/>
    </div>
  )
}

export default FirstTable