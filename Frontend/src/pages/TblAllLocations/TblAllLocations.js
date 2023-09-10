import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { TblAllLocationColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import CustomSnakebar from '../../utils/CustomSnakebar';

const TblAllLocations = () => {
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

                userRequest.get("/getAllTblLocationsCL")
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

    const handleExcelImport = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            setIsLoading(true);
            userRequest.post("/insertTblLocationsDataCL", formData)
                .then((response) => {
                    setIsLoading(false);
                    console.log(response.data);
                    setMessage("Successfully Added");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                    setError(error?.response?.data?.message ?? "Failed to Add")
                });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            setError("Failed to Add");
        }
    };


    return (
        <div>

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


            <UserDataTable
                data={alldata}
                addNewNavigation="/tbl-new-location"
                title="TBL ALL LOCATIONS (Warehouse Operation)"
                columnsName={TblAllLocationColumn}
                backButton={true}
                uniqueId="locationTableId"
                loading={isLoading}
                setIsLoading={setIsLoading}
                printLocation={true}
                PrintBarCodeName={"Print Location"}
                handleExcelImport={handleExcelImport}
                excelImport={true}
            />


        </div>
    )
}

export default TblAllLocations