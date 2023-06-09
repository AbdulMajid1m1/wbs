import React, { useContext, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import userRequest from '../../utils/userRequest';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { RecevingByContainerId } from '../../contexts/RecevingByContainerId';

const ReceivingByContainerIdSecond = () => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(null);
    const { serialNumLength, statedata, updateData, receivedQty, fetchItemCount } = useContext(RecevingByContainerId);


    const [dataList, setDataList] = useState([]);
    useEffect(() => {
        fetchItemCount();
        console.log('Updated data:', statedata);
        userRequest.get('/getAllTblRZones')
            .then(response => {
                console.log(response?.data);
                setDataList(response?.data ?? []);
            })
            .catch(error => {
                console.error(error);
            });

    }, []);









    const handleFormSubmit = (e) => {
        e.preventDefault();
        navigate('/receiving-by-containerid-third');
    }

    const handleAutoComplete = (event, value) => {
        console.log('Selected value:', value);
        updateData({ ...statedata, RZONE: value.RZONE });
    };

    return (
        <>
            <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
                <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
                    <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
                        <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#e69138] text-xl mb:2 md:mb-5">

                            <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                                <div className='w-full flex justify-end'>
                                    <button onClick={() => navigate(-1)} className='w-[15%] rounded-sm bg-[#fff] text-[#e69138]'>
                                        Back
                                    </button>
                                </div>
                                <span className='text-white'>JOB ORDER NUMBER (SHIPMENT ID)</span>
                                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 " placeholder="Job Order Number"
                                    value={statedata?.SHIPMENTID ?? ''}
                                    disabled
                                />
                                <span className='text-white'>CONTAINER NUMBER</span>
                                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 " placeholder="Job Order Number"
                                    value={statedata?.CONTAINERID ?? ''}
                                    disabled
                                />
                            </div>

                            <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                                <div className='flex items-center sm:text-lg gap-2'>
                                    <span>Item Code:</span>
                                    <span>{statedata?.ITEMID ?? ''}</span>

                                </div>

                                <div className='flex gap-4'>
                                    <div className='flex flex-col justify-center items-center sm:text-lg gap-2'>
                                        <span>PO Qty</span>
                                        <span>{statedata?.POQTY ?? ""}</span>
                                    </div>
                                    <div className='flex flex-col justify-center items-center text-center sm:text-lg gap-2'>
                                        <span>Received Qty</span>
                                        <span>{receivedQty}</span>
                                    </div>

                                    <div className='flex flex-col justify-center items-center sm:text-lg gap-2'>
                                        <span>CON</span>
                                        <span>{statedata?.CLASSIFICATION ?? ""}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form
                            onSubmit={handleFormSubmit}
                        >

                            <div className="mb-6">
                                <label htmlFor='item' className="block mb-2 text-lg font-medium text-black">ITEM NAME</label>
                                <input id="item" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 " placeholder="ITEM NAME"
                                    value={statedata?.ITEMNAME ?? ''}
                                    disabled

                                    onChange={(e) => {
                                        updateData({ ...statedata, ITEMNAME: e.target.value });
                                    }
                                    }
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="scan" className="block mb-2 text-xs font-medium text-black">Enter Scan/GTIN</label>
                                <input id="scan" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 " placeholder="Enter Scan/GTIN" required

                                    onChange={(e) => {
                                        updateData({ ...statedata, GTIN: e.target.value });
                                    }
                                    }
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="zone" className="block mb-2 text-xs font-medium text-black">Enter/Scan Receiving Zone</label>


                                <Autocomplete
                                    id="zone"
                                    options={dataList}
                                    getOptionLabel={(option) => option.RZONE}
                                    onChange={handleAutoComplete}

                                    // onChange={(event, value) => {
                                    //   if (value) {
                                    //     console.log(`Selected: ${value}`);

                                    //   }
                                    // }}
                                    onInputChange={(event, value) => {
                                        if (!value) {
                                            // perform operation when input is cleared
                                            console.log("Input cleared");

                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                className: "text-white",
                                            }}
                                            InputLabelProps={{
                                                ...params.InputLabelProps,
                                                style: { color: "white" },
                                            }}

                                            className="bg-gray-50 border border-gray-300 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                                            placeholder="Enter/Scan Receiving Zone"
                                            required
                                        />
                                    )}
                                    classes={{
                                        endAdornment: "text-white",
                                    }}
                                    sx={{
                                        '& .MuiAutocomplete-endAdornment': {
                                            color: 'white',
                                        },
                                    }}
                                />
                            </div>

                            <div className="mt-4 md:mt-10 w-full flex justify-end text-sm md:text-xl py-2 rounded-md">
                                <button
                                    //  onClick={() => navigate('/receiptsthird')}
                                    type='submit' className="bg-[#e69138] text-white font-semibold py-2 px-10 rounded-sm">
                                    Scan Serial Numbers
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReceivingByContainerIdSecond