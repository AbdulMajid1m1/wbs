import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { PackingSlipTableColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import axios from 'axios'
import { SyncLoader } from 'react-spinners';

const AllItemsDispatch = () => {
    const [alldata, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const getAllAssetsList = async () => {
            try {

                // userRequest.get("/getAllTblDispatchingData")
                userRequest.get("/getAllPackingSlips")
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
    }, []);

    return (
        <div>

            {/* <SideBar /> */}
            {/* <SideBar2 /> */}

            <UserDataTable data={alldata} title="Items For Dispatch" columnsName={PackingSlipTableColumn} backButton={true}
                actionColumnVisibility={false}
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

export default AllItemsDispatch