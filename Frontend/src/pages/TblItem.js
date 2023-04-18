import React, { useEffect, useState } from 'react'
import UserDataTable from '../components/UserDatatable/UserDataTable'
import { AllItems } from '../utils/datatablesource'
import userRequest from "../utils/userRequest"
import axios from 'axios'

const TblItem = () => {
    const [data, setData] = useState([]);
    const [fetchDataState, setFetchDataState] = useState(false);

    useEffect(() => {
        const getAllAssetsList = async () => {
          try {
    
            userRequest.get("/getAllTblItems")
              .then(response => {
                response.data == "no data available" ? setData([]) : setData(response.data);
                console.log(response?.data);
             // setData(response?.data ?? [])
    
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
      }, [fetchDataState]);
  return (
    <div>
        <UserDataTable data={data} title="All Items" columnsName={AllItems} backButton={true}/>
    </div>
  )
}

export default TblItem