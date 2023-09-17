import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./JournalMovementFirst.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Swal from 'sweetalert2';

const iconMui = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const JournalMovementFirst = () => {
  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [insertedData, setInsertedData] = useState([]);
  const [journalIdFilter, setJournalIdFilter] = useState(null);
  const [itemIdFilter, setItemIdFilter] = useState(null);
  const [binlocation, setBinLocation] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [currentUser, setCurrentUser] = useState(initialUser);

  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };


  useEffect(() => {
    setIsLoading(true);
    userRequest.get('/getWmsJournalMovementClByAssignedToUserId')
      .then((response) => {

        setData(response?.data);
        setFilteredData(response?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);





  const handleBinLocation = (e) => {
    e.preventDefault();
    console.log(data[0].BinLocation)
    console.log(binlocation)

    userRequest.put('/updateTblMappedBarcodeBinLocation', {}, {
      headers: {
        'oldbinlocation': data[0].BinLocation,
        'newbinlocation': binlocation
      }
    })
      .then((response) => {
        console.log(response);
        setMessage(response?.data?.message);
        // alert('done')
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.message);
        // alert(error)
      });
  }

  const handleFilterChange = (filterType, event, value) => {
    console.log(filterType, value);
    let newJournalIdFilter = journalIdFilter;
    let newItemIdFilter = itemIdFilter;

    if (filterType === 'journalId') {
      newJournalIdFilter = value;
      setJournalIdFilter(value);
    } else if (filterType === 'itemId') {
      newItemIdFilter = value;
      setItemIdFilter(value);
    }

    let newFilteredData = [...data];

    if (newJournalIdFilter) {
      newFilteredData = newFilteredData.filter(item => item?.JOURNALID === newJournalIdFilter);
    }
    if (newItemIdFilter) {
      newFilteredData = newFilteredData.filter(item => newItemIdFilter.includes(item?.ITEMID));
    }

    setFilteredData(newFilteredData);
  }


  const handleSerialScan = async (e) => {
    let itemSerialNo = e.target.value;
    if (!itemSerialNo) {
      return;
    }
    console.log(itemSerialNo)
    setIsLoading(true);
    try {

      const { data: validationData } = await userRequest.post("/validateItemSerialNumberForJournalMovementCLDets", { itemSerialNo });
      const mappedData = validationData?.data?.[0];

      const foundRecord = filteredData?.find(item => item.ITEMID.trim() === mappedData.ItemCode.trim());

      if (!foundRecord) {
        // setError(`MappedBarcode ItemID: ${mappedData.ItemCode} not found in the list!`);
        // show message using swal
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `MappedBarcode ItemID: ${mappedData.ItemCode} not found in the list!`,
          // change button text to Scan Again
          confirmButtonText: 'Scan Again',
          confirmButtonColor: '#FFA500',

        }).then((result) => {
          if (result.isConfirmed) {
            // clear the input field
            e.target.value = "";
            e.target.focus();
          }
        })
        return;
      }

      const updateDataResponse = await userRequest.put("/updateWmsJournalMovementClQtyScanned", {
        ITEMID: foundRecord?.ITEMID,
        JOURNALID: foundRecord?.JOURNALID,
        TRXUSERIDASSIGNED: foundRecord?.TRXUSERIDASSIGNED,

      });

      const dataToInsert = updateDataResponse?.data?.updatedRow;

      dataToInsert.ITEMSERIALNO = itemSerialNo;

      const insertResponse = await userRequest.post("/insertJournalMovementCLDets", [dataToInsert]);
      console.log(insertResponse);
      setMessage(insertResponse?.data?.message ?? "Insertion Successful!");
      setInsertedData(prevState => [...prevState, dataToInsert]);

      // replace the found record with updated record
      const newFilteredData = filteredData.map(item => {
        if (item.ITEMID.trim() === dataToInsert.ITEMID.trim()) {
          return dataToInsert;
        }
        return item;
      });

      setFilteredData(newFilteredData);

    }
    catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Error: ${error.response?.data?.message ?? error.message ?? "Something went wrong!"}`,
        confirmButtonText: 'Scan Again',
        confirmButtonColor: '#FFA500',
      }).then((result) => {
        if (result.isConfirmed) {
          // clear the input field
          e.target.value = "";
          // focus on the input field
          e.target.focus();
        }
      })

    }
    finally {
      setIsLoading(false);
    }

  }







  return (
    <>
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}


      {
        isLoading &&

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

                <h2 className='text-center text-[#fff]'>Journal Movement Screen</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>

            <div className=''>
              <h2 className='text-[#00006A] text-center font-semibold'>Current Logged in User ID:<span className='text-[#FF0404]' style={{ "marginLeft": "5px" }}>{currentUser?.UserID}</span></h2>
            </div>

            <div className="mb-6 mt-6">
              <label htmlFor="journalMovementjournalIdFilter" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Journal Id</label>
              <Autocomplete
                id="journalMovementjournalIdFilter"
                options={Array.from(new Set(data?.map(item => item?.JOURNALID))).filter(Boolean)}
                getOptionLabel={(option) => option || ""}
                onChange={(event, value) => handleFilterChange('journalId', event, value)}

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
                    placeholder="Select Journal Id to filter"

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
            <div className="mb-6 mt-6">
              <label htmlFor="journalMovementitemIdFilter" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Item Id</label>
              <Autocomplete
                id="journalMovementitemIdFilter"
                multiple
                disableCloseOnSelect
                options={Array.from(new Set(data?.map(item => item?.ITEMID))).filter(Boolean)}
                getOptionLabel={(option) => option || ""}
                onChange={(event, value) => handleFilterChange('itemId', event, value)}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={iconMui}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                )}
                onInputChange={(event, value) => {
                  if (!value) {
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
                    placeholder="Select Item Id to filter"
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

            <div className='mt-6'>
              <label className='text-[#00006A] font-semibold'>List of Items on Journal Movement<span className='text-[#FF0404]'>*</span></label>
              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ITEMID</th>
                      <th>ITEMNAME</th>
                      <th>QTY</th>
                      <th>QTYSCANNED</th>
                      <th>QTYDIFFERENCE</th>
                      <th>LEDGERACCOUNTIDOFFSET</th>
                      <th>JOURNALID</th>
                      <th>TRANSDATE</th>
                      <th>INVENTSITEID</th>
                      <th>INVENTLOCATIONID</th>
                      <th>CONFIGID</th>
                      <th>WMSLOCATIONID</th>
                      <th>TRXDATETIME</th>
                      <th>TRXUSERIDASSIGNED</th>
                      <th>TRXUSERIDASSIGNEDBY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.map((item, index) => (
                      <tr key={index}

                      >
                        <td>{item.ITEMID}</td>
                        <td>{item.ITEMNAME}</td>
                        <td>{item.QTY}</td>
                        <td>{item.QTYSCANNED}</td>
                        <td>{item.QTYDIFFERENCE}</td>
                        <td>{item.LEDGERACCOUNTIDOFFSET}</td>
                        <td>{item.JOURNALID}</td>
                        <td>{item.TRANSDATE}</td>
                        <td>{item.INVENTSITEID}</td>
                        <td>{item.INVENTLOCATIONID}</td>
                        <td>{item.CONFIGID}</td>
                        <td>{item.WMSLOCATIONID}</td>
                        <td>{item.TRXDATETIME}</td>
                        <td>{item.TRXUSERIDASSIGNED}</td>
                        <td>{item.TRXUSERIDASSIGNEDBY}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>

            <form >

              <div className='mt-6'>
                <div className='w-full flex justify-end place-items-end'>
                  <div className='flex justify-center items-center gap-2'>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                    <input
                      id="totals"
                      className="bg-gray-50 font-semibold text-center placeholder:text-[#00006A] border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Totals"
                      value={filteredData.length}
                    />
                  </div>
                </div>



                {/* New Input Added Serial Number */}
                <div className="mb-6">
                  <label htmlFor='scan' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Serial#<span className='text-[#FF0404]'>*</span></label>
                  <input
                    id="scan"
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={'Scan Serial'}
                    onBlur={(e) => { handleSerialScan(e) }}
                  />
                </div>

                {/* New Table Added */}
                <div className='mt-6'>
                  <div className="table-location-generate1">
                    <table>
                      <thead>
                        <tr>
                          <th>ITEM ID</th>
                          <th>ITEM NAME</th>
                          <th>ITEM SERIAL NO</th>
                          <th>QTY</th>
                          <th>LEDGER ACCOUNT ID OFFSET</th>
                          <th>JOURNALID</th>
                          <th>TRANSDATE</th>
                          <th>INVENTSITEID</th>
                          <th>INVENT LOCATION ID</th>
                          <th>CONFIGID</th>
                          <th>WMSLOCATIONID</th>
                          <th>TRXDATETIME</th>
                          <th>TRXUSERIDASSIGNED</th>
                          <th>TRXUSERIDASSIGNEDBY</th>

                          <th>QTYSCANNED</th>
                          <th>QTYDIFFERENCE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insertedData?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.ITEMID}</td>
                            <td>{item.ITEMNAME}</td>
                            <td>{item.ITEMSERIALNO}</td>
                            <td>{item.QTY}</td>
                            <td>{item.LEDGERACCOUNTIDOFFSET}</td>
                            <td>{item.JOURNALID}</td>
                            <td>{item.TRANSDATE}</td>
                            <td>{item.INVENTSITEID}</td>
                            <td>{item.INVENTLOCATIONID}</td>
                            <td>{item.CONFIGID}</td>
                            <td>{item.WMSLOCATIONID}</td>
                            <td>{item.TRXDATETIME}</td>
                            <td>{item.TRXUSERIDASSIGNED}</td>
                            <td>{item.TRXUSERIDASSIGNEDBY}</td>

                            <td>{item.QTYSCANNED}</td>
                            <td>{item.QTYDIFFERENCE}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </div>
                </div>

                {/* New Table Length  */}
                <div className='flex justify-end items-center gap-2 mt-6'>
                  <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                  <input
                    id="totals"
                    className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[30%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Totals"
                    value={filteredData.length}
                  />
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default JournalMovementFirst


