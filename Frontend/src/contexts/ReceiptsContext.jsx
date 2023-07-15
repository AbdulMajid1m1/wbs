import React, { createContext, useState, useEffect } from 'react';
import userRequest from '../utils/userRequest';

export const ReceiptsContext = createContext();

export const ReceiptsProvider = ({ children }) => {
    // get ios date format
    const date = new Date().toISOString();
    const [serialNumLength, setSerialNumLength] = useState('');
    const [receivedQty, setReceivedQty] = useState(null);
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
        RCVDCONFIGID: 'G',
        RCVD_DATE: date,
        RZONE: '',
        SERIALNUM: '',
        SHIPMENTID: '',
        POQTY: null,
        RCVQTY: 1,
        REMAININGQTY: '',
        WEIGHT: null,
        LENGTH: null,
        WIDTH: null,
        HEIGHT: null,
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

                    setSerialNumLength(response?.data?.length ?? '');

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
    const fetchItemCount = async () => {
        try {
            console.log(statedata);
            const res = await userRequest.get(`getRemainingQtyFromShipmentCounter?CONTAINERID=${statedata?.CONTAINERID || ""}&SHIPMENTID=${statedata?.SHIPMENTID || ''}&ITEMID=${statedata?.ITEMID || ''}`)
            console.log(res?.data);
            setReceivedQty(res?.data?.itemCount ?? null);
        } catch (error) {
            console.error(error);
            setReceivedQty(null);
        }
    }


    return (
        <ReceiptsContext.Provider value={{ serialNumLength, statedata, updateData, receivedQty, fetchItemCount }}>
            {children}
        </ReceiptsContext.Provider>
    );
};
