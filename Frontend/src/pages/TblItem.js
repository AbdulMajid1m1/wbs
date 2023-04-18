import React, { useEffect, useState } from 'react'
import UserDataTable from '../components/UserDatatable/UserDataTable'
import { AllItems } from '../utils/datatablesource'
import userRequest from "../utils/userRequest"
import axios from 'axios'

const TblItem = () => {
    const [alldata, setAllData] = useState([]);
    const [fetchDataState, setFetchDataState] = useState(false);

    useEffect(() => {
        axios.get('https://fakestoreapi.com/products')
            .then((response) => {
                console.log(response.data)
                setAllData(response.data)
            })
            .catch(err =>{
                console.log(err)
            })
    },[])
  return (
    <div>
        <UserDataTable data={alldata} title="All Items" columnsName={AllItems} backButton={true}/>
    </div>
  )
}

export default TblItem