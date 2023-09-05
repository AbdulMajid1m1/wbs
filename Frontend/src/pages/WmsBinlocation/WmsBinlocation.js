import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
// import "./WmsProfitLoss.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import UserDataTable from '../../components/UserDatatable/UserDataTable';
import { AllItems, WmsByBinlocationColumn } from '../../utils/datatablesource';
import { FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete } from '@mui/material';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { useQuery } from '@tanstack/react-query';


const WmsBinlocation = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [currentUser, setCurrentUser] = useState(initialUser);

  const [assignedTo, setAssignedTo] = useState(initialUser?.UserID ?? '');
  const [selectedData, setSelectedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [data, setData] = useState([]);
  const [selectedBy, setSelectedBy] = useState('binlocation');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  const [dataList, setDataList] = useState([]);
  useEffect(() => {
    userRequest.get('/getAllTblUsers')
      .then(response => {
        console.log(response?.data);
        setDataList(response?.data ?? []);
      })
      .catch(error => {
        console.error(error);
        setError(error?.response?.data?.message ?? 'Something went wrong!');

      });



  }, []);

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

  if (stockMasterData) {
    console.log(stockMasterData)
  }

  useEffect(() => {
    if (stockMasterData) {
      console.log(stockMasterData);
      setData(stockMasterData);
    }
  }, [stockMasterData]);

  useEffect(() => {
    if (stockMasterError) {
      setError('An error has occurred: ' + stockMasterError.message);
    }
  }, [stockMasterError]);

  const handleAutoComplete = (event, value) => {
    console.log('Selected value:', value?.UserID);

    setAssignedTo(value?.UserID ?? '');
  };

  const handleBySelection = (event, value) => {
    setSelectedBy(value?.item ?? '');
    console.log(value);
  };


  const handleRowClickInParent = (row) => {
    console.log(row);
    if (selectedRows.includes(row.id)) {
      // If the clicked row is selected, deselect it
      setSelectedRows(selectedRows.filter(id => id !== row.id));
    } else {
      // If the clicked row is not selected, select it
      setSelectedRows(prevSelectedRows => [...prevSelectedRows, row]);
    }
  }
  useEffect(() => {
    console.log(selectedRows);
  }, [selectedRows]);




  // handle the save button click
  const handleSaveBtnClick = async () => {
    if (selectedBy === '') {
      setError('Please select the selected by type!');
      return;
    }
    if (selectedRows.length === 0) {
      setError('Please select at least one row!');
      return;
    }
    if (assignedTo === '') {
      setError('Please select the assigned to user!');
      return;
    }
    try {
      let apiData = selectedRows.map(row => {
        console.log(row);
        return {
          ...row,
          TRXUSERIDASSIGNED: assignedTo,
          INVENTORYBY: selectedBy,
          BINLOCATION: row.BinLocation,
        }
      });
      const res = await userRequest.post('/insertIntoWmsJournalCountingOnlyCL', apiData)
      console.log(res);
      setMessage(res?.data?.message ?? 'Data saved successfully!');
      setSelectedRows([]);
      setSelectedData([]);
      setData([]);
      setTimeout(() => {
        setData(stockMasterData);
      }, 500);

      // setData(stockMasterData)


    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message ?? 'Something went wrong!');
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
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg" style={{ minHeight: '550px' }}>
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-center text-[#fff]'>WMS Binlocation</h2>


                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
              <h2 className='text-center text-[#fff]'>By Binlocation</h2>
            </div>

            <div className=''>
              <h2 className='text-[#00006A] text-center font-semibold'>Current Logged in User ID:<span className='text-[#FF0404]' style={{ "marginLeft": "5px" }}>{currentUser?.UserID}</span></h2>
            </div>

            {/* 
            <div className='mb-6'>
              <label className='text-[#00006A] text-center font-semibold'>BY</label>

              <Autocomplete
                id="by"
                options={[
                  { item: 'itemid' },
                  { item: 'binlocation' },
                ]}
                getOptionLabel={(option) => option.item ?? ''}
                onChange={handleBySelection}

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
                    placeholder="ItemID/Binlocation"
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

            </div> */}


            <div className='-mt-6'
              style={{
                marginLeft: "-20px", marginRight: "-20px"
              }}>
              <UserDataTable data={data} columnsName={WmsByBinlocationColumn} backButton={false}
                handleRowClickInParent={handleRowClickInParent}
                actionColumnVisibility={false}
                buttonVisibility={false}
                uniqueId={"mobileWmsInventoryId"}
                secondaryColor="secondary"

              />
            </div>

            <div className="mb-6">
              <label htmlFor="userid" className="text-[#00006A] text-center font-semibold">ASSIGN</label>

              <Autocomplete
                id="userid"
                options={dataList}
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


            <div className='mb-6'>
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

export default WmsBinlocation


