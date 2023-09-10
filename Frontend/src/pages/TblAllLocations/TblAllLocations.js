import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { TblAllLocationColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import CustomSnakebar from '../../utils/CustomSnakebar';
import * as XLSX from 'xlsx';
import { SyncLoader } from 'react-spinners';
const TblAllLocations = () => {
    const [alldata, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [customLoader, setCustomLoader] = useState(false);

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
        setCustomLoader(true);

        try {
            const bufferArray = await readFileAsync(file);
            const data = await parseExcelData(bufferArray);

            // Prepare the data for the API call
            const requestData = {
                records: data.map((record) => ({
                    MAIN: record.MAIN,
                    WAREHOUSE: record.WAREHOUSE,
                    ZONE: record.ZONE,
                    BIN: record.BIN,
                    ZONE_CODE: record.ZONE_CODE,
                    ZONE_NAME: record.ZONE_NAME,
                })),
            };

            // Call the API to insert data
            const response = await sendExcelDataToAPI(requestData);

            console.log(response);
            // append the new data to the existing data
            setAllData((prevData) => [...prevData, ...data]);
            setMessage("Successfully Added");
        } catch (error) {
            console.error("Error handling Excel import:", error);
            setMessage("Error handling Excel import.");
            setSeverity("error");
        } finally {
            setCustomLoader(false);
        }
    };

    const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (event) => {
                resolve(event.target.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const parseExcelData = async (bufferArray) => {
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        return XLSX.utils.sheet_to_json(ws);
    };

    const sendExcelDataToAPI = async (data) => {
        try {
            const response = await userRequest.post('/insertTblLocationsDataCL', data);
            return response;

        } catch (error) {
            throw error;
        }
    };


    return (
        <div>
            {customLoader &&

                <div className='loading-spinner-background'
                    style={{
                        zIndex: 9999, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed'


                    }}
                >
                    <SyncLoader

                        size={18}
                        color={"#0079FF"}
                        // height={4}
                        loading={customLoader}
                    />
                </div>
            }

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