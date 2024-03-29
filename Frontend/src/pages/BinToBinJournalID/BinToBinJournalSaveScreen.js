import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./BinToBinJournalSaveScreen.css";
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';

const BinToBinJournalSaveScreen = () => {
  const navigate = useNavigate();
  const autocompleteRef = useRef();
  const [location, setLocation] = useState([])
  const [scanInputValue, setScanInputValue] = useState('');
  const [selectionType, setSelectionType] = useState('Pallet');
  const [locationInputValue, setLocationInputValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  // to reset snakebar messages
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const resetAutocomplete = () => {
    setAutocompleteKey(key => key + 1); // Update the key to reset the Autocomplete
  };
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  useEffect(() => {
    const getLocationData = async () => {
      try {
        const res = await userRequest.get("/getAllTblLocationsCL")
        console.log(res?.data)
        setLocation(res?.data ?? [])

      }
      catch (error) {
        console.log(error)
        setError(error?.response?.data?.message ?? 'Cannot fetch location data');

      }
    }

    getLocationData();

  }, []);

  // retrieve data from session storage
  const storedData = sessionStorage.getItem('journalRowData');
  const parsedData = JSON.parse(storedData);

  const handleScan = (e) => {
    e.preventDefault();
    if (scanInputValue === '') {
      return;
    }
    if (selectionType === 'Pallet') {
      //  check if the scanned value is already in the table
      const isAlreadyInTable = tableData.some(item => item.PalletCode === scanInputValue);
      if (isAlreadyInTable) {
        setTimeout(() => {
          setError('This pallet is already in the table');
        }, 400);
        return;
      }




      userRequest.post("/getMappedBarcodedsByPalletCodeAndBinLocation", {}, {
        headers: {
          palletcode: scanInputValue,
          binlocation: parsedData.WMSLOCATIONID,
        }
      }
      )
        .then(response => {
          console.log(response?.data)
          // Append the new data to the existing data
          setTableData(prevData => [...prevData, ...response?.data])

        })
        .catch(error => {
          console.log(error)
          setError(error?.response?.data?.message ?? 'Cannot fetch location data');

        })
    }
    else if (selectionType === 'Serial') {
      //  check if the scanned value is already in the table
      const isAlreadyInTable = tableData.some(item => item.SERIALNUM === scanInputValue);

      if (isAlreadyInTable) {
        setError('This serial is already in the table');
        return;
      }
      // userRequest.post("/getMappedBarcodedsByItemSerialNoAndBinLocation", {}, { headers: { itemserialno: scanInputValue, binlocation: parsedData.WMSLOCATIONID } })
      userRequest.post("/getMappedBarcodedsByItemCodeAndBinLocation", {}, { headers: { itemcode: scanInputValue, binlocation: parsedData.WMSLOCATIONID } })
        .then(response => {
          console.log(response?.data)
          // Append the new data to the existing data
          setTableData(prevData => [...prevData, ...response?.data])

        })
        .catch(error => {
          console.log(error)
          setError(error?.response?.data?.message ?? 'Cannot fetch location data');

        })
    }

    else {
      return;
    }

  }

  const handleBinUpdate = (e) => {

    e.preventDefault();
    if (tableData.length === 0) {
      setError('Please scan some items first');
      return;
    }
    if (locationInputValue === '') {
      setError('Please enter a bin location');
      return;
    }
    userRequest.put('/updateTblMappedBarcodeBinLocationWithSelectionType', {}, {
      headers: {
        'oldbinlocation': parsedData?.WMSLOCATIONID,
        'newbinlocation': locationInputValue,
        selectiontype: selectionType,
        selectiontypevalue: scanInputValue

      }
    })
      .then((response) => {
        console.log(response);
        setMessage(response?.data?.message ?? 'Bin location updated successfully');
        // alert('done')
        // clear the table
        setTableData([]);
        // clear the location input
        setLocationInputValue('');
        // clear the scan input
        setScanInputValue('');
        // remove the specfic item from the list in allJournalRows in session storage on the basis of ITEMID
        const allJournalRows = JSON.parse(sessionStorage.getItem('allJournalRows'));
        const updatedJournalRows = allJournalRows.filter(item => item.ITEMID !== parsedData.ITEMID);
        sessionStorage.setItem('allJournalRows', JSON.stringify(updatedJournalRows));
        setTimeout(() => {
          navigate("/bintobin2");
        }
          , 1000);

      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.message ?? 'Cannot update bin location');
        // alert(error)
      });
  }

  const handleFromSelect = (event, value) => {
    setLocationInputValue(value);

  };

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
                <span className='text-white -mt-7'>Journal ID#:</span>
                <input
                  //   value={parsedData.TRANSFERID}
                  className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Transfer ID Number"
                  value={parsedData?.JOURNALID}
                  disabled
                />

                <div className='flex gap-2 justify-center items-center'>
                  <span className='text-white'>FROM:</span>
                  <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Location Reference"
                    value={parsedData?.WMSLOCATIONID}
                    disabled
                  />
                </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Item ID:</span>
                  <span>{parsedData.ITEMID}</span>
                </div>

                <div className='text-[#FFFFFF]'>
                  {/* <span>CLASS {parsedData.INVENTLOCATIONIDFROM}</span> */}
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
                    <span>{tableData.length}</span>
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
                <label htmlFor='scan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan {selectionType}#<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="scan"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={`Enter Scan / ${selectionType} Number`}

                  // submit when focus removed
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
                        <th>PO</th>
                        <th>Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
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

            <div className='mb-6 flex justify-center items-center'>
              <button
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[25%]'>
                <span className='flex justify-center items-center'
                  onClick={handleBinUpdate}
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

export default BinToBinJournalSaveScreen