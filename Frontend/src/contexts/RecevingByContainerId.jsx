import React, { createContext, useState, useEffect, useContext } from 'react';
import userRequest from '../utils/userRequest';

export const RecevingByContainerId = createContext();

export const RecevingByContainerIdProvider = ({ children }) => {
    const date = new Date().toISOString();
    const [serialNumLength, setSerialNumLength] = useState('');
    const [statedata, setSateData] = useState(null); // Set initial state to null
    const [receivedQty, setReceivedQty] = useState(null);

    useEffect(() => {
        const initialData = JSON.parse(sessionStorage.getItem('receivingBycontainerIdData')) || {
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
            POQTY: '',
            RCVQTY: 1,
            REMAININGQTY: '',
        };
        setSateData(initialData); // Set the initial state when the component mounts
    }, []);

    useEffect(() => {
        if (statedata) { // Only execute the effect when statedata is not null
            sessionStorage.setItem('receivingBycontainerIdData', JSON.stringify(statedata));
        }
    }, [statedata]);



    const updateData = (newData) => {
        setSateData({ ...statedata, ...newData });
    };


    const fetchItemCount = async () => {
        try {
            const res = await userRequest.get(`getRemainingQtyFromShipmentCounter?CONTAINERID=${statedata?.CONTAINERID || ""}&SHIPMENTID=${statedata?.SHIPMENTID || ''}&ITEMID=${statedata?.ITEMID || ''}`)

            console.log(res?.data);
            setReceivedQty(res?.data?.itemCount ?? null);
        } catch (error) {
            console.log(error);
        }
    }

    if (statedata === null) { // Render null or a loading indicator while the initial data is being fetched
        return null;
    }

    return (
        <RecevingByContainerId.Provider value={{ serialNumLength, statedata, updateData, receivedQty, fetchItemCount }}>
            {children}
        </RecevingByContainerId.Provider>
    );
};
