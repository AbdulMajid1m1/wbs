import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import icon from "../../images/close.png"
import "./WmsPalletIDInquiry.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import userRequest from '../../utils/userRequest';
import { Autocomplete, TextField } from '@mui/material';


const PalletIDTransferLocation = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [palletCodeId, setPalletCodeId] = useState('');
  const inputRef = useRef(null);
  const [scanLocationToList, setScanLocationToList] = useState([]);
  const [binlocation, setBinlocation] = useState('');
  const autocompleteRef = useRef(); // Ref to access the Autocomplete component
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

// get the palletcode from session storage
const palletCode = sessionStorage.getItem('PalletCode');
console.log(palletCode);


    useEffect(() => {
    userRequest.post('/getItemInfoByPalletCode', {}, {
        headers: {
          palletCode: palletCode
        }
      })
      //Show only one palletCode
    // .then(response => {
    //   const { GTIN, PalletCode, ItemCode, ItemDesc, BinLocation } = response.data[0];
    //   setData([{ GTIN, PalletCode, ItemCode, ItemDesc, BinLocation }]);
    // //   setMessage(response?.data?.message ?? 'Data Displayed');
    //   setIsLoading(false)
   
    // })

    // Show Multiple PalletCode
    .then(response => {
        const extractedData = response.data.map(item => ({
          GTIN: item.GTIN,
          PalletCode: item.PalletCode,
          ItemCode: item.ItemCode,
          ItemDesc: item.ItemDesc,
          BinLocation: item.BinLocation
        }));
        setData(extractedData);
        setIsLoading(false)
      })

    .catch(error => {
      console.log(error);
      setError(error?.response.data?.message);
      setIsLoading(false)
      setData([])
    });
//   };
}, [])

  
  useEffect(() => {
    const getScanLocationData = async () => {
      try {
        const res = await userRequest.get("/getAllTblLocationsCL")
        console.log(res?.data)
        setScanLocationToList(res?.data ?? [])

      }
      catch (error) {
        console.log(error)
        setError(error?.response?.data?.message ?? 'Cannot fetch Scan to Location data');

      }
    }

    getScanLocationData();

  }, [])

 
  const handlescanLocationToSelect = (event, value) => {
    setBinlocation(value);
  };

//   console.log(binlocation)


const handleChangePalletCode = () => {
    if(binlocation === '' || binlocation === null || binlocation === undefined){
        setError('Please select a Bin location');
        return;
    } 

    setIsLoading(true)
    const requestBody = {
      records: [
        {
          newBinLocation: binlocation,
          palletCode: palletCode,
        },
      ],
    };
  
    userRequest
      .put('/updateMappedBarcodesByPalletCode', requestBody)
      .then((response) => {
        console.log(response?.data);
        setMessage(response?.data?.message ?? 'Bin locations updated successfully.');
        setIsLoading(false)
        

        setTimeout(() => {
            navigate(-1)
            }, 2000);
      })
      .catch((error) => {
        console.error(error);
        setError(error?.response?.data?.message ?? 'Error updating bin locations.');
        setIsLoading(false)
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
        <div className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-center text-[#fff]'>PALLET ID TRANSFER LOCATION</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>

        
              <div className='mt-4'>
                <label htmlFor='palletId'
                  className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">PalletID/Code<span className='text-[#FF0404]'>*</span></label>
                <div className='w-full flex'>
                  <input
                    id="palletId"
                    value={palletCode}
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                    placeholder="Scan PalletID or Pallet Code"
                    onChange={(e) => setPalletCodeId(e.target.value)}
                    ref={inputRef}
                  />
                </div>
              </div>
         
               {/* Table to display GTIN and Pallet Code */}
                <div className="table-location-generate2">
                    <table>
                        <thead>
                            <tr>
                            <th>GTIN</th>
                            <th>Pallet Code</th>
                            <th>ItemCode</th>
                            <th>ItemDescription</th>
                            <th>BinLocation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.GTIN}</td>
                                <td>{item.PalletCode}</td>
                                <td>{item.ItemCode}</td>
                                <td>{item.ItemDesc}</td>
                                <td>{item.BinLocation}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            <div className='mb-6'>
                <div className='w-full'>
                    <div className='flex justify-end items-center gap-2'>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                    <div
                        id="totals"
                        className="bg-gray-50 font-semibold text-center placeholder:text-[#00006A] border border-[#00006A] text-gray-900 text-xs rounded-lg block w-[30%] p-1.5 md:p-2.5"
                        placeholder="Totals"
                    >
                        {data.length}
                    </div>
                    </div>
                </div>
            </div>


            <div className="mb-6">
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Location To:<span className='text-[#FF0404]'>*</span></label>
              <div className='w-full'>
                <Autocomplete
                  ref={autocompleteRef}
                  key={`${autocompleteKey} ScanLocationTo`}
                  id="enterscan"
                  // options={location.filter(item => item.BinLocation)}
                  // getOptionLabel={(option) => option.BinLocation}
                  options={Array.from(new Set(scanLocationToList.map(item => item?.BIN))).filter(Boolean)}
                  getOptionLabel={(option) => option}
                  onChange={handlescanLocationToSelect}

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

                <div className='mb-6 flex justify-between'>
                  <button
                    onClick={() => navigate(-1)}
                    // type='button'
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] sm:text-lg text-xs font-medium py-2 rounded-sm w-[30%]'>
                    <span className='flex justify-center items-center'
                    >
                      <p>Scan Again</p>
                    </span>
                  </button>

                  <button
                    onClick={handleChangePalletCode}
                    // type='button'
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] sm:text-lg text-xs font-medium py-2 rounded-sm w-[30%]'>
                    <span className='flex justify-center items-center'
                    >
                      <p>Transfer Location</p>
                    </span>
                  </button>
                </div>
            </div>         
        </div>
      </div>
    </>
  )
}

export default PalletIDTransferLocation