import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { AllItems, WarehouseMovementColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import axios from 'axios'
import { SyncLoader } from 'react-spinners';
// import SideBar from '../../components/SideBar/SideBar'
import SideBar2 from '../../components/SideBar/SideBar2'

const WarehouseMovement = () => {
    const [alldata, setAllData] = useState([]);
    const [secondGridData, setSecondGridData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


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
                        setIsLoading(false)

                    })
                    .catch(error => {
                        console.error(error);
                        setIsLoading(false)

                    });

            }
            catch (error) {
                console.log(error);
            }
        };
        getAllJournalMovementCLDets();
    }, []);

    const handleJournalMovementClRowClick = (item) => {
        console.log(item);
        // filter data for second grid using item.ITEMID and JOURNALMOVEMENTCLID
        const filteredData = secondGridData.filter((data) => {
            return data.ITEMID === item.ITEMID && data.JOURNALID === item.JOURNALID
        })
        console.log(filteredData);
        setSecondGridData(filteredData)
    }

    return (
        <div>


            <UserDataTable data={alldata} title="Journal Movement CL" columnsName={WarehouseMovementColumn} backButton={true}
                actionColumnVisibility={false}
                uniqueId={"journalMovementClId"}
                buttonVisibility={false}
                checkboxSelection={'disabled'}
                handleJournalMovementClRowClick={handleJournalMovementClRowClick}

            />

            <UserDataTable data={secondGridData} title="Journal Movement CLDets " columnsName={WarehouseMovementColumn} backButton={true}
                actionColumnVisibility={false}
                uniqueId={"journalMovementClDetId"}
                // checkboxSelection={true}

                buttonVisibility={false}
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

export default WarehouseMovement