import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { MappedItemsColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import CustomSnakebar from '../../utils/CustomSnakebar';

const PrintingPalletLabels = () => {
    const [alldata, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [count, setCount] = useState(null);

    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };

    useEffect(() => {
        const getAllAssetsList = async () => {
            try {

                const res = await userRequest.get("/getLimitedTblMappedBarcodes")

                console.log(res?.data);

                setAllData(res?.data?.data ?? [])
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


            <UserDataTable data={alldata}
                title="Printing Pallet Labels"
                columnsName={MappedItemsColumn} backButton={true}
                uniqueId="PrintPalletBarcode"
                actionColumnVisibility={false}
                emailButton={false}
                printButton={true}
                PrintName={"Print Pallet Labels"}
                TotalCount={count}
                loading={isLoading}
                setIsLoading={setIsLoading}
            //    printBarCode={true}
            //    PrintBarCodeName={"Print Pallet Barcode"}
            />


        </div>
    )
}

export default PrintingPalletLabels