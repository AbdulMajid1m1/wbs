import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { PickListColumn, PicklistAssignedColumn, SalesPickingListColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import axios from 'axios'
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const PicklistAssigned = () => {
    const [alldata, setAllData] = useState([]);
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

                userRequest.get("/getAllWmsSalesPickingListClFromAlessia")
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
    }, []);

    return (
        <div>

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

            <UserDataTable data={alldata} title="Pick List" columnsName={PicklistAssignedColumn}
                backButton={true}
                uniqueId="pickingSlipId"
                addNewNavigation="/pickinglistfrom"
                AddUser={true}
                UserName="Assign picklist"
                loading={isLoading}
                setIsLoading={setIsLoading}
                ExpectedStatusSearchEnable={true}

            />


        </div>
    )
}

export default PicklistAssigned

