import React, { useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
// import "./WmsProfitLoss.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import UserDataTable from '../../components/UserDatatable/UserDataTable';
import { wmsInventoryColumns } from '../../utils/datatablesource';
import { TextField, Autocomplete, CircularProgress, Checkbox } from '@mui/material';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { useQuery } from '@tanstack/react-query';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const iconMui = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const WmsInventory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [assignedTo, setAssignedTo] = useState(null);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemCodeFilterList, setItemCodeFilterList] = useState([]);
  const [uniqueItemCodeFilterList, setUniqueItemCodeFilterList] = useState([]);
  const [classificationFilterList, setClassificationFilterList] = useState([]);
  const previousLocationsRef = useRef([]);
  const [selectionType, setSelectionType] = useState('itemCode');
  const [dataGridbinLocationsList, setDataGridbinLocationsList] = useState([]);
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };
  const autocompleteRef = useRef(); // Ref to access the Autocomplete component
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const [binLocationsList, setBinLocationsList] = useState([]);
  // const resetAutocomplete = () => {
  //   setLocationInputValue(''); // Clear the location input value
  //   setAutocompleteKey(key => key + 1); // Update the key to reset the Autocomplete
  // };

  const [userList, setUserList] = useState([]);
  useEffect(() => {
    userRequest.get('/getAllTblUsers')
      .then(response => {

        setUserList(response?.data ?? []);
      })
      .catch(error => {
        console.error(error);
        setError(error?.response?.data?.message ?? 'Something went wrong!');

      });



  }, []);

  const handleAutoComplete = (event, value) => {
    console.log('Selected value:', value?.UserID);

    setAssignedTo(value?.UserID ?? '');
  };





  const handleRowClickInParent = (row) => {
    // check if the selected row is already selected using ITEMID
    // if (selectedRows.some(item => item?.ITEMID === row?.ITEMID)) {
    //   // If the clicked row is already selected, deselect it
    //   setSelectedRows(prevSelectedRows => prevSelectedRows.filter(item => item?.ITEMID !== row?.ITEMID));

    // } else {
    //   // If the clicked row is not selected, select it
    //   setSelectedRows(prevSelectedRows => [...prevSelectedRows, row]);
    // }
    return;
  }



  // handle the save button click
  const handleSaveBtnClick = async () => {

    if (!assignedTo) {
      setError('Please select the assigned to user!');
      return;
    }
    if (filteredData?.length === 0) {
      setError('Please select the bin locations!');
      return;
    }
    try {
      setIsLoading(true);

      let apiData = filteredData?.map(row => {
        return {
          // ...row,
          TRXUSERIDASSIGNED: assignedTo,
          INVENTORYBY: selectionType,
          BINLOCATION: row?.BinLocation,
          ITEMID: row?.ItemCode,
          ITEMNAME: row?.ItemDesc,
          CLASSFICATION: row?.Classification,
        }
      });


      const res = await userRequest.post('/insertIntoWmsJournalCountingOnlyCL', apiData)

      setMessage(res?.data?.message ?? 'Data saved successfully!');
      Reset()
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message ?? 'Something went wrong!');
    }
    finally {
      setIsLoading(false);
    }
  }




  const {
    isLoading: stockMasterLoading,
    error: stockMasterError,
    data: stockMasterData
  } = useQuery({
    queryKey: ['stockMaster'],
    queryFn: () =>
      userRequest.get("/getDistinctMappedBarcodeBinLocations").then(

        (res) => res.data,
      ),
  })


  useEffect(() => {
    if (stockMasterData) {
     
      setBinLocationsList(stockMasterData);
    }
  }, [stockMasterData]);

  useEffect(() => {
    if (stockMasterError) {
      setError('An error has occurred: ' + stockMasterError.message);
    }
  }, [stockMasterError]);

  const {
    isLoading: uniqueItemIdLoading,
    error: uniqueItemIdError,
    data: uniqueItemData
  } = useQuery({
    queryKey: ['uniqueItemIds'],
    queryFn: () =>
      userRequest.get("/getDistinctMappedBarcodeItemIds").then(

        (res) => res.data,
      ),
  })


  useEffect(() => {
    if (uniqueItemData) {
     
      setUniqueItemCodeFilterList(uniqueItemData);
    }
  }, [uniqueItemData]);

  useEffect(() => {
    if (uniqueItemIdError) {
      setError('An error has occurred: ' + uniqueItemIdError.message);
    }
  }, [uniqueItemIdError]);

  const handleBinLocationSelect = async (e, value, reason) => {
    console.log(reason)
    console.log(value);

    // If reason is clear or reset, clear the data and return
    if (reason === 'clear' || reason === 'reset') {
      setData([]);
      setFilteredData([]);
      console.log("Input cleared");
      previousLocationsRef.current = [];
      return;
    }

    // If a location was unselected
    if (value.length < previousLocationsRef.current.length) {
      const removedLocation = previousLocationsRef.current.find(loc => !value.includes(loc));
      if (removedLocation) {
        const newFilteredData = filteredData.filter(item => item.BinLocation !== removedLocation);
        setFilteredData(newFilteredData);
        previousLocationsRef.current = value;
        return; // Exit without making an API call
      }
    }
    setIsLoading(true)
    try {
      const res = await userRequest.post("/getmapBarcodeDataByMultipleBinLocations", {
        binLocations: value
      })
      console.log(res?.data);
      const data = res?.data ?? [];
      setData(data);
      setFilteredData(data);
    }
    catch (error) {
      console.log(error);
      setError(error?.response?.data?.message ?? 'Something went wrong!');
    }
    finally {
      setIsLoading(false)
    }

    previousLocationsRef.current = value;

  }
  const handleGridBinLocationSelect = async (e, value, reason) => {

    console.log('Selected value:', value);

    // If reason is clear or reset, clear the data and return
    if (reason === 'clear' || reason === 'reset') {
      console.log("Input cleared");
      setFilteredData(data);

      return;
    }

    if (value.length === 0) {
      setFilteredData(data);
      return;
    }



    // filter filteredData on the basis of selected bin locations
    const newFilteredData = data.filter(item => value.includes(item.BinLocation));
    setFilteredData(newFilteredData);



  }
  const handleUniqueItemIdFilter = async (e, value) => {

    console.log(value);
    if (!value) {
      setData([]);
      setFilteredData([]);
      console.log("Input cleared");
    }

    setIsLoading(true)
    try {
      const res = await userRequest.post("/getDistinctMapBarcodeDataByItemCode", {},
        {
          headers: {
            itemcode: value
          }
        })
      
      const data = res?.data ?? [];
      setData(data);
      setFilteredData(data);

      const dataGridbinLocationsList = Array.from(new Set(data?.map(item => item?.BinLocation))).filter(Boolean);
     
      setDataGridbinLocationsList(dataGridbinLocationsList);

    }
    catch (error) {
      console.log(error);
      setError(error?.response?.data?.message ?? 'Something went wrong!');
    }
    finally {
      setIsLoading(false)
    }


  }
  const handleClassificationFilter = (event, value) => {
    setSelectedClassification(value);
  };

  const handleItemIdFilter = (event, value) => {
    setSelectedItemId(value);
  };

  useEffect(() => {
    const classificationOptions = Array.from(new Set(filteredData.map(item => item?.Classification))).filter(Boolean);
    const itemIdOptions = Array.from(new Set(filteredData.map(item => item?.ItemCode))).filter(Boolean);
    setItemCodeFilterList(itemIdOptions);
    setClassificationFilterList(classificationOptions);

  }, [filteredData]);

  useEffect(() => {
    filterData(selectedClassification, selectedItemId);
  }, [selectedClassification, selectedItemId]);

  const filterData = (classification, itemId) => {
    let newFilteredData = [...data];

    if (classification) {
      newFilteredData = newFilteredData.filter(item => item?.Classification === classification);
    }
    if (itemId) {
      newFilteredData = newFilteredData.filter(item => item?.ItemCode === itemId);
    }

    setFilteredData(newFilteredData);
  };

  const handleRadioChange = (e) => {
    setSelectionType(e.target.value);
    Reset()
  };


  const Reset = () => {

    setData([]);
    setFilteredData([]);
    setItemCodeFilterList([]);
    setClassificationFilterList([]);
    setSelectedClassification(null);
    setSelectedItemId(null);
    setDataGridbinLocationsList([]);
    previousLocationsRef.current = [];
    setAutocompleteKey(key => key + 1);
  }





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

      <div className="before:animate-pulse before:bg-gradient-to-b " style={{ minHeight: '550px' }}>
        <div className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg" style={{ minHeight: '550px' }}>
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-center text-[#fff]'>WMS Inventory (Assign)</h2>



                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
              {/* <h2 className='text-center text-[#fff]'>By Item ID</h2> */}

            </div>


            <div className='mt-6'>
              <h2 className='text-[#00006A] text-center font-semibold'>Current Logged in User ID:<span className='text-[#FF0404]' style={{ "marginLeft": "5px" }}>{currentUser?.UserID}</span></h2>
            </div>

            <div className="mb-6 mt-4">
              <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
              >
                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="selectionType"
                    value="itemCode"
                    checked={selectionType === 'itemCode'}
                    onChange={e => handleRadioChange(e)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-[#00006A]">By Item Code</span>
                </label>
                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="selectionType"
                    value="binLocation"
                    checked={selectionType === 'binLocation'}
                    onChange={e => handleRadioChange(e)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-[#00006A]">By Bin Locations</span>
                </label>

              </div>
            </div>

            {selectionType === 'itemCode' && (
              <div className="mb-6 mt-6">
                <label htmlFor="uniqureItemIds" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Item Id</label>
                <Autocomplete
                  id="uniqureItemIds"
                  ref={autocompleteRef}
                  key={`itemCodebinLocaton ${autocompleteKey}`}

                  options={Array.from(new Set(uniqueItemCodeFilterList?.map(item => item?.ItemCode))).filter(Boolean)}
                  getOptionLabel={(option) => option || ""}
                  onChange={handleUniqueItemIdFilter}
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
                      placeholder="Select Item ID to filter"

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
            )}
            {filteredData?.length > 0 && selectionType === 'itemCode' && (
              <div className="mt-6">
                {/* <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Bin Locations<span className='text-[#FF0404]'>*</span></label> */}

                <div className='w-full'>
                  <Autocomplete
                    ref={autocompleteRef}
                    key={`itemCodebinLocaton ${autocompleteKey}`}
                    multiple

                    disableCloseOnSelect
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
                    id="location"
                    options={Array.from(new Set(dataGridbinLocationsList)).filter(Boolean)}
                    getOptionLabel={(option) => option}
                    onChange={handleGridBinLocationSelect}


                    onInputChange={(event, value) => {
                      if (!value) {
                        // perform operation when input is cleared
                        console.log("Input cleared");

                      }
                    }}
                    // renderInput={(params) => (
                    //   <TextField
                    //     {...params}
                    //     InputProps={{
                    //       ...params.InputProps,
                    //       className: "text-white",
                    //     }}
                    //     InputLabelProps={{
                    //       ...params.InputLabelProps,
                    //       style: { color: "white" },
                    //     }}

                    //     className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    //     p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                    //     placeholder="TO Location"
                    //     required
                    //   />
                    // )
                    renderInput={(params) => (
                      <TextField {...params} label="Bin Locaions" placeholder="select locations" />
                    )


                    }
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
            )}
            {selectionType === 'binLocation' && (
              <div className="mt-6">
                {/* <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Bin Locations<span className='text-[#FF0404]'>*</span></label> */}

                <div className='w-full'>
                  <Autocomplete
                    multiple
                    ref={autocompleteRef}
                    key={`binLocaton ${autocompleteKey}`}
                    disableCloseOnSelect
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
                    id="location"
                    options={Array.from(new Set(binLocationsList?.map(item => item?.BinLocation))).filter(Boolean)}
                    getOptionLabel={(option) => option}
                    onChange={handleBinLocationSelect}


                    onInputChange={(event, value) => {
                      if (!value) {
                        // perform operation when input is cleared
                        console.log("Input cleared");

                      }
                    }}

                    renderInput={(params) => (
                      <TextField {...params} label="Bin Locaions" placeholder="select locations" />
                    )


                    }
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
            )}








            {filteredData.length > 0 && selectionType === "binLocation" && (
              <div className="mb-6 mt-6">
                <label htmlFor="itemIdFilter" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Item Id</label>
                <Autocomplete
                  id="itemIdFilter"
                  ref={autocompleteRef}
                  key={`itemId ${autocompleteKey}`}
                  options={itemCodeFilterList}
                  getOptionLabel={(option) => option || ""}
                  onChange={handleItemIdFilter}
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
                      placeholder="Select Item ID to filter"

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
            )}

            {filteredData.length > 0 && (
              <div className="mb-6 mt-6">
                <label htmlFor="classificationFilter" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Classification</label>
                <Autocomplete
                  id="classificationFilter"
                  ref={autocompleteRef}
                  key={`Classification ${autocompleteKey}`}
                  options={classificationFilterList}
                  getOptionLabel={(option) => option || ""}
                  onChange={handleClassificationFilter}
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
                      placeholder="Select Classification to filter"

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
            )}
            <div className='mt-3'
              style={{
                marginLeft: "-20px", marginRight: "-20px"
              }}
            >
              <UserDataTable data={filteredData} columnsName={wmsInventoryColumns} backButton={false}
                handleRowClickInParent={handleRowClickInParent}
                actionColumnVisibility={false}
                buttonVisibility={false}
                secondaryColor="secondary"
                uniqueId={"mobileWmsInventoryId"}
                checkboxSelection={"disabled"}

              />
            </div>

            <div className="mt-6">
              <label htmlFor="userid" className="text-[#00006A] text-center font-semibold">ASSIGN<span className='text-[#FF0404]'>*</span></label>

              <Autocomplete
                id="userid"
                ref={autocompleteRef}
                key={`userid ${autocompleteKey}`}
                options={userList}
                //   getOptionLabel={(option) => option.Fullname ?? ''}
                getOptionLabel={(option) => option.Fullname ? `${option.Fullname} - ${option.UserID}` : ''}
                onChange={handleAutoComplete}

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

                    className="bg-gray-50 border border-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                    placeholder="Assign User"
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


            <div className='mt-6'>
              <button onClick={handleSaveBtnClick}
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[25%]'>
                <span className='flex justify-center items-center'
                >
                  <p>Save</p>
                </span>
              </button>
            </div>

          </div>
        </div>
      </div >
    </>
  )
}

export default WmsInventory


