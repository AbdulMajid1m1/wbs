import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { MappedItemsColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';


const MappedItems = () => {
    const [alldata, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };



    useEffect(() => {
        const getAllAssetsList = async () => {
            try {

                userRequest.get("/getAllTblMappedBarcodes")
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

        // const getAllAssetsList = async () => {
        //     let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI1NiIsIlVzZXJMZXZlbCI6ImFkbWluIiwiTG9jIjoiUGFraXN0YW4iLCJpYXQiOjE2ODYzMDMxMTMsImV4cCI6MTY5NDA3OTExM30.z1PiyJ6saXuP0ejjuTW2JbiZ1ZwCuQPFTQQA-Th0YaM';
        //     try {
        //       const response = await fetch('/getAllTblMappedBarcodes', {
        //         headers: {
        //           'Authorization': `Bearer ${token}`
        //         }
        //       });
        //       console.log(response);
          
        //       const reader = response.body.getReader();
        //       let data = '';
          
        //       reader.read().then(function processText({ done, value }) {
        //         if (done) {
        //           console.log("Stream complete");
        //           setIsLoading(false);
        //           return;
        //         }
          
        //         const chunk = new TextDecoder("utf-8").decode(value);
        //         data += chunk;
          
        //         const lines = data.split('\n').filter(Boolean);  // Splits the incoming data by newline characters and removes any empty strings
        //         data = lines.pop();  // Removes the last line (which may be incomplete) for processing with the next chunk
          
        //         const rows = lines.map(JSON.parse);  // Converts each complete line to a JSON object
        //         setAllData(prevData => [...prevData, ...rows]);  // Appends the new rows to the existing state
          
        //         return reader.read().then(processText);
        //       });
          
        //     } catch (error) {
        //       console.log(error);
        //       setIsLoading(false);
        //       setError("Something went wrong");
        //     }
        //   };
        //   getAllAssetsList();
          




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