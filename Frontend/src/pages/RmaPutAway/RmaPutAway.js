import React, { useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./RmaPutAway.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';

const WmsCycleCounting = () => {
  const navigate = useNavigate();

  const autocompleteRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [binlocation, setBinlocation] = useState('');
  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};
  const [location, setLocation] = useState([])
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const resetAutocomplete = () => {
    setAutocompleteKey(key => key + 1); // Update the key to reset the Autocomplete
  };
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  useEffect(() => {
    const getRmaReturn = async () => {
      try {
        const res = await userRequest.get("/getWmsReturnSalesOrderClByAssignedToUserId")
        console.log(res?.data);
        setData(res?.data ?? [])
        setIsLoading(false)
      }
      catch (error) {
        console.log(error);
        setError(error?.response?.data?.message ?? 'Something went wrong')
        setIsLoading(false)
      }
    };

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
    getRmaReturn();
  }, []);
  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!binlocation) {
  //     setError("Please enter bin location");
  //     return;
  //   }
  //   setIsLoading(true);

  //   const mappedData = data.map((item) => ({
  //     // itemcode: item?.ITEMID
  //     // if null then don't send itemcode in the request
  //     ...(item?.ITEMID && { itemcode: item?.ITEMID }),
  //     itemdesc: item?.NAME,
  //     classification: item?.RETURNITEMNUM,
  //     mainlocation: item?.INVENTSITEID,
  //     binlocation: binlocation,
  //     intcode: item?.CONFIGID,
  //     itemserialno: item?.ITEMSERIALNO,
  //     mapdate: item?.TRXDATETIME ?? "",
  //     user: item?.ASSIGNEDTOUSERID ?? "",
  //     gtin: "", // Add any default or empty values for the new fields in the API
  //     remarks: "",
  //     palletcode: "",
  //     reference: "",
  //     sid: "",
  //     cid: "",
  //     po: "",

  //   }));
  //   console.log(mappedData);

  //   try {
  //     const res = await userRequest.post("/insertManyIntoMappedBarcode", { records: mappedData });
  //     console.log(res?.data);
  //     setIsLoading(false);
  //     setMessage("Data Inserted Successfully.");
  //     // Clear form fields and data state
  //     setBinlocation("");
  //     setData([]);
  //   } catch (error) {
  //     console.log(error);
  //     setError(error?.response?.data?.message ?? "Something went wrong");
  //     setIsLoading(false);
  //   }
  // };
  const handleFromSelect = (event, value) => {
    setBinlocation(value);

  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!binlocation) {
      setError("Please enter bin location");
      return;
    }

    // Check if any row is selected
    if (selectedRows.length === 0) {
      setError("Please select at least one row");
      return;
    }
    
    setIsLoading(true);
  
    const selectedData = selectedRows.map((index) => data[index]); // Filter the selected rows from the data array
  
    const mappedData = selectedData.map((item) => ({
      ...(item?.ITEMID && { itemcode: item?.ITEMID }),
      itemdesc: item?.NAME,
      classification: item?.RETURNITEMNUM,
      mainlocation: item?.INVENTSITEID,
      binlocation: binlocation,
      intcode: item?.CONFIGID,
      itemserialno: item?.ITEMSERIALNO,
      mapdate: item?.TRXDATETIME ?? "",
      user: item?.ASSIGNEDTOUSERID ?? "",
      gtin: "",
      remarks: "",
      palletcode: "",
      reference: "",
      sid: "",
      cid: "",
      po: "",
    }));
    console.log(mappedData);
  
    try {
      const res = await userRequest.post("/insertManyIntoMappedBarcode", { records: mappedData });
      console.log(res?.data);
      setIsLoading(false);
      setMessage("Data Inserted Successfully.");
      // Clear form fields and data state
      setBinlocation("");
      setData([]);
      setSelectedRows([]); // Clear selected rows after successful insertion
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message ?? "Something went wrong");
      setIsLoading(false);
    }
  };
  


   // State to keep track of the selected rows
   const [selectedRows, setSelectedRows] = useState([]);

    // Function to handle row selection
  // const handleRowSelect = (index) => {
  //   if (selectedRows.includes(index)) {
  //     setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
  //   } else {
  //     setSelectedRows([...selectedRows, index]);
  //   }
  // };

  const handleRowSelect = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
  


  return (
    <>
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


      {isLoading &&

        <div className='loading-spinner-background'
          style={{
            zIndex: 9999, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed'


          }}
        >
          <SyncLoader

            size={18}
            color={"#FFA500"}
            // height={4}
            loading={isLoading}
          />
        </div>
      }

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-[white] text-center font-semibold'>Current Logged in User ID:<span className='text-[white]' style={{ "marginLeft": "5px" }}>{initialUser?.UserID}</span></h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>

            </div>


<div className='mb-6'>
      <label className='text-[#00006A] font-semibold'>List of RMA PutAway<span className='text-[#FF0404]'>*</span></label>
      {/* // create excel-like Tables  */}
      <div className="table-location-generate1">
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>ITEMID</th>
              <th>NAME</th>
              <th>EXPECTEDRETQTY</th>
              <th>SALESID</th>
              <th>RETURNITEMNUM</th>
              <th>INVENTSITEID</th>
              <th>INVENTLOCATIONID</th>
              <th>CONFIGID</th>
              <th>WMSLOCATIONID</th>
              <th>ASSIGNEDTOUSERID</th>
              <th>TRXDATETIME</th>
              <th>TRXUSERID</th>
              <th>ITEMSERIALNO</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                // Apply a different class to the selected row
                className={selectedRows.includes(index) ? 'selected' : ''}
                onClick={() => handleRowSelect(index)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleRowSelect(index)}
                  />
                </td>
                <td>{item.ITEMID}</td>
                <td>{item.NAME}</td>
                <td>{item.EXPECTEDRETQTY}</td>
                <td>{item.SALESID}</td>
                <td>{item.RETURNITEMNUM}</td>
                <td>{item.INVENTSITEID}</td>
                <td>{item.INVENTLOCATIONID}</td>
                <td>{item.CONFIGID}</td>
                <td>{item.WMSLOCATIONID}</td>
                <td>{item.ASSIGNEDTOUSERID}</td>
                <td>{item.TRXDATETIME}</td>
                <td>{item.TRXUSERID}</td>
                <td>{item.ITEMSERIALNO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

          

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




            <form onSubmit={handleFormSubmit}>
              <div className='mt-6'>
                <div className='w-full flex justify-between place-items-end'>
                  <div className='w-full'>
                    <button
                      type='submit'
                      className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[35%]'>
                      <span className='flex justify-center items-center'
                      >
                        <p>Save</p>
                      </span>
                    </button>
                  </div>


                  <div>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                    <input
                      id="totals"
                      className="bg-gray-50 font-semibold text-center placeholder:text-[#00006A] border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Totals"
                      value={data.length}
                    />
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default WmsCycleCounting


