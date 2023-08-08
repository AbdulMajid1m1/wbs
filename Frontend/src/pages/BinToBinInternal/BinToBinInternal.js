import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa"
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./BinToBinInternal.css";
// import CustomSnakebar from '../../utils/CustomSnakebar';
// import back from "../../images/back.png"
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';

const BinToBinInternal = () => {
  const navigate = useNavigate();

  const [transferTag, setTransferTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [newFilterData, setNewFilterData] = useState(data);
  const [binlocation, setBinLocation] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [userInputSubmit, setUserInputSubmit] = useState(false);
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };
  const [selectionType, setSelectionType] = useState('Pallet');
  const [userInput, setUserInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  const handleChangeValue = (e) => {
    setTransferTag(e.target.value);
  }

  const handleForm = (e) => {
    e.preventDefault();
    setIsLoading(true)

    userRequest.get(`/getmapBarcodeDataByBinLocation?BinLocation=${transferTag}`)
      .then(response => {
        console.log(response?.data);

        setData(response?.data ?? []);
        setNewFilterData(response?.data ?? []);
        setIsLoading(false)
        setMessage(response?.data?.message ?? 'Data Displayed');
      })

      .catch(error => {
        console.error(error);
        setIsLoading(false)
        setError(error?.response.data?.message ?? 'Wrong Bin Scan');

      });

  }


  // define the function to filter data based on user input and selection type
  const filterData = () => {
    const filtered = newFilterData?.filter((item) => {
      if (selectionType === 'Pallet') {
        return item.PalletCode?.trim() === userInput.trim();
      } else if (selectionType === 'Serial') {
        return item.ItemSerialNo.trim() === userInput.trim();
      } else {
        return true;
      }
    });
    if (filtered?.length === 0) {
      setTimeout(() => {
        setError(`Please scan a valid ${selectionType}`);
      }, 500);
      return
    }

    setFilteredData((prev) => [...prev, ...filtered]);
    setUserInput(""); // reset the user input state variable
  };

  // use useEffect to trigger the filtering of data whenever the user input changes
  // useEffect(() => {
  //   filterData();
  // }, [userInputSubmit, selectionType]);


  // reset function
  const resetDataOnUPdate = () => {
    // remove the filtered data from the data state variable
    const newData = data.filter((item) => {
      if (selectionType === 'Pallet') {
        return item.PalletCode !== userInput;
      } else if (selectionType === 'Serial') {
        return item.ItemSerialNo !== userInput;
      } else {
        return true;
      }
    });
    setData(newData);
    // reset the user input state variable
    setUserInput("");
    // trigger the filtering of data
    setUserInputSubmit(!userInputSubmit);
    // reset the scan location state variable
    setBinLocation("");
  };

  const handleAutoComplete = (event, value) => {

    let itemCode = value?.trim();
    if (!itemCode) {
      setNewFilterData(data);
      return;
    }
    console.log(value);
    const newData = data.filter(item => item.ItemCode.trim() === itemCode);
    setNewFilterData(newData);
  };

  const handleBinLocation = (e) => {
    e.preventDefault();

    if (selectionType === 'Pallet') {

      userRequest.put('/updateMappedBarcodesBinLocationByPalletCode', {
        "oldBinLocation": data[0].BinLocation,
        "newBinLocation": binlocation,
        "palletCode": userInput
      })
        .then(response => {
          console.log(response?.data)
          setMessage(response?.data?.message ?? 'Updated Successfully')

          resetDataOnUPdate();





        })
        .catch(error => {
          console.log(error)
          setError(error?.response?.data?.message ?? 'Update failed');

        })
    }
    else if (selectionType === 'Serial') {

      userRequest.put('/updateMappedBarcodesBinLocationBySerialNo', {
        "oldBinLocation": data[0].BinLocation,
        "newBinLocation": binlocation,
        "serialNumber": userInput
      })
        .then(response => {
          console.log(response?.data)
          setMessage(response?.data?.message ?? 'Updated Successfully')
          resetDataOnUPdate();
        })
        .catch(error => {
          console.log(error)
          setError(error?.response?.data?.message ?? 'Update failed');

        })
    }

    else {
      return;
    }

  }



  const handleInputUser = (e) => {
    // setUserInputSubmit(!userInputSubmit);
    filterData();
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

                <h2 className='text-center text-[#fff]'>BIN to BIN TRANSFER</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>

            <div className=''>
              <h2 className='text-[#00006A] text-center font-semibold'>Internal<span className='text-[#FF0404]'>*</span></h2>
            </div>

            <form onSubmit={handleForm}>
              <div className='mb-6'>
                <label htmlFor='transfer'
                  className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Bin (FROM)<span className='text-[#FF0404]'>*</span></label>
                <div className='w-full flex'>
                  <input
                    id="transfer"
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                    placeholder="Scan Bin From"
                    onChange={handleChangeValue}
                  />
                  <button
                    type='submit'
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm'
                  >
                    FIND
                  </button>

                </div>
              </div>
            </form>

            {data?.length > 0 && (



              <div className="mb-6 mt-6">
                <label htmlFor="zone" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Item Id</label>
                <Autocomplete
                  id="zone"
                  options={Array.from(new Set(data.map((item) => item.ItemCode))).filter(Boolean)}
                  getOptionLabel={(option) => option || ""}
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
                      placeholder="Serach Container ID here"
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
            )}

            <div className='mb-6'>
              <div className='flex justify-between'>
                <div>
                  <label className='text-[#00006A] font-semibold sm:text-lg text-xs'>Items On Bin<span className='text-[#FF0404]'>*</span></label>
                </div>

                <div className='flex justify-end items-center gap-2'>
                  <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                  <input
                    id="totals"
                    className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[45%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Totals"
                    value={newFilterData?.length}
                  />
                </div>
              </div>

              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ItemCode</th>
                      <th>ItemDesc</th>
                      <th>GTIN</th>
                      <th>Remarks</th>
                      <th>User</th>
                      <th>Classification</th>
                      <th>MainLocation</th>
                      <th>BinLocation</th>
                      <th>IntCode</th>
                      <th>ItemSerialNo</th>
                      <th>MapDate</th>
                      <th>PalletCode</th>
                      <th>Reference</th>
                      <th>SID</th>
                      <th>CID</th>
                      <th>PO</th>
                      <th>Trans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newFilterData?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ItemCode}</td>
                        <td>{item.ItemDesc}</td>
                        <td>{item.GTIN}</td>
                        <td>{item.Remarks}</td>
                        <td>{item.User}</td>
                        <td>{item.Classification}</td>
                        <td>{item.MainLocation}</td>
                        <td>{item.BinLocation}</td>
                        <td>{item.IntCode}</td>
                        <td>{item.ItemSerialNo}</td>
                        <td>{item.MapDate}</td>
                        <td>{item.PalletCode}</td>
                        <td>{item.Reference}</td>
                        <td>{item.SID}</td>
                        <td>{item.CID}</td>
                        <td>{item.PO}</td>
                        <td>{item.Trans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
              >
                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="selectionType"
                    value="Pallet"
                    checked={selectionType === 'Pallet'}
                    onChange={e => setSelectionType(e.target.value)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-[#00006A]">BY PALLETE</span>
                </label>
                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="selectionType"
                    value="Serial"
                    checked={selectionType === 'Serial'}
                    onChange={e => setSelectionType(e.target.value)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-[#00006A]">BY SERIAL</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor='scanpallet' className="sm:text-lg text-xs font-medium text-[#00006A]">Scan {selectionType}:<span className='text-[#FF0404]'>*</span></label>

              <input
                id="scanpallet"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={`Scan ${selectionType}`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onBlur={handleInputUser}

              />

              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ItemCode</th>
                      <th>ItemDesc</th>
                      <th>GTIN</th>
                      <th>Remarks</th>
                      <th>User</th>
                      <th>Classification</th>
                      <th>MainLocation</th>
                      <th>BinLocation</th>
                      <th>IntCode</th>
                      <th>ItemSerialNo</th>
                      <th>MapDate</th>
                      <th>PalletCode</th>
                      <th>Reference</th>
                      <th>SID</th>
                      <th>CID</th>
                      <th>PO</th>
                      <th>Trans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*  {data.filter((item) => item.PalletCode === userInput) */}
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ItemCode}</td>
                        <td>{item.ItemDesc}</td>
                        <td>{item.GTIN}</td>
                        <td>{item.Remarks}</td>
                        <td>{item.User}</td>
                        <td>{item.Classification}</td>
                        <td>{item.MainLocation}</td>
                        <td>{item.BinLocation}</td>
                        <td>{item.IntCode}</td>
                        <td>{item.ItemSerialNo}</td>
                        <td>{item.MapDate}</td>
                        <td>{item.PalletCode}</td>
                        <td>{item.Reference}</td>
                        <td>{item.SID}</td>
                        <td>{item.CID}</td>
                        <td>{item.PO}</td>
                        <td>{item.Trans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div >



            <form onSubmit={handleBinLocation}>
              <div className="mb-6">
                <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Location To:<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="enterscan"
                  className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter/Scan Location"
                  value={binlocation}
                  onChange={(e) => setBinLocation(e.target.value)}
                />
              </div >

              <div className='mt-6'>
                <div className='w-full flex justify-between place-items-end'>
                  <div>
                    <button
                      type='submit'
                      className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-10 rounded-sm w-full'>
                      <span className='flex justify-center items-center'>
                        <p>Save</p>
                      </span>
                    </button>
                  </div>

                  <div>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                    <input
                      id="totals"
                      className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Totals"
                      value={filteredData.length}
                    />
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default BinToBinInternal