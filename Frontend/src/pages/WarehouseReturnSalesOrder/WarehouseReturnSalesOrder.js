import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { ReturnSalesOrderColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';


const WarehouseReturnSalesOrder = () => {
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

                userRequest.get("/getAllWmsReturnSalesOrderCl")
                    .then(response => {
                        console.log(response?.data);
                        setData(response?.data ?? [])
                        setIsLoading(false)

                    })
                    .catch(error => {
                        console.error(error);
                        setIsLoading(false)
                        // setError(error?.response?.data?.error)
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


            <UserDataTable data={data} title="Returns (Warehouse)" columnsName={ReturnSalesOrderColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                printButton={false}
                printBarCode={true}
                PrintBarCodeName={"Print"}
                uniqueId="PrintReturnSalesOrder"
                loading={isLoading}
                setIsLoading={setIsLoading}

            />

        </div>
    )
}

export default WarehouseReturnSalesOrder