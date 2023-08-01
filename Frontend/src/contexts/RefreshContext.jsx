import React, { createContext, useState } from 'react';

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {

    const [refreshLoading, setRefreshLoading] = useState(false);
    return (
        <RefreshContext.Provider value={{ refreshLoading, setRefreshLoading }}>
            {children}
        </RefreshContext.Provider>
    );
};
