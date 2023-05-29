import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
// import "./WmsProfitLoss.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import UserDataTable from '../../components/UserDatatable/UserDataTable';
import { WarehouseJournalCountingColumn } from '../../utils/datatablesource';
import { FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete } from '@mui/material';

const WmsInventory = () => {
  
    const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [currentUser, setCurrentUser] = useState(initialUser);

  const [data, setData] = useState([]);
  const [selectedBy, setSelectedBy] = useState([]);

  const handleByChange = (event) => {
    setSelectedBy(event.target.value);
    };

    const [dataList, setDataList] = useState([]);
  useEffect(() => {
    userRequest.get('/getAllTblRZones')
      .then(response => {
        console.log(response?.data);
        setDataList(response?.data ?? []);
      })
      .catch(error => {
        console.error(error);
      });

  }, []);

  const handleAutoComplete = (event, value) => {
    console.log('Selected value:', value);
  };

  return (
    <>
   
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

                <h2 className='text-center text-[#fff]'>WMS Inventory</h2>

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

            <div className='mt-6 flex justify-start items-center gap-3'>
            <label className='text-[#00006A]'>BY</label>
            <FormControl style={{ minWidth: '200px' }}>
                <Select
                    labelId="select-by-label"
                    id="select-by"                     
                    multiple
                    value={selectedBy}
                    className='bg-[#fff]'
                    onChange={handleByChange}
                    renderValue={(selected) => (
                        <div>
                        {selected.map((value) => (
                            <span key={value}>{value}</span>
                        ))}
                        </div>
                )}
                >
                
                <MenuItem value="Option 1">Option 1</MenuItem>
                <MenuItem value="Option 2">Option 2</MenuItem>
                <MenuItem value="Option 3">Option 3</MenuItem>
                </Select>
            </FormControl>
            </div>


            <div className=''>    
                <UserDataTable  data={data} columnsName={WarehouseJournalCountingColumn} backButton={false}
                actionColumnVisibility={false}
                buttonVisibility={false}
                
                />
            </div>
            
            <div className="mb-6 flex justify-start items-center gap-2">
                <label htmlFor="userid" className="text-[#00006A] text-center font-semibold">ASSIG BY</label>

                <Autocomplete
                  id="zone"
                  options={dataList}
                  getOptionLabel={(option) => option.RZONE}
                  onChange={handleAutoComplete}

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

                      className="bg-gray-50 border border-gray-300 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                      placeholder="Assign by User ID"
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
              <button
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


