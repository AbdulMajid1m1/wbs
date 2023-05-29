import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { JournalProfitLostColumn, ReturnSalesOrderColumn, WarehouseJournalCountingColumn, WarehouseProfitLostColumn, WarehouseWmsInventoryColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import axios from 'axios'
import { SyncLoader } from 'react-spinners';

const WarehouseWmsInventory = () => {
    const [data, setData] = useState([]);
    const [secondGridData, setSecondGridData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const getAllAssetsList = async () => {
            try {

                userRequest.get("/getAllWmsJournalCountingCL")
                    .then(response => {
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
        const getAllWmsJournalCountingCLDets = async () => {
            try {

                userRequest.get("/getAllWmsJournalCountingCLDets")
                    .then(response => {
                        console.log(response?.data);

                        setSecondGridData(response?.data ?? [])
                        setFilteredData(response?.data ?? [])

                    })
                    .catch(error => {
                        console.error(error);

                    });

            }
            catch (error) {
                console.log(error);
            }
        };
        getAllWmsJournalCountingCLDets();
    }, []);

    const handleRowClickInParent = (item) => {
        console.log(item);
        // filter data for second grid using item.ITEMID and JOURNALMOVEMENTCLID
        const filteredData = secondGridData.filter((data) => {
            return data.ITEMID === item.ITEMID && data.JOURNALID === item.JOURNALID && data.TRXUSERIDASSIGNED === item.TRXUSERIDASSIGNED
        })
        console.log(filteredData);
        setFilteredData(filteredData)
    }

    return (
        <div>

            <UserDataTable data={data} title="Wms Inventory (Warehouse Operation)" columnsName={WarehouseWmsInventoryColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                uniqueId={'wmsInventoryClId'}
                checkboxSelection={'disabled'}
                handleRowClickInParent={handleRowClickInParent}

            />

            <div
                style={{ height: '40px' }}
            ></div>

            <UserDataTable data={filteredData} title="Wms Inventory " columnsName={WarehouseWmsInventoryColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                uniqueId={'wmsInventoryClDetsId'}

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

export default WarehouseWmsInventory