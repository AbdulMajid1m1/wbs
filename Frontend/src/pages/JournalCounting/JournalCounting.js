import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { JournalCountingTableColumn, JournalMovementColumn, JournalProfitLostColumn, ReturnSalesOrderColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const JournalCounting = () => {
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
                    
                userRequest.get("/getAllWmsJournalCounting")
                    .then(response => {
                        setData(response?.data ?? [])
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

            <UserDataTable data={data} title="Journal Counting (Axapta)" columnsName={JournalCountingTableColumn} backButton={true}
                actionColumnVisibility={false}
                buttonVisibility={false}
                AddUser={true}
                uniqueId="journalCountingUser"
                UserName="Journal Counting User"
                loading={isLoading}
                setIsLoading={setIsLoading}
            
            />

           

        </div>
    )
}

export default JournalCounting