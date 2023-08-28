import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { MappedItemsColumn, TblPickingClColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';


const TblPickingCl = () => {
    const [alldata, setAllData] = useState([]);
    const [secondGridData, setSecondGridData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
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

        const getMappedBarcodeDeleted = async () => {
            try {

                userRequest.get("/getAllTblMappedBarcodesDeleted")
                    .then(response => {
                        console.log(response?.data);

                        setSecondGridData(response?.data ?? [])
                        setFilteredData(response?.data ?? [])

                    })
                    .catch(error => {
                        console.error(error);
                        setError(error?.response?.data?.message ?? "Something went wrong")

                    });

            }
            catch (error) {
                console.log(error);
            }
        };
        getMappedBarcodeDeleted();


    }, []);

    const handleRowClickInParent = (item) => {
        console.log(item);
        // filter data for second grid using item.ITEMID and JOURNALMOVEMENTCLID
        const filteredData = secondGridData.filter((data) => {
            return data?.Remarks === item?.PICKINGROUTEID
        })
        console.log(filteredData);
        setFilteredData(filteredData)
    }

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
                checkboxSelection={'disabled'}
                uniqueId="PICKINGROUTEID"
                handleRowClickInParent={handleRowClickInParent}
                loading={isLoading}
                setIsLoading={setIsLoading}


            />
            <div
                style={{ height: '40px' }}
            ></div>

            <UserDataTable data={filteredData} title="Picked Items Details" columnsName={MappedItemsColumn} backButton={true}
                actionColumnVisibility={false}
                uniqueId={"barcodeDeletedId"}
                // checkboxSelection={true}

                buttonVisibility={false}
                loading={isLoading}
                setIsLoading={setIsLoading}

            />


        </div >
    )
}

export default TblPickingCl