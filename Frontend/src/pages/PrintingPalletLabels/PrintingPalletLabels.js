import React, { useEffect, useState } from 'react'
import UserDataTable from '../../components/UserDatatable/UserDataTable'
import { MappedItemsColumn } from '../../utils/datatablesource'
import userRequest from "../../utils/userRequest"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const PrintingPalletLabels = () => {
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

                const res = await userRequest.get("/getAllTblMappedBarcodes")

                console.log(res?.data);

                setAllData(res?.data ?? [])

            }
            catch (error) {
                console.log(error);
                setError(error?.response?.data?.message ?? "Something went wrong")
                console.error(error);

            }

            finally {
                setIsLoading(false)
            }
        };
        getAllAssetsList();
    }, []);

    return (
        <div>

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


            <UserDataTable data={alldata}
                title="Printing Pallet Labels"
                columnsName={MappedItemsColumn} backButton={true}
                uniqueId="PrintPalletBarcode"
                actionColumnVisibility={false}
                emailButton={false}
                printButton={true}
                PrintName={"Print Pallet Labels"}
            //    printBarCode={true}
            //    PrintBarCodeName={"Print Pallet Barcode"}
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

export default PrintingPalletLabels