import React, { useContext, useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { AllItems } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import axios from 'axios'
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { RefreshContext } from '../../contexts/RefreshContext'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2';



const TblItemCl = () => {
    const [alldata, setAllData] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { refreshLoading, setRefreshLoading } = useContext(RefreshContext);

    const handleRefresh = async () => {
        setRefreshLoading(true);

        try {

            const res = await userRequest.get('/insertDataFromInventTableWmsToStockMaster');
            console.log(res?.data);
            setAllData(res?.data?.stockMasterData ?? [])
        }
        catch (error) {
            console.error(error);
            // setError(error?.response?.data?.message ?? "Something went wrong")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.response?.data?.message ?? "Something went wrong",
            })

        }
        finally {
            setRefreshLoading(false);
        }
    };
    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };



    const { isLoading, error: userQueryError, data } = useQuery({
        queryKey: ['stockMaster'],
        queryFn: () =>
            userRequest.get("/getAllTblStockMaster").then(
                (res) => res.data ?? [],
            ),
    })



    return (
        <div>

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {userQueryError && <CustomSnakebar message={userQueryError.message} severity="error" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


            <UserDataTable data={data || []} addNewNavigation="/itemsnew" title="Stock Master (Warehouse Operation)" columnsName={AllItems} backButton={true}
                Refresh={true}
                uniqueId="itemTableId"
                handleRefresh={handleRefresh}
                refreshLoading={refreshLoading}
                loading={isLoading}
            // setIsLoading={setIsLoading}


            />



        </div>
    )
}

export default TblItemCl