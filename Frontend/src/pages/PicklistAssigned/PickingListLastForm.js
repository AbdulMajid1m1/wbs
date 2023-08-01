import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./PickingListLastForm.css";
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';
import { items } from 'fusioncharts';
import { FiTrash2 } from "react-icons/fi";

const PickingListLastForm = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([])
  const [scanInputValue, setScanInputValue] = useState('');
  const [selectionType, setSelectionType] = useState('Serial');
  const [locationInputValue, setLocationInputValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [newTableData, setNewTableData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [dzones, setDzones] = useState([])

  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };
  // retrieve data from session storage
  const storedData = sessionStorage.getItem('PickingRowData');
  const parsedData = JSON.parse(storedData);
  console.log("parsedData")
  console.log(parsedData)

  const handleDzoneSelect = (event, value) => {
    setLocationInputValue(value);
  };


  useEffect(() => {
    const getLocationData = async () => {
      try {
        const res = await userRequest.get("/getAllTblLocationsCL")
        console.log(res?.data)
        setLocation(res?.data)


      }
      catch (error) {
        console.log(error)
        setError(error?.response?.data?.message ?? 'Cannot fetch location data');

      }
    }

    getLocationData();

    const getDzoneLocations = async () => {
      try {
        const res = await userRequest.get("/getAllTblDZones")
        console.log(res?.data)
        setDzones(res?.data ?? [])

      }
      catch (error) {
        console.log(error)
        setError(error?.response?.data?.message ?? 'Cannot fetch dzones data');

      }
    }

    getDzoneLocations();

  }, [parsedData?.ITEMID])



  const autocompleteRef = useRef(); // Ref to access the Autocomplete component
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const resetAutocomplete = () => {
    setLocationInputValue(''); // Clear the location input value
    setAutocompleteKey(key => key + 1); // Update the key to reset the Autocomplete
  };



  const handleFromSelect = (event, value) => {
    setSelectedValue(value);
    fetchData(value);
  };


  const fetchData = async (selectedValue) => {
    try {
      const response = await userRequest.post(
        "/getMappedBarcodedsByItemCodeAndBinLocation",
        {},
        {
          headers: {
            // itemcode: "CV-950H SS220 BK",
            itemcode: parsedData?.ITEMID,
            binlocation: selectedValue
          }
        }
      );
      const responseData = response.data;
      setNewTableData(responseData);
    } catch (error) {
      console.error(error);
    }
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
        return item.ItemSerialNo?.trim() === trimInput;
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
          return !prevData.some(prevItem => prevItem.ItemSerialNo?.trim() === item.ItemSerialNo?.trim());
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
          return !filtered.some(filteredItem => filteredItem.ItemSerialNo?.trim() === item.ItemSerialNo?.trim());
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
    console.log(userInput)
    // setUserInputSubmit(!userInputSubmit);
    filterData();
  }


  const handleSaveBtnClick = async () => {
    if (locationInputValue === "") {
      setError("Please select a location")
      return;
    }
    if (filteredData.length === 0) {
      setError("Please scan a barcode")
      return;
    }
    let pickedQty;
    if (selectionType === "Serial") {
      pickedQty = 1;
    }
    const APIData = filteredData.map((item) => {
      return {
        INVENTLOCATIONID: locationInputValue,
        ORDERED: parsedData?.QTY,
        PACKINGSLIPID: parsedData?.TRANSREFID,// comming from previous page
        ASSIGNEDUSERID: item.ASSIGNEDTOUSERID, // comming from mapped barcode data
        SALESID: parsedData?.PICKINGROUTEID, // comming from previous page
        ITEMID: parsedData?.ITEMID, // comming from previous page
        NAME: parsedData?.ITEMNAME, // comming from previous page
        CONFIGID: parsedData?.CONFIGID, // comming from previous page
        // VEHICLESHIPPLATENUMBER:
        // DATETIMECREATED: new Date().toISOString().slice(0, 19).replace('T', ' '), // current date time
        DATETIMECREATED: parsedData?.DATETIMEASSIGNED,
        oldBinLocation: item?.BinLocation,
        ItemSerialNo: item?.ItemSerialNo,



      }


    })

    console.log(APIData)
    try {
      const res = await userRequest.post(
        `/insertIntoPackingSlipTableClAndUpdateWmsSalesPickingListCl`,
        APIData,
        {
          params: {
            PICKINGROUTEID: parsedData?.PICKINGROUTEID,
            ITEMID: parsedData?.ITEMID,
            QTYPICKED: parsedData?.QTYPICKED,
            QTY: parsedData?.QTY
          }
        }
      );
      console.log(res?.data)
      setMessage(res?.data?.message ?? 'Data saved successfully');

      // clear the filtered data and user input
      setFilteredData([]);
      setUserInput("");

    }
    catch (error) {
      console.log(error)
      setError(error?.response?.data?.message ?? 'Cannot save data');

    }
  }


  
  const handleRemoveSerialNumber = (index) => {
    const updatedList = [...filteredData];
    updatedList.splice(index, 1);
    setFilteredData(updatedList);
  };


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
                <span className='text-white -mt-7'>Picking Route ID:</span>
                <input
                  //   value={parsedData.TRANSFERID}
                  className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                  placeholder="Picking Route ID"
                  value={parsedData?.PICKINGROUTEID}
                  disabled
                />

                <div className='flex gap-2 justify-center items-center'>
                  <span className='text-white'>FROM:</span>

                  <div className='w-full'>
                    <Autocomplete
                      ref={autocompleteRef}
                      key={autocompleteKey}
                      id="location"
                      // options={location.filter(item => item.BinLocation)}
                      // getOptionLabel={(option) => option.BinLocation}
                      options={Array.from(new Set(location.map(item => item?.BIN))).filter(Boolean)}
                      getOptionLabel={(option) => option}
                      onChange={handleFromSelect}

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

                          className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                      p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                          placeholder="FROM"
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
                </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-base'>
                <div className='flex items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Item Code:</span>
                  <span>{parsedData?.ITEMID}</span>
                </div>

                <div className='flex flex-col gap-2'>
                  <div className='text-[#FFFFFF]'>
                    <span>CLASS {parsedData?.ASSIGNEDTOUSERID}</span>
                  </div>


                  <div className='text-[#FFFFFF]'>
                    <span>GROUPID {parsedData.EXPEDITIONSTATUS}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className='flex gap-6 justify-center items-center text-xs mt-2 sm:mt-0 sm:text-lg'>
                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Quantity<span className='text-[#FF0404]'>*</span></span>
                    <span>{parsedData.QTY}</span>
                  </div>

                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Picked<span className='text-[#FF0404]'>*</span></span>
                    <span>{filteredData.length}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className='mb-6'>
              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ItemCode</th>
                      <th>ItemDesc</th>
                      <th>GTIN</th>
                      <th>Remarks</th>
                      <th>User</th>
                      <th>Classification</th>
                      <th>MainLocation</th>
                      <th>BinLocation</th>
                      <th>IntCode</th>
                      <th>ItemSerialNo</th>
                      <th>MapDate</th>
                      <th>PalletCode</th>
                      <th>Reference</th>
                      <th>SID</th>
                      <th>CID</th>
                      <th>PO</th>
                      <th>Trans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newTableData.map((data, index) => (
                      <tr key={"tranidRow" + index}>
                        <td>{data.ItemCode}</td>
                        <td>{data.ItemDesc}</td>
                        <td>{data.GTIN}</td>
                        <td>{data.Remarks}</td>
                        <td>{data.User}</td>
                        <td>{data.Classification}</td>
                        <td>{data.MainLocation}</td>
                        <td>{data.BinLocation}</td>
                        <td>{data.IntCode}</td>
                        <td>{data.ItemSerialNo}</td>
                        <td>{new Date(data.MapDate).toLocaleDateString()}</td>
                        <td>{data.PalletCode}</td>
                        <td>{data.Reference}</td>
                        <td>{data.SID}</td>
                        <td>{data.CID}</td>
                        <td>{data.PO}</td>
                        <td>{data.Trans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>



            </div >

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
                    value="Pallet"
                    checked={selectionType === 'Pallet'}
                    onChange={e => setSelectionType(e.target.value)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                    disabled
                  />
                  <span className="ml-2 text-[#00006A]">BY PALLETE</span>
                </label>
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
                        <th>ItemCode</th>
                        <th>ItemDesc</th>
                        <th>GTIN</th>
                        <th>Remarks</th>
                        <th>User</th>
                        <th>Classification</th>
                        <th>MainLocation</th>
                        <th>BinLocation</th>
                        <th>IntCode</th>
                        <th>ItemSerialNo</th>
                        <th>MapDate</th>
                        <th>PalletCode</th>
                        <th>Reference</th>
                        <th>SID</th>
                        <th>CID</th>
                        <th>PO</th>
                        <th>Trans</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((data, index) => (
                        <tr key={"tranidRow" + index}>
                          <td className="disselect-number-cell">
                            <button className="disselect-remove-button" onClick={() => handleRemoveSerialNumber(index)}><FiTrash2 /></button>
                          </td>
                          <td>{data.ItemCode}</td>
                          <td>{data.ItemDesc}</td>
                          <td>{data.GTIN}</td>
                          <td>{data.Remarks}</td>
                          <td>{data.User}</td>
                          <td>{data.Classification}</td>
                          <td>{data.MainLocation}</td>
                          <td>{data.BinLocation}</td>
                          <td>{data.IntCode}</td>
                          <td>{data.ItemSerialNo}</td>
                          <td>{new Date(data.MapDate).toLocaleDateString()}</td>
                          <td>{data.PalletCode}</td>
                          <td>{data.Reference}</td>
                          <td>{data.SID}</td>
                          <td>{data.CID}</td>
                          <td>{data.PO}</td>
                          <td>{data.Trans}</td>
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
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Location To:<span className='text-[#FF0404]'>*</span></label>
              <div className='w-full'>
                <Autocomplete
                  ref={autocompleteRef}
                  key={autocompleteKey}
                  id="dzones"
                  options={Array.from(new Set(dzones?.map(item => item?.DZONE))).filter(Boolean)}
                  getOptionLabel={(option) => option}
                  onChange={handleDzoneSelect}

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

                      className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                      p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                      placeholder="DZone Locations"
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
            </div >



            <div className='mb-6 flex justify-center items-center'>
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

export default PickingListLastForm