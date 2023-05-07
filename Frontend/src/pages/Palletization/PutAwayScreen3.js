import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {FaSearch,FaPrescriptionBottle} from "react-icons/fa"
import { FaSearch } from "react-icons/fa"
import userRequest from '../../utils/userRequest';
import { Autocomplete, TextField } from '@mui/material';
import icon from "../../images/close.png"
import "./PutAwayScreen3.css"
import axios from 'axios';
import CustomSnakebar from '../../utils/CustomSnakebar';


const PutAwayScreen3 = () => {
  const navigate = useNavigate();
  const [palletIds, setPalletIds] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };
  //getItem data
  const data = sessionStorage.getItem('putawaydata')
  const selectedPutAwayData = JSON.parse(sessionStorage.getItem('selectedPutAwayData'))
  const parsedData = JSON.parse(data)
  console.log(parsedData);
  console.log(data)

  const options = [
    { label: "1000 x 1200" },
    { label: "80 x 1200" }
  ];

  const [serialnumberlist, setSerialNumberList] = useState([]);


  const handleSerialNumberInput = async (e) => {
    if (e.target.value.length == 0) return;
    const serialNumber = e.target.value;
    console.log('serialNumber:', serialNumber);
    console.log('selectedPutAwayData:', selectedPutAwayData.SHIPMENTID);

    let checkList = serialnumberlist.find((item) => item === serialNumber)
    console.log('checkList:', checkList);
    if (checkList) {
      setTimeout(() => {

        setError('Serial Number already exists in the list');
      }, 400);
      return;
    }
    else {
      try {
        const response = await userRequest.get(`/vaildatehipmentPalletizingSerialNumber?ItemSerialNo=${serialNumber}&SHIPMENTID=${selectedPutAwayData.SHIPMENTID}`);
        setMessage(response?.data?.message || 'Inserted Successfully');
        setSerialNumberList([...serialnumberlist, serialNumber]);
        // reset input
        e.target.value = '';
      }
      catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || 'Something went wrong, please try again later');
      }
    }


  }


  const handleAutoComplete = (event, value) => {
    console.log('Selected value:', value);
    // updateData({ ...statedata, RZONE: value.RZONE });
  };

  const handleClick = () => {
    userRequest.post('/generateAndUpdatePalletIds', null, {
      params: {
        // serialNumberList: ['SN12347', 'SN12342']
        serialNumberList: serialnumberlist
      }
    })
      .then(response => {
        // handle response
        setPalletIds(response.data);
        setMessage(response?.data?.message || 'Pallete Ids Updated Successfully');
        // clear serial number list
        setSerialNumberList([]);
        // setTimeout(() => {
        //   navigate('/putawaylast')
        // }, 1000);
      })
      .catch(error => {
        // handle error
        console.error(error);
        setError(error?.response?.data?.message || 'Something went wrong, please try again later')
      });
  };

  return (
    <>
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#e69138] text-xl mb:2 md:mb-5">

              <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                <div className='w-full flex justify-between'>
                  <div className='w-[85%]'>
                    <div className='relative'>
                      <div
                        className='w-full text-lg font-thin -mt-1 placeholder:text-[#fff] text-[#fff] bg-[#e69138] border-gray-300 focus:outline-none focus:border-blue-500 pl-8'
                      >
                        Shipment Palletizing
                      </div>
                      <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
                        <FaPrescriptionBottle size={18} className='text-[#FFF]' />
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
                  <span>{parsedData[0].ITEMNAME}</span>
                </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-white'>
                  <span>ItemID:</span>
                  <span>{parsedData[0].ITEMID}</span>
                </div>
              </div>

              <div>
                <div className='flex gap-6 justify-center items-center'>
                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Quantity</span>
                    <span>{parsedData[0].QTYTRANSFER}</span>
                  </div>

                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Picked</span>
                    <span>{serialnumberlist.length}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className='mb-6'>

              <Autocomplete
                id="zone"
                options={options}
                getOptionLabel={(option) => option.label}
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
                    placeholder="Select Pallet type"
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

            <div className="mb-6">
              <input
                id="enterscan"
                className="bg-gray-50 font-semibold border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Scan/Serial Number"
                // value={serialnumberlist}
                // onChange={handleSerialNumberInput}
                onBlur={handleSerialNumberInput}
              />
            </div >

            <div className="mb-6">
              <label htmlFor='serial' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Serial Number</label>

              {/* // creae excel like Tables  */}
              <div className="table-putaway-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serialnumberlist.map((serialNumber, index) => (
                      <tr key={index}>
                        <td>{serialNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div >

            <div className='mt-6'>
              <button
                onClick={handleClick}
                type='submit'
                className='bg-[#e69138] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-full'>
                <span className='flex justify-center items-center'>
                  <p>Generate Pallete Code</p>
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default PutAwayScreen3