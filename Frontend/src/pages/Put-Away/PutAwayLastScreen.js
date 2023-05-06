import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa"
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import { Autocomplete, TextField } from '@mui/material';

const PutAwayLastScreen = () => {
  const navigate = useNavigate();
  // something is change
  const [palletCode, setPalletCode] = useState('');
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [ShipmentRecevedClData, setShipmentRecevedClData] = useState([]);
  // const [selectedShipmentReceivedClData, setSelectedShipmentReceivedClData] = useState({});
  // get data from selectedPutAwayData session storage and set it to selectedPutAwayData if it is not null
  const [selectedPutAwayData, setSelectedPutAwayData] = useState(JSON.parse(sessionStorage.getItem('selectedPutAwayData')) ?? {});
  const [zonecode, setZoneCode] = useState('');


  const handleInputChange = (event) => {
    const value = event.target.value;
    setPalletCode(value);
    if (value) {
      userRequest.post(`/getShipmentRecievedCLDataByPalletCode?PalletCode=${value}`)
        .then(response => {
          setShipmentRecevedClData(response?.data ?? []);
          const serials = response.data.map(item => item?.SERIALNUM);
          setSerialNumbers(serials);
        })
        .catch(error => console.log(error));
    }
  };

  const handleAutoComplete = (event, value) => {
    console.log(`Selected serial number: ${value}`);
    const selectedShipmentReceivedClData = ShipmentRecevedClData.find(item => item.SERIALNUM === value);
    console.log(selectedShipmentReceivedClData);
    // if (!selectedShipmentReceivedClData) {
    //   setSelectedShipmentReceivedClData(selectedShipmentReceivedClData);
    // }
    sessionStorage.setItem('selectedShipmentReceivedClData', JSON.stringify(selectedShipmentReceivedClData));

  };

  const handleClick = () => {
    userRequest.get(`/validateZoneCode?ZONECODE=${zonecode}&PALLETCODE=${palletCode}`)
      .then((response) => {
        // get selectedShipmentReceivedClData from session storage
        const selectedShipmentReceivedClData = JSON.parse(sessionStorage.getItem('selectedShipmentReceivedClData'));
        console.log(response.data);
        console.log({
          itemcode: selectedShipmentReceivedClData.ITEMID,
          itemdesc: selectedShipmentReceivedClData.ITEMNAME,
          gtin: selectedShipmentReceivedClData.GTIN,
          remarks: selectedShipmentReceivedClData.REMARKS,
          classification: selectedShipmentReceivedClData.CLASSIFICATION,
          // Provide the correct values for mainlocation, binlocation, intcode, itemserialno, mapdate, reference, sid, cid, po, and trans based on your data.
          mainlocation: selectedPutAwayData.INVENTLOCATIONIDFROM,
          binlocation: selectedPutAwayData.WMSLOCATIONID,
          intcode: selectedPutAwayData.CONFIGID,
          itemserialno: selectedShipmentReceivedClData.SERIALNUM,
          mapdate: selectedShipmentReceivedClData.PALLET_DATE,
          palletcode: palletCode,
          reference: selectedPutAwayData.ALS_PACKINGSLIPREF,
          sid: selectedShipmentReceivedClData.SHIPMENTID,
          cid: selectedShipmentReceivedClData.CONTAINERID,
          po: selectedShipmentReceivedClData.POQTY,
          trans: selectedPutAwayData.TRANSFERID,
        })

        // Call the insertIntoMappedBarcode API
        userRequest.post('/insertIntoMappedBarcode', null, {

          headers: {
            itemcode: selectedShipmentReceivedClData.ITEMID,
            itemdesc: selectedShipmentReceivedClData.ITEMNAME,
            gtin: selectedShipmentReceivedClData.GTIN,
            remarks: selectedShipmentReceivedClData.REMARKS,
            classification: selectedShipmentReceivedClData.CLASSIFICATION,
            // Provide the correct values for mainlocation, binlocation, intcode, itemserialno, mapdate, reference, sid, cid, po, and trans based on your data.
            mainlocation: selectedPutAwayData.INVENTLOCATIONIDFROM,
            binlocation: selectedPutAwayData.WMSLOCATIONID,
            intcode: selectedPutAwayData.CONFIGID,
            itemserialno: selectedShipmentReceivedClData.SERIALNUM,
            mapdate: selectedShipmentReceivedClData.PALLET_DATE,
            palletcode: palletCode,
            reference: selectedPutAwayData.ALS_PACKINGSLIPREF,
            sid: selectedShipmentReceivedClData.SHIPMENTID,
            cid: selectedShipmentReceivedClData.CONTAINERID,
            po: selectedShipmentReceivedClData.POQTY,
            trans: selectedPutAwayData.TRANSFERID,
          }
        }).then((insertResponse) => {
          console.log(insertResponse.data);
        }).catch(err => {
          console.log(err);
          alert('Error in insertIntoMappedBarcode API');
        });

      }).catch(err => {
        console.log(err);
        alert('Error in validateZoneCode API');
      });
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
                        placeholder='Shipment Putaway'
                        // value={palletCode}
                        // onChange={handleInputChange}
                      />
                      <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
                        <FaSearch size={20} className='text-[#FFF]' />
                      </div>
                    </div>
                  </div>

                  <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                    {/* Cancel */}
                    <span>
                      <img src={icon} className='h-auto w-8 object-contain' alt='' />
                    </span>
                  </button>
                </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-white'>
                  <span>All IN CAPS (LETTERS, DIGITS AND SIZE)</span>
                  {/* <span>(PRODUCT)</span> */}
                </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 font-thin text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-white'>
                  <span>Results:</span>
                  <span className='font-medium'>0</span>
                </div>
              </div>


            </div>

            <div className='mb-6'>
            <label htmlFor='serial' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">List of Serial Numbers</label>   
            <input 
                value={palletCode}
                onChange={handleInputChange}
                  id="serial" 
                    className="bg-gray-50 font-semibold border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="List of Serial Numbers"
                        value={palletCode}
                           onChange={handleInputChange}
                /> */}
            </div>

            <div className='mb-6'>
              <Autocomplete
                id="serial"
                options={serialNumbers}
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
                    placeholder="SN"
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
              {/* <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Enter/Scan Serial Number</label> */}
              <input
                onChange={(e) => setZoneCode(e.target.value)}
                id="enterscan"
                className="bg-gray-50 font-semibold text-center border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter/Scan Warehouse Zone"
              />
            </div >

            <div className='mt-6'>
              <button
                onClick={handleClick}
                type='submit'
                className='bg-[#e69138] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-full'>
                <span className='flex justify-center items-center'>
                  <p>Put-Away</p>
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default PutAwayLastScreen