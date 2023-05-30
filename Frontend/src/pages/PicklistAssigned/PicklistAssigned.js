import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { PickListColumn, PicklistAssignedColumn, SalesPickingListColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import axios from 'axios'
import { SyncLoader } from 'react-spinners';

const PicklistAssigned = () => {
    const [alldata, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const getAllAssetsList = async () => {
            try {

                userRequest.get("/getAllWmsSalesPickingListClFromAlessia")
                    .then(response => {
                        // response.data == "no data available" ? setAllData([]) : setAllData(response.data);
                        console.log(response?.data);

                        setAllData(response?.data ?? [])
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
    }, []);

    return (
        <div>

D
            <UserDataTable data={alldata} title="Pick List" columnsName={PicklistAssignedColumn}
                backButton={true}
                uniqueId="pickingSlipId"
                addNewNavigation="/pickinglistfrom"
                AddUser={true}
                UserName="Assign picklist"
            />
            {/* <UserDataTable data={alldata} title="" columnsName={PicklistAssignedColumn} backButton={true} uniqueId="itemTableId"
                actionColumnVisibility={false}
                buttonVisibility={false}
            /> */}

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

export default PicklistAssigned