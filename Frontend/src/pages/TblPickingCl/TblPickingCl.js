import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { TblPickingClColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';


const TblPickingCl = () => {
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

                const response = await userRequest.get("/getAllTblPickingCL")

                console.log(response?.data);

                setAllData(response?.data ?? [])
                setIsLoading(false)

            }
            catch (error) {
                console.log(error);
                setIsLoading(false)
                setError(error?.response?.data?.message ?? "Something went wrong")
            }
        };
        getAllAssetsList();
    }, []);

    return (
        <div>

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


            <UserDataTable
                data={alldata}
                addNewNavigation="/tbl-new-picking"
                title="PICKING (Warehouse Operation)"
                columnsName={TblPickingClColumn}
                backButton={true}
                uniqueId="PICKINGROUTEID"
                loading={isLoading}
                setIsLoading={setIsLoading}


            />

           

        </div>
    )
}

export default TblPickingCl