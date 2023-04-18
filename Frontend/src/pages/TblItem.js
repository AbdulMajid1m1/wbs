import React, { useEffect, useState } from 'react'
import UserDataTable from '../components/UserDatatable/UserDataTable'
import { AllItems } from '../utils/datatablesource'
import userRequest from "../utils/userRequest"
import axios from 'axios'

const TblItem = () => {
    const [alldata, setAllData] = useState([]);

    useEffect(() => {
        const getAllAssetsList = async () => {
            try {

                userRequest.get("/getAllTblItems")
                    .then(response => {
                        // response.data == "no data available" ? setAllData([]) : setAllData(response.data);
                        console.log(response?.data);

                        setAllData(response?.data ?? [])

                    })
                    .catch(error => {
                        // handleUserError(error)
                        console.error(error);
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
            <UserDataTable data={alldata} title="ALL ITEMS" columnsName={AllItems} backButton={true} />
        </div>
    )
}

export default TblItem