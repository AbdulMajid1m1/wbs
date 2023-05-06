import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa"
import Autocomplete from '@mui/material/Autocomplete';
import userRequest from '../../utils/userRequest';
import TextField from '@mui/material/TextField';
// import { ReceiptsContext } from '../../contexts/ReceiptsContext';
import icon from "../../images/close.png"

const PutAwayScreen2 = () => {
  const navigate = useNavigate();

  //   const { serialNumLength, statedata, updateData } = useContext(ReceiptsContext);

  const [dataList, setDataList] = useState([]);
  useEffect(() => {
    // console.log('Updated data:', statedata);
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
    // updateData({ ...statedata, RZONE: value.RZONE });
  };


  return (
    <>
      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#e69138] text-xl mb:2 md:mb-5">

              <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                <div className='w-full flex justify-between'>
                  <div className='w-[85%]'>
                    <div className='relative'>
                      <input
                        className='w-full text-lg font-thin placeholder:text-[#fff] text-[#fff] bg-[#e69138] border-gray-300 focus:outline-none focus:border-blue-500 pl-8'
                        placeholder='Shipment Palletizing'
                      />
                      <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
                        <FaSearch size={20} className='text-[#FFF]' />
                      </div>
                    </div>
                  </div>

                  <button type='button' onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium -mt-2 rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                    <span>
                      <img src={icon} className='h-auto w-8 object-contain' alt='' />
                    </span>
                  </button>
                </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-white'>
                  <span>ITEMNAME</span>
                  <span>PRODUCT</span>
                </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-white'>
                  <span>Itemcode:</span>
                  <span>0</span>
                </div>
              </div>

            </div>

            <div className="mb-6">
              <label htmlFor="zone" className="block mb-2 text-xs font-medium text-black">List of Receiving Zones</label>
            </div>

            <div className='mb-6'>
              <span className='text-[#00006A] font-semibold'>RZONE</span>
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
                    placeholder="Enter/Scan Receiving Zone"
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

            </div >

            <div className='mt-6'>
              <button type='submit' onClick={() => navigate('/putaway3')}
                className='bg-[#e69138] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-full'>
                <span className='flex justify-center items-center'>
                  <p>Proceed</p>
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default PutAwayScreen2