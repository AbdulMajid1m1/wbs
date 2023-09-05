import React, { useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
// import "./WmsProfitLoss.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import UserDataTable from '../../components/UserDatatable/UserDataTable';
import { AllItems, MappedItemsColumn } from '../../utils/datatablesource';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { useQuery } from '@tanstack/react-query';

const WmsInventory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [assignedTo, setAssignedTo] = useState(initialUser?.UserID ?? '');

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBy, setSelectedBy] = useState('itemId and bin location');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemCodeFilterList, setItemCodeFilterList] = useState([]);
  const [classificationFilterList, setClassificationFilterList] = useState([]);
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

    if (assignedTo === '') {
      setError('Please select the assigned to user!');
      return;
    }
    try {
      let apiData = selectedOption.map(row => {
        return {
          ...row,
          TRXUSERIDASSIGNED: assignedTo,
          INVENTORYBY: selectedBy,
          // BINLOCATION: location,
        }
      });

      console.log(apiData);
      const res = await userRequest.post('/insertIntoWmsJournalCountingOnlyCL', apiData)
      console.log(res);
      setMessage(res?.data?.message ?? 'Data saved successfully!');

      // filter out the selected rows from the data array on the basis of ITEMID on both arrays of objects
      // setData(data.filter(item => !selectedRows.some(row => row?.ITEMID === item?.ITEMID)));
      setData([])


    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message ?? 'Something went wrong!');
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
      console.log(stockMasterData);
      setBinLocationsList(stockMasterData);
    }
  }, [stockMasterData]);

  useEffect(() => {
    if (stockMasterError) {
      setError('An error has occurred: ' + stockMasterError.message);
    }
  }, [stockMasterError]);

  const handleBinLocationSelect = async (e, value) => {

    console.log('Selected value:', value);
    if (!value) {
      console.log("Input cleared");
      return;
    }
    setIsLoading(true)
    try {
      const res = await userRequest.get("/getmapBarcodeDataByBinLocation?BinLocation=" + value)
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

                <h2 className='text-center text-[#fff]'>WMS Inventory</h2>



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
            <div className="mt-6">
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Bin Locations<span className='text-[#FF0404]'>*</span></label>

              <div className='w-full'>
                <Autocomplete
                  ref={autocompleteRef}
                  key={autocompleteKey}
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


            {filteredData.length > 0 && (
              <div className="mb-6 mt-6">
                <label htmlFor="zone" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Classification</label>
                <Autocomplete
                  id="classificationFilter"
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
            {filteredData.length > 0 && (
              <div className="mb-6 mt-6">
                <label htmlFor="zone" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Item Id</label>
                <Autocomplete
                  id="itemIdFilter"
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
            <div className='mt-3'
              style={{
                marginLeft: "-20px", marginRight: "-20px"
              }}
            >
              <UserDataTable data={filteredData} columnsName={MappedItemsColumn} backButton={false}
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


