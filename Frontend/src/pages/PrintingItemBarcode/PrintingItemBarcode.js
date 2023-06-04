import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { MappedItemsColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';


const PrintingItemBarcode = () => {
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

                userRequest.get("/getAllTblMappedBarcodes")
                    .then(response => {
                        console.log(response?.data);

                        setData(response?.data ?? [])
                        setIsLoading(false)

                    })
                    .catch(error => {
                        console.error(error);
                        setIsLoading(false)
                        setError(error?.response?.data?.error)
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


            <UserDataTable data={data}
             title="Printing Item Barcode"
              columnsName={MappedItemsColumn} backButton={true}
               uniqueId="PrintBarCode"
                actionColumnVisibility={false}
                printButton={false}
                printBarCode={true}
                PrintBarCodeName={"Print Item Barcode"}
                
            />

        {/* <UserDataTable data={data} title="Printing Item Barcode" columnsName={TblShipmentReceivedClColumn}
            backButton={true}
            uniqueId="SERIALNUM"
            addNewNavigation="/receipts"
            ShipmentIdSearchEnable={true}
            actionColumnVisibility={true}
            emailButton={true}
            printButton={true}
            PrintName={"Print Shipment"}

      /> */}

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

export default PrintingItemBarcode