import React, { useEffect, useState , useRef } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import "./ItemUnAllocation.css";
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';

const SecondItemUnAllocation = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
//   const [selectionType, setSelectionType] = useState('Pallet');
  const [selectedOption, setSelectedOption] = useState('Bin');
  const [location, setLocation] = useState([])
  const [locationInputValue, setLocationInputValue] = useState('');
  

  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  const storedData = sessionStorage.getItem('ItemUnAllocation');
  const parsedData = JSON.parse(storedData);
  console.log("parsedData")
  console.log(parsedData)


  const autocompleteRef = useRef(); // Ref to access the Autocomplete component
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const resetAutocomplete = () => {
    setLocationInputValue(''); // Clear the location input value
    setAutocompleteKey(key => key + 1); // Update the key to reset the Autocomplete
  };


  useEffect(() => {
    const getLocationData = async () => {
      try {
        const res = await userRequest.get("/getAllTblLocationsCL")
        console.log(res?.data)
        setLocation(res?.data)


      }
      catch (error) {
        console.log(error)
        setError(error?.response?.data?.message ?? 'Cannot fetch location data');

      }
    }

    getLocationData();

  }, [])


  
  const handleFromSelect = (event, value) => {
    // setSelectedOption(parsedData?.INVENTLOCATIONIDFROM);
    console.log(value)
    setLocationInputValue(value || "");
  }

  const [inputType, setInputType] = useState('')


const handlePalletSubmit = () => {
    userRequest.post('/getItemInfoByPalletCode', {}, {
      headers: {
        palletcode: inputType,
        // usertypevalue: selectedOption,
      },
    })
    .then((response) => {
      console.log(response.data);
      setMessage("The Pallet Is Found")
    })
    .catch((error) => {
      console.log(error);
      setError(error?.response?.data?.message);
    });
  };
  


const handleInsertData = () => {
    let apiBody = {};
  
    if (selectedOption === 'Pallet') {
      apiBody = {
        records: [
          {
            "itemcode": parsedData?.ItemCode,
            "itemdesc": parsedData?.ItemDesc,
            "gtin": parsedData?.GTIN,
            "remarks": parsedData?.Remarks,
            "classification": parsedData?.Classification,
            "mainlocation": parsedData?.MainLocation,
            // "palletcode": parsedData?.PalletCode,
            "palletcode": inputType,
            "intcode": parsedData?.IntCode,
            "itemserialno": parsedData?.ItemSerialNo,
            "mapdate": parsedData?.MapDate,
            "reference": parsedData?.Reference,
            "sid": parsedData?.SID,
            "cid": parsedData?.CID,
            "po": parsedData?.PO,
            "trans": parsedData?.Trans
          }
        ]
      };
    } else if (selectedOption === 'Bin') {
      apiBody = {
        records: [
          {
            "itemcode": parsedData?.ItemCode,
            "itemdesc": parsedData?.ItemDesc,
            "gtin": parsedData?.GTIN,
            "remarks": parsedData?.Remarks,
            "classification": parsedData?.Classification,
            "mainlocation": parsedData?.MainLocation,
            "binlocation": locationInputValue, // Assuming locationInputValue holds the selected bin location
            "intcode": parsedData?.IntCode,
            "itemserialno": parsedData?.ItemSerialNo,
            "mapdate": parsedData?.MapDate,
            "reference": parsedData?.Reference,
            "sid": parsedData?.SID,
            "cid": parsedData?.CID,
            "po": parsedData?.PO,
            "trans": parsedData?.Trans
          }
        ]
      };
    } else {
      console.error('Invalid selected option');
      return;
    }
  
    userRequest.post('/insertManyIntoMappedBarcode', apiBody)
      .then((response) => {
        console.log(response.data);
        setMessage(response?.data?.message);
      })
      .catch((error) => {
        console.log(error);
        setError(error?.response?.data?.message);
      });
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
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex flex-col justify-start items-start gap-2 text-xs sm:text-xl text-white'>
                <h1>Item Description: {parsedData?.ItemDesc}</h1>
                <h1>Item Serial No: {parsedData?.ItemSerialNo}</h1>
                <h1>GTIN: {parsedData?.GTIN}</h1>
                <h1>PalletCode: {parsedData?.PalletCode}</h1>
                <h1>Bin Location: {parsedData?.BinLocation}</h1>
              </div>

              
                 {selectedOption !== "" &&
                <div class="text-center mt-6">
                  <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                  >

                    {/* // Inside the return statement, where you render the radio buttons */}
                    <label className="inline-flex items-center mt-1">
                    <input
                        type="radio"
                        name="selectionType"
                        value="Pallet"
                        checked={selectedOption === 'Pallet'}
                        onChange={() => setSelectedOption('Pallet')}
                        className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                    />
                    <span className="ml-2 text-[#00006A]">BY PALLET</span>
                    </label>

                    <label className="inline-flex items-center mt-1">
                    <input
                        type="radio"
                        name="selectionType"
                        value="Bin"
                        checked={selectedOption === 'Bin'}
                        onChange={() => setSelectedOption('Bin')}
                        className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                    />
                    <span className="ml-2 text-[#00006A]">BY BIN</span>
                    </label>
                  </div>
                </div>
              }

            </div>


            {selectedOption === 'Pallet' && (
                <div>
                <input 
                    type='text'
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder='Enter Scan/Pallet No'
                    onChange={(e) => setInputType(e.target.value)}
                    onBlur={handlePalletSubmit}
                />
                </div>
            )}

         {selectedOption === 'Bin' && (
            <div className="mt-6">
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
              )}

           
            <div className='mt-6 flex justify-between items-center'>
              <button
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-full'>
                <span className='flex justify-center items-center'
                  onClick={handleInsertData}
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

export default SecondItemUnAllocation


