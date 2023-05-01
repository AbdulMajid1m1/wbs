import React, { createContext, useState } from 'react';

export const ReceiptsContext = createContext();

export const ReceiptsProvider = ({ children }) => {
    const [statedata, setSateData] = useState({
        shipmentId: '',
        containerId: '',
        arrivalWarehouse: '',
        itemName: '',
        itemId: '',
        purchId: '',
        classification: '',
        serialNum: '',
        rcvdConfigId: '',
        gtin: '',
        rzone: '',
        rcvd_date: '',
        palletCod: '',
        pallet_date: '',
        remarks: ''
    });

    const updateData = (newData) => {
        setSateData({ ...statedata, ...newData });
    };

    return (
        <ReceiptsContext.Provider value={{ statedata, updateData }}>
            {children}
        </ReceiptsContext.Provider>
    );
};
