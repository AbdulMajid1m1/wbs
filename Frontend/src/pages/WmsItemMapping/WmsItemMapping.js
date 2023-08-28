import React, { useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import UserDataTable from '../../components/UserDatatable/UserDataTable';
import { AllItems, WmsItemMappedColumn } from '../../utils/datatablesource';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';

const WmsItemMapping = () => {
  // useRef to move foucs on desired element
  const serialNoRef = useRef(null);
  const gtinRef = useRef(null);


  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [selectedOption, setSelectedOption] = useState();
  const [dataList, setDataList] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [userserial, setUserSerial] = useState("");
  const [usergtin, setUserGtin] = useState("");
  const [userconfig, setUserConfig] = useState("");
  const [userdate, setUserDate] = useState(null);
  const [userqrcode, setUserQrCode] = useState("");
  const [userbinlocation, setUserBinlocation] = useState("AZ-W01-Z001-A0001");
  const [reference, setReference] = useState("");
  const [rowData, setRowData] = useState();
  const [searchText, setSearchText] = useState('');
  const abortControllerRef = useRef(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [length, setLength] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  // const autocompleteLoading = open && dataList.length === 0;
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);



  const handleAutoComplete = async (event, value) => {
    console.log('Selected value:');
    console.log(value);
    setIsOptionSelected(true);

    if (value?.ITEMID) {
      try {

        const fetchDimensions = await userRequest.get('/getTblStockMasterByItemId?itemid=' + value?.ITEMID);

        let fetchDimensionsData = fetchDimensions?.data[0];
        console.log(fetchDimensionsData);
        fetchDimensionsData?.Length !== null ? setLength(fetchDimensionsData?.Length) : setLength(null);
        fetchDimensionsData?.Width !== null ? setWidth(fetchDimensionsData?.Width) : setWidth(null);
        fetchDimensionsData?.Height !== null ? setHeight(fetchDimensionsData?.Height) : setHeight(null);
        fetchDimensionsData?.Weight !== null ? setWeight(fetchDimensionsData?.Weight) : setWeight(null);
      }
      catch (error) {
        console.log(error);
      }
    }

    setSelectedOption(value);
  };


  const saveItemMapping = (e) => {
    e.preventDefault();
    // if (!rowData) {
    //   setError("Please select a row to save");
    //   return;
    // }
    setIsLoading(true);
    const data = {
      // set this body
      "itemcode": selectedOption?.ITEMID,
      "itemdesc": selectedOption?.ITEMNAME,
      "gtin": usergtin,
      // "remarks": rowData?.Remarks,
      "classification": userconfig,
      // "mainlocation": rowData?.MainLocation,
      "binlocation": userbinlocation,
      // "intcode": rowData?.IntCode,
      "itemserialno": userserial,
      "trxdate": userdate,
      // "palletcode": rowData?.PalletCode,
      "reference": reference === "" ? null : reference,
      // "sid": rowData?.SID,
      // "cid": userconfig,
      "po": rowData?.PO,
      "qrcode": userqrcode === "" ? null : userqrcode,
      "length": length,
      "width": width,
      "height": height,
      "weight": weight,

      // "trans": rowData?.Trans

    }
    userRequest.post('/insertIntoMappedBarcodeOrUpdateBySerialNo', data)
      .then(response => {
        console.log(response?.data);
        setIsLoading(false);
        setMessage(response?.data?.message);
        setUserSerial("");


        userRequest.put("/updateStockMasterData", {
          // ITEMID: statedata?.ITEMID,
          // Length: statedata?.LENGTH,
          // Width: statedata?.WIDTH,
          // Height: statedata?.HEIGHT,
          // Weight: statedata?.WEIGHT,
          ITEMID: selectedOption?.ITEMID,
          Length: length,
          Width: width,
          Height: height,
          Weight: weight,
        }).then(response => {
          console.log(response?.data);


        })
          .catch(error => {
            console.error(error);
          });


      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
        setError(error?.response?.data?.message);
      });
  }

  console.log(rowData);
  const hanleSaveData = (item) => {
    // console.log(item);
    setRowData(item);

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
        , signal: abortControllerRef.current.signal
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

  const handleBlur = async () => {
    if (userserial === "" || !userserial) return;
    try {
      const res = await userRequest.post('/getItemInfoByItemSerialNo', {}, {
        headers: { itemserialno: userserial }
      });
      Swal.fire({
        title: 'Serial No. already exists',
        text: "Do you want to update the data?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F98E1A',
        cancelButtonColor: '#fc5a34',
        confirmButtonText: 'Yes, Update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          gtinRef.current.focus();
          return
        }
        if (result.dismiss === Swal.DismissReason.cancel) {
          setUserSerial("");
          // focus on the input field
          serialNoRef.current.focus();
          return

        }

      })

    }
    catch (error) {
      console.log(error);
      // check if status is 404 then show the setErrorMessage serial number is valid
      if (error?.response?.status === 404) {

        gtinRef.current.focus();
        return
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: error?.response?.data?.message,
          icon: 'error',
          confirmButtonText: 'OK'

        }
        )
      }
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
        <form onSubmit={saveItemMapping} className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg" style={{ minHeight: '550px' }}>
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-center text-[#fff]'>Barcode Mapping</h2>

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



            <div className="mb-6">
              <label htmlFor="searchInput" className="text-[#00006A] text-center font-semibold"
                style={{ marginBottom: "10px" }}
              >Search Bar</label>

              <Autocomplete
                id="searchInput"
                
                options={dataList}
                getOptionLabel={(option) => `${option?.ITEMID} - ${option?.ITEMNAME}`}
                onChange={handleAutoComplete}
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
                    // required
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

            <div className="mb-6">
              <label htmlFor='scan' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Serial#<span className='text-[#FF0404]'>*</span></label>
              <input
                id="scan"
                name='serialNo'
                ref={serialNoRef}
                // required
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Scan Serial'
                value={userserial}
                onChange={(e) => setUserSerial(e.target.value)}
                onBlur={handleBlur}
              />
            </div>

            <div className="mb-6">
              <label htmlFor='gtin' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan GITN#<span className='text-[#FF0404]'>*</span></label>
              <input
                id="gtin"
                // required
                ref={gtinRef}
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Scan GTIN'
                value={usergtin}
                onChange={(e) => setUserGtin(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label htmlFor='config' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Select CONFIG#</label>
              <select
                id="config"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Scan CONFIG'
                //   value={userconfig}
                onChange={(e) => setUserConfig(e.target.value)}
              >
                <option value="">Select CONFIG</option>
                <option value="G">G</option>
                <option value="D">D</option>
                <option value="S">S</option>
                <option value="WG">WG</option>
                <option value="WD">WD</option>
                <option value="WS">WS</option>
                <option value="V">V</option>
                <option value="U">U</option>
              </select>
            </div>


            <div className='mb-6 flex justify-between gap-3'>
              <div>
                <label htmlFor='date' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Manufacturing Date</label>
                <input
                  id="date"
                  type="date"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder='Manufacturing Date'
                  onChange={(e) => setUserDate(e.target.value)}
                  value={userdate}
                />
              </div>

              <div>
                <label htmlFor='qrcode' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan QR Code</label>
                <input
                  id="qrcode"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder='Scan QR Code'
                  onChange={(e) => setUserQrCode(e.target.value)}
                  value={userqrcode}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor='binlocation' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Binlocation<span className='text-[#FF0404]'>*</span></label>
              <input
                // required
                id="binlocation"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Scan Binlocation'
                onChange={(e) => setUserBinlocation(e.target.value)}
                value={userbinlocation}
              />
            </div>
            <div className="mb-6">
              <label htmlFor='reference' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Enter Reference<span className='text-[#FF0404]'>*</span></label>
              <input

                id="binlocation"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Enter/Scan Binlocation'
                onChange={(e) => setReference(e.target.value)}
                value={reference}
              />
            </div>


            <div className="mb-6">
              <label htmlFor='length' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Length<span className='text-[#FF0404]'>*</span></label>
              <input

                required
                type='number'
                min={0}
                step="any"
                id="length"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Enter/Scan Length'
                onChange={(e) => setLength(e.target.value)}
                value={length}
              />
            </div>

            <div className="mb-6">
              <label htmlFor='width' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Width<span className='text-[#FF0404]'>*</span></label>
              <input
                required
                id="width"
                type='number'
                step="any"
                min={0}
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Enter/Scan Width'
                onChange={(e) => setWidth(e.target.value)}
                value={width}
              />
            </div>

            <div className="mb-6">
              <label htmlFor='height' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Height<span className='text-[#FF0404]'>*</span></label>
              <input
                required
                type='number'
                step="any"
                min={0}
                id="height"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Enter/Scan Height'
                onChange={(e) => setHeight(e.target.value)}
                value={height}
              />
            </div>

            <div className="mb-6">
              <label htmlFor='weight' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Weight</label>
              <input
                type='number'
                step='any'
                min={0}
                id="weight"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Enter/Scan Weight'
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
              />
            </div>

            <div className='mb-6'>
              <button
                type='submit'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[30%]'>
                <span className='flex justify-center items-center'
                >
                  <p>Save</p>
                </span>
              </button>
            </div>

          </div>
        </form>
      </div>
    </>
  )
}

export default WmsItemMapping


