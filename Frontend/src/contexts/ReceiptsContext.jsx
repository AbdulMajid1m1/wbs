import React, { createContext, useState, useEffect } from 'react';
import userRequest from '../utils/userRequest';

export const ReceiptsContext = createContext();

export const ReceiptsProvider = ({ children }) => {
    // get ios date format
    const date = new Date().toISOString().slice(0, 10);
    console.log(date);
    const initialData = JSON.parse(sessionStorage.getItem('receiptData')) || {
        ARRIVALWAREHOUSE: '',
        BIN: '',
        CLASSIFICATION: '',
        CONTAINERID: '',
        GTIN: '',
        ITEMID: '',
        ITEMNAME: '',
        PALLETCODE: '',
        PALLET_DATE: date,
        PURCHID: '',
        RCVDCONFIGID: '',
        RCVD_DATE: date,
        RZONE: '',
        SERIALNUM: '',
        SHIPMENTID: '',
        POQTY: '',
        RCVQTY: "",
        REMAININGQTY: '',
    };

    const [statedata, setSateData] = useState(initialData);

    useEffect(() => {
        sessionStorage.setItem('receiptData', JSON.stringify(statedata));
    }, [statedata]);

    useEffect(() => {
        const getAllAssetsList = async () => {
            userRequest.get("/getAllTblShipmentReceivedCL")

                .then(response => {
                    console.log(response?.data);
                    updateData({ RCVQTY: response?.data.length });

                })
                .catch(error => {
                    console.error(error);

                });

        };
        getAllAssetsList();
    }, []);
    const updateData = (newData) => {
        setSateData({ ...statedata, ...newData });
    };

    return (
        <ReceiptsContext.Provider value={{ statedata, updateData }}>
            {children}
        </ReceiptsContext.Provider>
    );
};
