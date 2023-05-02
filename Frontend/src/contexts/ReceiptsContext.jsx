import React, { createContext, useState, useEffect } from 'react';

export const ReceiptsContext = createContext();

export const ReceiptsProvider = ({ children }) => {
    let date = Date.now();
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

    const updateData = (newData) => {
        setSateData({ ...statedata, ...newData });
    };

    return (
        <ReceiptsContext.Provider value={{ statedata, updateData }}>
            {children}
        </ReceiptsContext.Provider>
    );
};
