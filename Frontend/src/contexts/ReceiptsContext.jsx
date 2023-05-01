import React, { createContext, useState } from 'react';

export const ReceiptsContext = createContext();

export const ShipmentProvider = ({ children }) => {
    const [shipmentData, setShipmentData] = useState({
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

    const updateShipmentData = (newData) => {
        setShipmentData({ ...shipmentData, ...newData });
    };

    return (
        <ReceiptsContext.Provider value={{ shipmentData, updateShipmentData }}>
            {children}
        </ReceiptsContext.Provider>
    );
};
