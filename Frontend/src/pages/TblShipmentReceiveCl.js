import React from 'react'
import UserDataTable from '../components/UserDatatable/UserDataTable'
import { allUserAssetsColumns } from '../utils/datatablesource'

const TableShipmentReceiveCl = () => {
  return (
    <div>
        <UserDataTable title="SHIPMENT RECEIVING CL" columnsName={allUserAssetsColumns} backButton={true} shipment={true} shipmentCl={true}/>
    </div>
  )
}

export default TableShipmentReceiveCl