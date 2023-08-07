import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./dipactchingPicking.css";
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';
import { items } from 'fusioncharts';
import { FiTrash2 } from "react-icons/fi";

const DispatchingSecondScreen = () => {
    const navigate = useNavigate();

    const [selectionType, setSelectionType] = useState('Serial');
    const [locationInputValue, setLocationInputValue] = useState('');
    const [newTableData, setNewTableData] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [vehicleBarcode, setVehicleBarcode] = useState('');
    // to reset snakebar messages
    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };
    // retrieve data from session storage
    const storedData = sessionStorage.getItem('selectedDispactchingRowData');
    const parsedData = JSON.parse(storedData);
    const handleDzoneSelect = (event, value) => {
        setLocationInputValue(value);
    };

    useEffect(() => {
        const getDataFromPackingSlipCl = async () => {
            try {
                const res = await userRequest.get("/getPackingSlipTableClByItemIdAndPackingSlipId?ITEMID=" + parsedData?.ITEMID + "&PACKINGSLIPID=" + parsedData?.PACKINGSLIPID);
                setNewTableData(res?.data ?? []);
            }
            catch (error) {
                console.log(error)
                setNewTableData([]);
                setError(error?.response?.data?.message ?? 'Cannot fetch location data');


            }
        }

        getDataFromPackingSlipCl();



    }, [parsedData?.ITEMID, parsedData?.PACKINGSLIPID])



    const autocompleteRef = useRef(); // Ref to access the Autocomplete component
    const [autocompleteKey, setAutocompleteKey] = useState(0);
    const resetAutocomplete = () => {
        setLocationInputValue(''); // Clear the location input value
        setAutocompleteKey(key => key + 1); // Update the key to reset the Autocomplete
    };







    // const [selectionType, setSelectionType] = useState('Pallet');
    const [data, setData] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [userInputSubmit, setUserInputSubmit] = useState(false);

    // define the function to filter data based on user input and selection type

    const filterData = () => {
        let trimInput = userInput?.trim()
        // filter the data based on the user input and selection type
        const filtered = newTableData.filter((item) => {
            if (selectionType === 'Pallet') {
                return item.PalletCode?.trim() === trimInput;
            } else if (selectionType === 'Serial') {
                return item?.ITEMSERIALNO?.trim() === trimInput;
            } else {
                return true;
            }
        });

        if (filtered.length === 0) {
            setTimeout(() => {
                setError("Please scan a valid barcode");
            }, 300);
            return;
        }

        setFilteredData((prevData) => {
            // Filter out items that are already in prevData
            const newItems = filtered.filter((item) => {
                if (selectionType === 'Pallet') {
                    return !prevData.some(prevItem => prevItem.PalletCode === item.PalletCode);
                } else if (selectionType === 'Serial') {
                    return !prevData.some(prevItem => prevItem.ITEMSERIALNO?.trim() === item.ITEMSERIALNO?.trim());
                }
            });
            setUserInput("");
            return [...prevData, ...newItems]; // Append the new items to the existing state
            // clear the user input state variable
        });

        // Remove the inserted records from the newTableData
        setNewTableData((prevData) => {
            return prevData.filter((item) => {
                if (selectionType === 'Pallet') {
                    return !filtered.some(filteredItem => filteredItem.PalletCode?.trim() === item.PalletCode?.trim());
                } else if (selectionType === 'Serial') {
                    return !filtered.some(filteredItem => filteredItem.ITEMSERIALNO?.trim() === item.ITEMSERIALNO?.trim());
                } else {
                    return true;
                }
            });
        });
    };


    // reset function
    const resetDataOnUPdate = () => {
        // remove the filtered data from the data state variable
        const newData = data.filter((item) => {
            if (selectionType === 'Pallet') {
                return item.PalletCode !== userInput;
            } else if (selectionType === 'Serial') {
                return item.ItemSerialNo !== userInput;
            } else {
                return true;
            }
        });
        setData(newData);
        // reset the user input state variable
        setUserInput("");
        // trigger the filtering of data
        setUserInputSubmit(!userInputSubmit);


    };




    const handleInputUser = (e) => {



        filterData();
    }




    const handleRemoveSerialNumber = (index) => {
        const updatedList = [...filteredData];
        // add this again to the newTableData
        setNewTableData((prevData) => {
            return [...prevData, filteredData[index]];
        });
        updatedList.splice(index, 1);
        setFilteredData(updatedList);

    };


    const handleSaveBtnClick = async () => {
        if (filteredData.length === 0) {
            setError("No data to save");
            return;
        }
        if (vehicleBarcode === '') {
            setError("Please scan a vehicle barcode");
            return;
        }

        try {
            let apiData = filteredData?.map((item) => {
                return {
                    ...item,
                    VEHICLESHIPPLATENUMBER: vehicleBarcode
                }
            });

            console.log(apiData)

            // Create an array of promises for the API requests
            const responses = await Promise.all([
                userRequest.post(`/insertTblDispatchingDataCL`, apiData),
                userRequest.post(`/insertTblDispatchingDetailsDataCL`, apiData)
            ]);

            // Responses[0] is the result of the first request, responses[1] is the result of the second request
            console.log(responses[0]?.data);
            console.log(responses[1]?.data);

            // Here, you can choose how you want to handle multiple responses, for demonstration:
            setMessage(responses[0]?.data?.message ?? "Data Saved Successfully");

            setVehicleBarcode('');
        }
        catch (error) {
            console.error(error);
            setError(error?.response?.data?.message ?? "Something went wrong");
        }
    }




    return (
        <>

            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

            <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
                <div className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
                    <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
                        <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

                            <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                                <div className='w-full flex justify-end'>
                                    <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                                        <span>
                                            <img src={icon} className='h-auto w-8 object-contain' alt='' />
                                        </span>
                                    </button>
                                </div>
                                <span className='text-white -mt-7'>PACKING SLIP ID:</span>
                                <input
                                    //   value={parsedData.TRANSFERID}
                                    className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"

                                    value={parsedData?.PACKINGSLIPID}
                                    disabled
                                />


                            </div>

                            <div className='flex justify-between gap-2 mt-2 text-xs sm:text-base'>
                                <div className='flex items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                                    <span>Item Code:</span>
                                    <span>{parsedData?.ITEMID}</span>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <div className='text-[#FFFFFF]'>
                                        <span>NAME {parsedData?.NAME}</span>
                                    </div>


                                    {/* <div className='text-[#FFFFFF]'>
                    <span>GROUPID {parsedData.EXPEDITIONSTATUS}</span>
                  </div> */}
                                </div>
                            </div>

                            {/* <div>
                <div className='flex gap-6 justify-center items-center text-xs mt-2 sm:mt-0 sm:text-lg'>
                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Remaining Quantity</span>
                    <span>{remainingQty}</span>
                  </div>

                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Picked Quantity</span>
                    <span>{filteredData.length}</span>
                  </div>
                </div>
              </div> */}

                        </div>


                        <div className='mb-6'>
                            {/* // create excel-like Tables  */}
                            <div className="table-location-generate1">
                                <table>
                                    <thead>
                                        <tr>
                                            {/* Table header columns */}
                                            <th>SALESID</th>
                                            <th>ITEMID</th>
                                            <th>ITEMSERIALNO</th>
                                            <th>NAME</th>
                                            <th>INVENTLOCATIONID</th>
                                            <th>CONFIGID</th>
                                            <th>ORDERED</th>
                                            <th>PACKINGSLIPID</th>
                                            <th>VEHICLESHIPPLATENUMBER</th>
                                            <th>DATETIMECREATED</th>
                                            <th>ASSIGNEDUSERID</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Map over the fetched data to render rows */}
                                        {newTableData.map((data, index) => (
                                            <tr key={"tranidRow" + index}>
                                                {/* Table data cells */}
                                                <td>{data.SALESID}</td>
                                                <td>{data.ITEMID}</td>
                                                <td>{data.ITEMSERIALNO}</td>
                                                <td>{data.NAME}</td>
                                                <td>{data.INVENTLOCATIONID}</td>
                                                <td>{data.CONFIGID}</td>
                                                <td>{data.ORDERED}</td>
                                                <td>{data.PACKINGSLIPID}</td>
                                                <td>{data.VEHICLESHIPPLATENUMBER}</td>
                                                <td>{data.DATETIMECREATED}</td>
                                                <td>{data.ASSIGNEDUSERID}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>



                        <div className='mb-4 flex justify-end items-center gap-2'>
                            <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                            <input
                                id="totals"
                                className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[30%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Totals"
                                value={newTableData.length}
                            />
                        </div>


                        <div class="text-center mb-4">
                            <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                  flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                            >

                                <label className="inline-flex items-center mt-1">
                                    <input
                                        type="radio"
                                        name="selectionType"
                                        value="Serial"
                                        checked={selectionType === 'Serial'}
                                        onChange={e => setSelectionType(e.target.value)}
                                        className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                                    />
                                    <span className="ml-2 text-[#00006A]">BY SERIAL</span>
                                </label>
                                <label className="inline-flex items-center mt-1">
                                    <input
                                        type="radio"
                                        name="selectionType"
                                        value="Pallet"
                                        checked={selectionType === 'Pallet'}
                                        onChange={e => setSelectionType(e.target.value)}
                                        className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                                        disabled
                                    />
                                    <span className="ml-2 text-[#00006A]">BY PALLETE</span>
                                </label>
                            </div>
                        </div>


                        <form
                        //   onSubmit={handleFormSubmit}
                        >
                            <div className="mb-6">
                                <label htmlFor='scan' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan {selectionType}#<span className='text-[#FF0404]'>*</span></label>

                                <input
                                    id="scanpallet"
                                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder={`Scan ${selectionType}`}
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onBlur={handleInputUser}

                                />
                            </div>

                            <div className='mb-6'>
                                {/* // creae excel like Tables  */}
                                <div className="table-location-generate1">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Disselect</th>
                                                <th>PACKINGSLIPID</th>
                                                <th>VEHICLESHIPPLATENUMBER</th>
                                                <th>INVENTLOCATIONID</th>
                                                <th>ITEMID</th>
                                                <th>ORDERED</th>
                                                <th>NAME</th>
                                                <th>CONFIGID</th>
                                                <th>SALESID</th>
                                                <th>ITEMSERIALNO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.map((data, index) => (
                                                <tr key={"tranidRow" + index}>
                                                    <td className="disselect-number-cell">
                                                        <button type="button" className="disselect-remove-button" onClick={() => handleRemoveSerialNumber(index)}><FiTrash2 /></button>
                                                    </td>
                                                    <td>{data.PACKINGSLIPID}</td>
                                                    <td>{data.VEHICLESHIPPLATENUMBER}</td>
                                                    <td>{data.INVENTLOCATIONID}</td>
                                                    <td>{data.ITEMID}</td>
                                                    <td>{data.ORDERED}</td>
                                                    <td>{data.NAME}</td>
                                                    <td>{data.CONFIGID}</td>
                                                    <td>{data.SALESID}</td>
                                                    <td>{data.ITEMSERIALNO}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>



                            </div >

                            <div className='flex justify-end items-center gap-2'>
                                <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                                <input
                                    id="totals"
                                    className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[30%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Totals"
                                    value={filteredData.length}
                                />
                            </div>

                        </form>




                        <div className="mb-6">
                            <label htmlFor='barcode' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Vehicle Barcode Serial #(Vehicle Plate#)<span className='text-[#FF0404]'>*</span></label>
                            <input
                                id="barcode"
                                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Vehicle Barcode"
                                value={vehicleBarcode}
                                onChange={(e) => setVehicleBarcode(e.target.value)}
                            />
                        </div >

                        <div className='mb-6'>
                            <button
                                type='button'
                                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[25%]'>
                                <span className='flex justify-center items-center'
                                    onClick={handleSaveBtnClick}
                                >
                                    <p>Save</p>
                                </span>
                            </button>
                        </div>

                    </div>
                </div >
            </div >
        </>
    )
}

export default DispatchingSecondScreen


