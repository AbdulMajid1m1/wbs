import React from 'react'
import UserDataTable from '../components/UserDatatable/UserDataTable'
import { allUserAssetsColumns } from '../utils/datatablesource'

const TableShipmentReceiveCl = () => {
  return (
    <div>
        <UserDataTable title="SHIPMENT RECEIVING CL" columnsName={allUserAssetsColumns} backButton="Back"/>
    </div>
  )
}

export default TableShipmentReceiveCl