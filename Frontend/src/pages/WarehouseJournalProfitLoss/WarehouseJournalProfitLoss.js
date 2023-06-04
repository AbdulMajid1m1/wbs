import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { WarehouseProfitLostColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const WarehouseJournalProfitLost = () => {
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

                userRequest.get("/getAllWmsJournalProfitLostCL")
                    .then(response => {
                        console.log(response?.data);
                        setData(response?.data ?? [])
                        setIsLoading(false)

                    })
                    .catch(error => {
                        // handleUserError(error)
                        console.error(error);
                        setIsLoading(false)
                        setError(error?.response?.data?.error)
                    });

            }
            catch (error) {
                console.log(error);
            }
        };
        getAllAssetsList();

        const getAllJournalProfitLosssCLDets = async () => {
            try {
                userRequest.get("/getAllWmsJournalProfitLostClDets")
                    .then(response => {
                        console.log(response?.data);

                        setSecondGridData(response?.data ?? [])
                        setFilteredData(response?.data ?? [])


                    })
                    .catch(error => {
                        console.error(error);
                        setError(error?.response?.data?.error)

                    });

            }
            catch (error) {
                console.log(error);
            }
        };
        getAllJournalProfitLosssCLDets();
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

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


            <UserDataTable data={data} title="Warehouse ProfitLostCL (Warehouse Operation)" columnsName={WarehouseProfitLostColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                checkboxSelection={'disabled'}
                uniqueId={"wProfitLostClId"}
                handleRowClickInParent={handleRowClickInParent}

            />
            <div
                style={{ height: '40px' }}
            ></div>

            <UserDataTable data={filteredData} title="Warehouse ProfitLostCLDets" columnsName={WarehouseProfitLostColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                uniqueId={"wProfitLostClDetsId"}
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

export default WarehouseJournalProfitLost