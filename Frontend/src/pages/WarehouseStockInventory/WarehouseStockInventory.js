import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { WarehouseStockInventoryColumn, WarehouseStockInventoryLocationColumn, WarehouseWmsInventoryColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';


const WarehouseStockInventory = () => {
    const [data, setData] = useState([]);
    const [secondGridData, setSecondGridData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
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

                userRequest.get("/getAlltblStockInventory")
                    .then(response => {
                        console.log(response?.data);
                        setData(response?.data ?? [])
                        setIsLoading(false)

                    })
                    .catch(error => {
                        console.error(error);
                        setIsLoading(false)
                        setError(error?.response?.data?.message ?? "Something went wrong")
                    });

            }
            catch (error) {
                console.log(error);
            }
        };
        getAllAssetsList();
        const getAllWmsJournalCountingCLDets = async () => {
            try {

                userRequest.get("/getAlltbltblStockInventoryLocation")
                    .then(response => {
                        console.log(response?.data);

                        setSecondGridData(response?.data ?? [])
                        setFilteredData(response?.data ?? [])

                    })
                    .catch(error => {
                        console.error(error); 
                        setError(error?.response?.data?.message ?? "Something went wrong")
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
            // return data.ITEMID === item.ITEMID && data.JOURNALID === item.JOURNALID && data.TRXUSERIDASSIGNED === item.TRXUSERIDASSIGNED
            return data.ITEMID === item.ITEMID 
        })
        console.log(filteredData);
        setFilteredData(filteredData)
    }

    return (
        <div>

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


            <UserDataTable data={data} title="STOCK INVENTORY ( Warehouse Operation )" 
                columnsName={WarehouseStockInventoryColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                uniqueId={'wmsInventoryClId'}
                checkboxSelection={'disabled'}
                handleRowClickInParent={handleRowClickInParent}
                loading={isLoading}
                setIsLoading={setIsLoading}
             
            />

            <div
                style={{ height: '40px' }}
            ></div>

            <UserDataTable data={filteredData} title="STOCK INVENTORY LOCATIONS ( Warehouse Operation )" 
                columnsName={WarehouseStockInventoryLocationColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                uniqueId={'wmsInventoryClDetsId'}
                loading={isLoading}
                setIsLoading={setIsLoading}
             
            />

            {/* {isLoading &&

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
            } */}

        </div>
    )
}

export default WarehouseStockInventory