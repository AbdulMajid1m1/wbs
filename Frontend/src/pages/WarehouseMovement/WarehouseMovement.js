import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { AllItems, WarehouseMovementColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const WarehouseMovement = () => {
    const [alldata, setAllData] = useState([]);
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

                userRequest.get("/getAllWmsJournalMovementCl")
                    .then(response => {
                        console.log(response?.data);

                        setAllData(response?.data ?? [])
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
        const getAllJournalMovementCLDets = async () => {
            try {

                userRequest.get("/getAllWmsJournalMovementClDets")
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
        getAllJournalMovementCLDets();
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


            <UserDataTable data={alldata} title="Journal Movement CL (Warehouse Operation)" columnsName={WarehouseMovementColumn} backButton={true}
                actionColumnVisibility={false}
                uniqueId={"journalMovementClId"}
                buttonVisibility={false}
                checkboxSelection={'disabled'}
                handleRowClickInParent={handleRowClickInParent}

            />
            <div
                style={{ height: '40px' }}
            ></div>

            <UserDataTable data={filteredData} title="Journal Movement CLDets " columnsName={WarehouseMovementColumn} backButton={true}
                actionColumnVisibility={false}
                uniqueId={"journalMovementClDetId"}
                // checkboxSelection={true}

                buttonVisibility={false}
            />

            {
                isLoading &&

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

        </div >
    )
}

export default WarehouseMovement