import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { AllItems } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import axios from 'axios'
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';



const TblItemCl = () => {
    const [alldata, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [refreshLoading, setRefreshLoading] = useState(false);

    const handleRefresh = async () => {
        setRefreshLoading(true);

        try {

            const res = await userRequest.get('/insertDataFromInventTableWmsToStockMaster');
            console.log(res?.data);
            setAllData(res?.data?.stockMasterData ?? [])
        }
        catch (error) {
            console.error(error);
            setError(error?.response?.data?.message ?? "Something went wrong")
        }
        finally {
            setRefreshLoading(false);
        }
    };
    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };


    useEffect(() => {
        const getAllAssetsList = async () => {
            try {

                userRequest.get("/getAllTblStockMaster")
                    .then(response => {
                        console.log(response?.data);

                        setAllData(response?.data ?? [])
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


            <UserDataTable data={alldata} addNewNavigation="/itemsnew" title="Stock Master (Warehouse Operation)" columnsName={AllItems} backButton={true}
                Refresh={true}
                uniqueId="itemTableId"
                handleRefresh={handleRefresh}
                refreshLoading={refreshLoading}


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

export default TblItemCl