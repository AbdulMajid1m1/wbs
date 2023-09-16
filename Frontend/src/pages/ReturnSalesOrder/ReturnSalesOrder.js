import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { ReturnSalesOrderColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const ReturnSalesOrder = () => {
    const [data, setData] = useState([]);
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

                const response = await userRequest.get("/getAllWmsReturnSalesOrder")

                setData(response?.data ?? [])
            }
            catch (error) {
                setError(error?.response?.data?.message ?? "Something went wrong")

                console.log(error);
            }
            finally {
                setIsLoading(false)
            }
        };
        getAllAssetsList();
    }, []);

    return (
        <div>

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

            <UserDataTable data={data} title="Returns (Axapta)" columnsName={ReturnSalesOrderColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                loading={isLoading}
                setIsLoading={setIsLoading}

            />


        </div>
    )
}

export default ReturnSalesOrder