import React, { useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
// import "./WmsProfitLoss.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import UserDataTable from '../../components/UserDatatable/UserDataTable';
import { AllItems } from '../../utils/datatablesource';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { useQuery } from '@tanstack/react-query';


const WmsInventory = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [currentUser, setCurrentUser] = useState(initialUser);
  const [dataList, setDataList] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [assignedTo, setAssignedTo] = useState(initialUser?.UserID ?? '');
  const [selectedData, setSelectedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const abortControllerRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState([]);

  const [data, setData] = useState([]);
  const [selectedBy, setSelectedBy] = useState('itemid');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    userRequest.get('/getAllTblUsers')
      .then(response => {
        console.log(response?.data);
        setUserList(response?.data ?? []);
      })
      .catch(error => {
        console.error(error);
        setError(error?.response?.data?.message ?? 'Something went wrong!');

      });



  }, []);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);


  const handleAutoComplete = (event, value) => {
    console.log('Selected value:', value?.UserID);

    setAssignedTo(value?.UserID ?? '');
  };


  const handleSearchAutoComplete = (event, value) => {
    console.log('Selected value:', value);
    setIsOptionSelected(true);
    // if a new option was selected
    if (value.length > selectedOption.length) {
      // check in array of objects for same ITEMID
      if (selectedOption.some(item => item?.ITEMID === value[value.length - 1]?.ITEMID)) {
        setError('Item already selected!');
        return;
      }
    }
    setSelectedOption(value); // store current selected option
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
        }
      });


      const res = await userRequest.post('/insertIntoWmsJournalCountingOnlyCL', apiData)
      console.log(res);
      setMessage(res?.data?.message ?? 'Data saved successfully!');
      setSelectedRows([]);
      setSelectedData([]);
      // filter out the selected rows from the data array on the basis of ITEMID on both arrays of objects
      // setData(data.filter(item => !selectedRows.some(row => row?.ITEMID === item?.ITEMID)));
      setData([])
      setSelectedOption([]);

    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message ?? 'Something went wrong!');
    }
  }

  const handleAutoCompleteInputChnage = async (event, newInputValue) => {
    if (isOptionSelected) {
      setIsOptionSelected(false);
      return;
    }
    if (!newInputValue || newInputValue.trim() === '') {
      // perform operation when input is cleared
      setDataList([]);
      return;
    }

    if (!newInputValue || newInputValue.trim() === '') {
      setDataList([]); // Clear the data list if there is no input
      return;
    }
    setAutocompleteLoading(true);
    setOpen(true);


    console.log(newInputValue);
    setSearchText(newInputValue);
    console.log("querying...")
    try {

      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new AbortController
      abortControllerRef.current = new AbortController();
      const res = await userRequest.post("getInventTableWMSDataByItemIdOrItemName", {}, {
        headers: { serachtext: newInputValue }
        , signal: abortControllerRef?.current?.signal
      })

      console.log(res);
      setDataList(res?.data ?? []);
      setOpen(true);
      setAutocompleteLoading(false);
    }
    catch (error) {
      if (error?.name === 'CanceledError') {
        // Ignore abort errors
        setDataList([]); // Clear the data list if there is no input
        setAutocompleteLoading(true);
        return;
      }
      console.error(error);
      setDataList([]); // Clear the data list if an error occurs
      setOpen(false);
      setAutocompleteLoading(false);
    }

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

                <h2 className='text-center text-[#fff]'>WMS Inventory</h2>



                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
              <h2 className='text-center text-[#fff]'>By Item ID</h2>

            </div>


            <div className='mt-6'>
              <h2 className='text-[#00006A] text-center font-semibold'>Current Logged in User ID:<span className='text-[#FF0404]' style={{ "marginLeft": "5px" }}>{currentUser?.UserID}</span></h2>
            </div>


            <div className="mt-6">
              <label htmlFor="searchInput" className="text-[#00006A] text-center font-semibold"
                style={{ marginBottom: "10px" }}
              >Search Bar</label>

              <Autocomplete

                multiple
                id="searchInput"
                options={dataList}
                value={selectedOption}
                getOptionLabel={(option) => `${option?.ITEMID} - ${option?.ITEMNAME}`}
                onChange={handleSearchAutoComplete}
                onInputChange={(event, newInputValue) => handleAutoCompleteInputChnage(event, newInputValue)}
                loading={autocompleteLoading}
                sx={{ marginTop: '10px' }}
                open={open}
                onOpen={() => {
                  // setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option ? `${option?.ITEMID} - ${option?.ITEMNAME}` : 'No options'}
                  </li>
                )}

                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="Search Item Number or Description here"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                    sx={{
                      '& label.Mui-focused': {
                        color: '#00006A',
                      },
                      '& .MuiInput-underline:after': {
                        borderBottomColor: '#00006A',
                      },
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#000000',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#000000',
                        },
                      },
                    }}
                  />
                )}

              />

            </div>





            <div className='mt-3'>
              <UserDataTable data={selectedOption} columnsName={AllItems} backButton={false}
                handleRowClickInParent={handleRowClickInParent}
                actionColumnVisibility={false}
                buttonVisibility={false}
                uniqueId={"mobileWmsInventoryId"}
                checkboxSelection={"disabled"}

              />
            </div>

            <div className="mt-6">
              <label htmlFor="userid" className="text-[#00006A] text-center font-semibold">ASSIGN</label>

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
      </div>
    </>
  )
}

export default WmsInventory


