import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { MappedItemsColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"

import CustomSnakebar from '../../utils/CustomSnakebar';


const PrintingItemBarcode = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [count, setCount] = useState(null);
    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };


    useEffect(() => {
        const getAllAssetsList = async () => {
            setIsLoading(true)
            try {

                const res = await userRequest.get("/getLimitedTblMappedBarcodes")

                console.log(res?.data);

                setData(res?.data?.data ?? [])
                setCount(res?.data?.totalCount || null)

            }
            catch (error) {
                console.log(error);
                setError(error?.response?.data?.message ?? "Something went wrong")
                console.error(error);

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


            <UserDataTable data={data}
                title="Printing Item Barcode"
                columnsName={MappedItemsColumn} backButton={true}
                uniqueId="PrintBarCode"
                actionColumnVisibility={false}
                printButton={false}
                printBarCode={true}
                PrintBarCodeName={"Print Item Barcode"}
                TotalCount={count}
                loading={isLoading}
                setIsLoading={setIsLoading}

            />
        </div>
    )
}

export default PrintingItemBarcode