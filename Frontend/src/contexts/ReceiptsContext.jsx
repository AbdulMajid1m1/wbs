import React, { createContext, useState, useEffect } from 'react';

export const ReceiptsContext = createContext();

export const ReceiptsProvider = ({ children }) => {
    const initialData = JSON.parse(sessionStorage.getItem('receiptData')) || {
        ARRIVALWAREHOUSE: '',
        BIN: '',
        CLASSIFICATION: '',
        CONTAINERID: '',
        GTIN: '',
        ITEMID: '',
        ITEMNAME: '',
        PALLETCODE: '',
        PALLET_DATE: '',
        PURCHID: '',
        RCVDCONFIGID: '',
        RCVD_DATE: '',
        RZONE: '',
        SERIALNUM: '',
        SHIPMENTID: ''
    };

    const [statedata, setSateData] = useState(initialData);

    useEffect(() => {
        sessionStorage.setItem('receiptData', JSON.stringify(statedata));
    }, [statedata]);

    const updateData = (newData) => {
        setSateData({ ...statedata, ...newData });
    };

    return (
        <ReceiptsContext.Provider value={{ statedata, updateData }}>
            {children}
        </ReceiptsContext.Provider>
    );
};
