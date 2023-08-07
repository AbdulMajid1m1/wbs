import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { MappedItemsColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';


const MappedItems = () => {
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
                const response = await userRequest.get("/getAllTblMappedBarcodes")

                console.log(response?.data);

                setAllData(response?.data ?? [])
                setIsLoading(false)

            }
            catch (error) {
                console.log(error);
                setError(error?.response?.data?.message ?? "Something went wrong")
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
                addNewNavigation="/insert-mapped-barcode" title="MAPPED ITEMS (Warehouse Operation) "
                columnsName={MappedItemsColumn} backButton={true}
                uniqueId="ItemCode"
                loading={isLoading}
                setIsLoading={setIsLoading}


            />


        </div>
    )
}

export default MappedItems