import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./TransferID.css";
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';
import Swal from 'sweetalert2';

const TransferID = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([])
  const [scanInputValue, setScanInputValue] = useState('');
  const [selectionType, setSelectionType] = useState('Pallet');
  const [locationInputValue, setLocationInputValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");


  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);


  };
  const autocompleteRef = useRef(); // Ref to access the Autocomplete component
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const resetAutocomplete = () => {
    setLocationInputValue(''); // Clear the location input value
    setAutocompleteKey(key => key + 1); // Update the key to reset the Autocomplete
  };






  const handleFromSelect = (event, value) => {
    // setSelectedOption(parsedData?.INVENTLOCATIONIDFROM);
    console.log(value)
    setLocationInputValue(value || "");
  }



  // retrieve data from session storage
  const storedData = sessionStorage.getItem('transferData');
  const parsedData = JSON.parse(storedData);
  const [QtyReceived, setQtyReceived] = useState(parseInt(parsedData?.QTYRECEIVED));


  console.log(parsedData)
  const [selectedOption, setSelectedOption] = useState(parsedData?.INVENTLOCATIONIDFROM);

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

  }, [parsedData?.ITEMID])


  const handleScan = (e) => {
    e.preventDefault();
    // check if selectedOption is empty
    // if (!selectedOption) {
    //   setError("Please select an option for Bin/Location");
    //   return;
    // }
    if (!scanInputValue) return;


    // Check if serial number is already in the table
    const isSerialAlreadyInTable = tableData.some(item => item.ItemSerialNo === scanInputValue);

    if (isSerialAlreadyInTable) {

      setTimeout(() => {
        setError('This serial is already in the table');
      }, 400);
      return;
    }

    // Check if pallet code is already in the table
    const isPalletAlreadyInTable = tableData.some(item => item?.PalletCode === scanInputValue);

    if (isPalletAlreadyInTable) {

      setTimeout(() => {
        setError('This pallet is already in the table');
      }, 400);
      return;
    }




    if (selectionType === 'Pallet') {
      //  check if the scanned value is already in the table

      // userRequest.get(`/getShipmentRecievedCLDataByPalletCodeAndBinLocation?palletCode=${scanInputValue}&binLocation=${selectedOption}`)
      // userRequest.post("/getMappedBarcodedsByPalletCodeAndBinLocation", {}, {
      userRequest.post("/getItemInfoByPalletCode", {}, {
        headers: {
          palletcode: scanInputValue,

        }
      })
        .then(response => {
          console.log(response?.data)
          // Append the new data to the existing data
          setTableData(prevData => [...prevData, ...response?.data])
          setScanInputValue('');

        })
        .catch(error => {
          console.log(error)
          // setError(error?.response?.data?.message ?? 'Cannot fetch location data');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.response?.data?.message ?? 'Cannot fetch location data',
          })
        })
    }
    else if (selectionType === 'Serial') {
      //  check if the scanned value is already in the table

      console.log("scan" + scanInputValue + "bin" + selectedOption)
      // userRequest.get(`/getShipmentRecievedCLDataBySerialNumberAndBinLocation?serialNumber=${scanInputValue}&binLocation=${selectedOption}`)
      userRequest.post("/getItemInfoByItemSerialNo", {}, {
        headers: {
          itemserialno: scanInputValue,

        }
      })
        .then(response => {
          console.log(response?.data)
          // Append the new data to the existing data
          setTableData(prevData => [...prevData, ...response?.data])
          setScanInputValue('');

        })
        .catch(error => {
          console.log(error)
          // setError(error?.response?.data?.message ?? 'Cannot fetch location data');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.response?.data?.message ?? 'Cannot fetch location data',
          })
        })
    }

    else {
      return;
    }

  }





  const handleSaveBtnClick = () => {
    // Create a new array
    if (QtyReceived >= parseInt(parsedData?.QTYTRANSFER)) {
      setError("Transfer is already completed");
      return;
    }



    if (tableData.length === 0) {
      setError("Please scan atleast one item");
      return;
    }


    if (!locationInputValue || locationInputValue === '') {
      setError("Please select a location");
      return;
    }

    const dataForAPI = tableData.map(row => {
      // Return a new object for each row of the table
      return {
        ...row, // Spread the fields from the current row of the table
        BinLocation: locationInputValue,
        ...parsedData, // Spread the fields from parsedData
        SELECTTYPE: selectionType, // Add the SELECTTYPE field
        MainLocation: locationInputValue?.substring(0, 2), // Add the MainLocation field by extracting the first two characters from the locationInputValue
        QTYRECEIVED: QtyReceived,

      };
    });

    if (dataForAPI.length + QtyReceived > parseInt(parsedData?.QTYTRANSFER)) {
      setError(`You can only scan ${parseInt(parsedData?.QTYTRANSFER) - QtyReceived} more items`);
      return;
    }
    // Now, you can send dataForAPI to the API endpoint
    userRequest.post("/insertTblTransferBinToBinCL", dataForAPI)
      .then(response => {
        console.log(response);
        // clear the table
        setTableData([]);
        // clear the location input
        setLocationInputValue('');
        // clear the scan input
        setScanInputValue('');
        // clear the selected option
        setSelectedOption('');
        // reset the autocomplete
        resetAutocomplete();
        setMessage("Data inserted successfully");
        setQtyReceived(QtyReceived + dataForAPI?.length)


      })
      .catch(error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.response?.data?.message ?? 'Cannot insert data',
        })
      });
  }








  return (
    <>

      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
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
                <span className='text-white -mt-7'>TRANSFER ID#:</span>
                <input
                  value={parsedData?.TRANSFERID}
                  className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Transfer ID Number"
                  disabled
                />

                {/* <div className='flex gap-2 justify-start items-center'> */}
                {/* <span className='text-white'>FROM:</span> */}
                <div className='flex items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>FROM:</span>
                  <span>{parsedData?.INVENTLOCATIONIDFROM}</span>
                </div>
                {/* <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                      block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                    onChange={handleFromSelect}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>Select an option</option>
                    {location
                      .filter(item => item.BinLocation) // this will filter out items where BinLocation is null, undefined or an empty string
                      .map((item, index) => {
                        return <option key={index} value={item.BinLocation}>{item.BinLocation}</option>
                      })}
                  </select> */}

                {/* </div> */}
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-base'>
                <div className='flex items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Item Code:</span>
                  <span>{parsedData?.ITEMID}</span>
                </div>

                <div className='flex flex-col gap-2'>
                  <div className='text-[#FFFFFF]'>
                    <span>CLASS {parsedData?.INVENTLOCATIONIDFROM}</span>
                  </div>


                  <div className='text-[#FFFFFF]'>
                    <span>GROUPID {parsedData.GROUPID}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className='flex gap-6 justify-center items-center text-xs mt-2 sm:mt-0 sm:text-lg'>
                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Quantity Transfer</span>
                    <span>{parsedData?.QTYTRANSFER}</span>
                  </div>

                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Quantity Received</span>
                    <span>{QtyReceived}</span>
                  </div>
                </div>
              </div>


              <div class="text-center">
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

            </div>

            <form
            //   onSubmit={handleFormSubmit}
            >
              <div className="mb-6">
                <label htmlFor='scan' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan {selectionType}#<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="scan"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={`Enter Scan/${selectionType} Number`}

                  // submit when focus removed
                  value={scanInputValue}
                  onChange={e => setScanInputValue(e.target.value)}
                  onBlur={handleScan}
                />
              </div>

              <div className='mb-6'>
                {/* // creae excel like Tables  */}
                <div className="table-location-generate1">
                  <table>
                    <thead>
                      <tr>
                        <th>Item Code</th>
                        <th>Item Description</th>
                        <th>GTIN</th>
                        <th>Remarks</th>
                        <th>User</th>
                        <th>Classification</th>
                        <th>Main Location</th>
                        <th>Bin Location</th>
                        <th>Internal Code</th>
                        <th>Item Serial Number</th>
                        <th>Map Date</th>
                        <th>Pallet Code</th>
                        <th>Reference</th>
                        <th>Shipment ID</th>
                        <th>Container ID</th>
                        <th>Purchase Order</th>
                        <th>Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
                        <tr key={"tranidRow" + index}>
                          <td>{data?.ItemCode}</td>
                          <td>{data?.ItemDesc}</td>
                          <td>{data?.GTIN}</td>
                          <td>{data?.Remarks}</td>
                          <td>{data?.User}</td>
                          <td>{data?.Classification}</td>
                          <td>{data?.MainLocation}</td>
                          <td>{data?.BinLocation}</td>
                          <td>{data?.IntCode}</td>
                          <td>{data?.ItemSerialNo}</td>
                          <td>{data?.MapDate}</td>
                          <td>{data?.PalletCode}</td>
                          <td>{data?.Reference}</td>
                          <td>{data?.SID}</td>
                          <td>{data?.CID}</td>
                          <td>{data?.PO}</td>
                          <td>{data?.Trans}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>


              </div >

            </form>

            <div className="mb-6">
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Location To:<span className='text-[#FF0404]'>*</span></label>


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

                      className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                      p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                      placeholder="TO Location"
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

            <div className='mb-6 flex justify-between items-center'>
              <button
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[25%]'>
                <span className='flex justify-center items-center'
                  onClick={handleSaveBtnClick}
                >
                  <p>Save</p>
                </span>
              </button>

              <div className='flex justify-end items-center gap-3'>
                <label htmlFor='totals' className="mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="totals"
                  className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[65%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Totals"
                  value={tableData.length}
                />
              </div>
            </div>
          </div>
        </div >
      </div >
    </>
  )
}

export default TransferID