import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./ReturnRMALast.css";
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import logo from "../../images/alessalogo2.png"


const ReturnRMALast = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([])
  const [scanInputValue, setScanInputValue] = useState('');
  const [selectionType, setSelectionType] = useState('Serial');
  const [barcode, setBarcode] = useState('noBarcode');
  const [locationInputValue, setLocationInputValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [newTableData, setNewTableData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [modelNumber, setModelNumber] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userInputSubmit, setUserInputSubmit] = useState(false);
  const [newBarcode, setNewBarcode] = useState("");
  const [addUser, setAddUser] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [userInput, setUserInput] = useState("");





  const autocompleteRef = useRef(); // Ref to access the Autocomplete component
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const resetAutocomplete = () => {
    setAutocompleteKey(key => key + 1); // Update the key to reset the Autocomplete
  };
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  const storedData = sessionStorage.getItem('RmaRowData');
  const parsedData = JSON.parse(storedData);
  console.log("parsedData")
  console.log(parsedData)


  useEffect(() => {
    const getLocationData = async () => {
      try {
        const res = await userRequest.post("/getmapBarcodeDataByItemCode", {},
          {
            headers: {
              itemcode: parsedData?.ITEMID,
            }
          })
        console.log(res?.data)
        setLocation(res?.data)


      }
      catch (error) {
        console.log(error)
        setError(error?.response?.data?.message ?? 'Cannot fetch location data');

      }
    }

    getLocationData();

  }, [parsedData?.ITEMID])

  const handleFromSelect = (event, value) => {
    setSelectedValue(value);
    fetchData(value);
  };

  const fetchData = async (selectedValue) => {
    try {
      const response = await userRequest.post(
        "/getMappedBarcodedsByItemCodeAndBinLocation",
        {},
        {
          headers: {
            // itemcode: "CV-950H SS220 BK",
            itemcode: parsedData?.ITEMID,
            binlocation: selectedValue
          }
        }
      );
      const responseData = response.data;
      setNewTableData(responseData);
    } catch (error) {
      console.error(error);
    }
  };



  const GenerateBarcode = async () => {

    if (modelNumber === "") {
      setError("Please enter a model number")
      return;
    }
    try {
      const response = await userRequest.post("/generateBarcodeForRma",
        {
          RETURNITEMNUM: parsedData?.RETURNITEMNUM,
          ITEMID: parsedData?.ITEMID,
          MODELNO: modelNumber,
        }
      )
      console.log(response?.data)
      setNewBarcode(response?.data?.RMASERIALNO)
      console.log("newBarcode", response?.data?.RMASERIALNO)
      setMessage(response?.data?.message ?? 'Barcode generated successfully');

      filterData();

      setTimeout(() => {
        handlePrint();
       

      }, 20);
    }
    catch (error) {
      console.log(error)
      setError(error?.response?.data?.message ?? 'Cannot generate barcode');

    }

  }







  const handlePrint = () => {
    const printWindow = window.open('', 'Print Window', 'height=400,width=800');
    const html = '<html><head><title>Print Barcode</title>' +
      '<style>' +
      '@page { size: 3in 2in; margin: 0; }' +
      'body { font-size: 13px; line-height: 0.3; border: 1px solid black;}' +
      '#header { display: flex; justify-content: center; padding: 1px;}' +
      '#imglogo {height: 40px; width: 100px;}' +
      '#inside-BRCode { display: flex; justify-content: center; align-items: center; padding: 5px;}' +
      '#paragh { font-size: 15px; font-weight: 600; }' +
      '</style>' +
      '</head><body>' +
      '<div id="printBarcode"></div>' +
      '</body></html>';

    printWindow.document.write(html);
    const barcodeContainer = printWindow.document.getElementById('printBarcode');
    const barcode = document.getElementById('barcode').cloneNode(true);
    barcodeContainer.appendChild(barcode);

    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      printWindow.document.getElementById('imglogo').src = logoImg.src;

      printWindow.print();
      printWindow.close();
    };
  }

  const handleInputUser = (e) => {
    setNewBarcode(e.target.value)
    if (e.target.value.length === 0) {
      setTimeout(() => {
        setError("Please scan a barcode");
      }, 100);
      return
    }

    console.log(userInput)
    filterData();
  }

  const filterData = async () => {
    let filtered;
    if (barcode === "barcode") {
      let trimInput = userInput.trim()

      // filter the data based on the user input and selection type
      filtered = newTableData.filter((item) => {
        if (selectionType === 'Pallet') {
          return item.PalletCode === trimInput;
        } else if (selectionType === 'Serial') {
          return item.ItemSerialNo === trimInput;
        }

        else {
          return true;
        }
      });

      if (filtered.length === 0) {
        setTimeout(() => {
          setError("Please scan a valid barcode");
        }, 100);
        return;
      }

    }

    let apiData = parsedData;
    apiData.ITEMSERIALNO = newBarcode;
    try {
      const res = await userRequest.post(
        `/insertIntoWmsReturnSalesOrderCl`,
        [apiData],

      );
      console.log(res?.data)
      setMessage(res?.data?.message ?? 'Data inserted successfully');

      setFilteredData(prev => [...prev, apiData])
      if (barcode === "barcode") {
        // Remove the inserted records from the newTableData
        setNewTableData((prevData) => {
          return prevData.filter((item) => {
            if (selectionType === 'Pallet') {
              return !filtered.some(filteredItem => filteredItem.PalletCode === item.PalletCode);
            } else if (selectionType === 'Serial') {
              return !filtered.some(filteredItem => filteredItem.ItemSerialNo === item.ItemSerialNo);
            } else {
              return true;
            }
          });
        });
      }
      else{
        // clear model number
        setModelNumber("");
      }
      // clear the user input state variable
      setUserInput("");


    }
    catch (error) {
      console.log(error)
      setError(error?.response?.data?.message ?? 'Cannot save data');

    }


  };


  return (
    <>

      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                <div className='w-full flex justify-end'>
                  <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                    <span>
                      <img src={icon} className='h-auto w-8 object-contain' alt='' />
                    </span>
                  </button>
                </div>
                <span className='text-white -mt-7'>Retrun Item No:</span>
                <input
                  //   value={parsedData.TRANSFERID}
                  className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                  placeholder="Picking Route ID"
                  value={parsedData?.RETURNITEMNUM}
                  disabled
                />
                <div className='flex gap-2 justify-center items-center'>
                  <span className='text-white'>FROM:</span>

                  <div className='w-full'>
                    <Autocomplete
                      ref={autocompleteRef}
                      key={autocompleteKey}
                      id="location"
                      options={Array.from(new Set(location.map(item => item.BinLocation))).filter(Boolean)}
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
                          placeholder="FROM"
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
                </div>

              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-base'>
                <div className='flex items-center flex-col w-full sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Item Code:</span>
                  <span>{parsedData?.ITEMID}</span>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <div className='text-[#FFFFFF]'>
                    <span>Sales ID: {parsedData?.SALESID}</span>
                  </div>


                  {/* <div className='text-[#FFFFFF] w-full'>
                    <span>NAME: {parsedData.NAME}</span>
                  </div> */}
                </div>
              </div>

              <div>
                <div className='flex gap-6 justify-center items-center text-xs mt-2 sm:mt-0 sm:text-lg'>
                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Return Quantity<span className='text-[#FF0404]'>*</span></span>
                    <span>{parsedData.EXPECTEDRETQTY}</span>
                  </div>

                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Picked<span className='text-[#FF0404]'>*</span></span>
                    {/* <span>{filteredData.length}</span> */}
                    <span>1</span>
                  </div>
                </div>
              </div>

            </div>



            <div className='mb-6'>
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
                    {newTableData.map((data, index) => (
                      <tr key={"tranidRow" + index}>
                        <td>{data.ItemCode}</td>
                        <td>{data.ItemDesc}</td>
                        <td>{data.GTIN}</td>
                        <td>{data.Remarks}</td>
                        <td>{data.User}</td>
                        <td>{data.Classification}</td>
                        <td>{data.MainLocation}</td>
                        <td>{data.BinLocation}</td>
                        <td>{data.IntCode}</td>
                        <td>{data.ItemSerialNo}</td>
                        <td>{new Date(data.MapDate).toLocaleDateString()}</td>
                        <td>{data.PalletCode}</td>
                        <td>{data.Reference}</td>
                        <td>{data.SID}</td>
                        <td>{data.CID}</td>
                        <td>{data.PO}</td>
                        <td>{data.Trans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>



            </div >

            <div className='mb-4 flex justify-end items-center gap-2'>
              <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
              <input
                id="totals"
                className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[30%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Totals"
                value={newTableData.length}
              />
            </div>

            {/* Barcode Radio Button */}
            <div class="text-center mb-4">
              <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                  flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
              >
                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="barcode"
                    value="barcode"
                    checked={barcode === 'barcode'}
                    onChange={e => setBarcode(e.target.value)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-[#00006A]">BARCODE</span>
                </label>

                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="noBarcode"
                    value="noBarcode"
                    checked={barcode === 'noBarcode'}
                    onChange={e => setBarcode(e.target.value)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-[#00006A]">NO BARCODE</span>
                </label>
              </div>
            </div>

            {/* Barcode Input */}
            <div className="mb-6"
              style={{ display: barcode === 'barcode' ? 'none' : '' }}
            >
              <label htmlFor='scanbarcode' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Model Number#<span className='text-[#FF0404]'>*</span></label>

              <input
                id="scanbarcode"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={"Enter Model Number"}
                value={modelNumber}

                onChange={(e) => setModelNumber(e.target.value)}
                disabled={barcode === 'barcode' ? true : false}

              />
            </div>

            <div className='mb-6 flex justify-center items-center gap-2'>
              <button
                onClick={GenerateBarcode}

                style={{ display: barcode === 'barcode' ? 'none' : '' }}
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[35%]'>
                <span className='flex justify-center items-center'
                >
                  <p>Generate Barcode </p>
                </span>
              </button>



              <div id="barcode">
                <div id="barcode" className='hidden'>
                  <div id='header'>
                    <div>
                      <img src={logo} id='imglogo' alt='' />
                    </div>
                  </div>
                  <div id='inside-BRCode'>
                    {/* <Barcode value={`${parsedData.ITEMID} ${parsedData.SALESID}`} width={1} height={60} /> */}
                    <Barcode value={`${newBarcode}`} width={1} height={60} />
                  </div>
                </div>
              </div>




            </div>


            <div class="text-center mb-4"
              style={{ display: barcode !== 'barcode' ? 'none' : '' }}
            >
              <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                  flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
              >

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
                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="selectionType"
                    value="Pallet"
                    checked={selectionType === 'Pallet'}
                    onChange={e => setSelectionType(e.target.value)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                    disabled
                  />
                  <span className="ml-2 text-[#00006A]">BY PALLETE</span>
                </label>
              </div>
            </div>


            <div className="mb-6"
              style={{ display: barcode !== 'barcode' ? 'none' : '' }}>
              <label htmlFor='scan' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan {selectionType}#<span className='text-[#FF0404]'>*</span></label>

              <input
                id="scanpallet"
                className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={`Scan ${selectionType}`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onBlur={handleInputUser}

              />
            </div>








            <form
            //   onSubmit={handleFormSubmit}
            >



              <div className='mb-6'>
                <label className='text-[#00006A] font-semibold'>List of Items on RMA<span className='text-[#FF0404]'>*</span></label>
                {/* // creae excel like Tables  */}
                <div className="table-location-generate1">
                  <table>
                    <thead>
                      <tr>
                        <th>ITEMID</th>
                        <th>NAME</th>
                        <th>EXPECTEDRETQTY</th>
                        <th>SALESID</th>
                        <th>RETURNITEMNUM</th>
                        <th>INVENTSITEID</th>
                        <th>INVENTLOCATIONID</th>
                        <th>CONFIGID</th>
                        <th>WMSLOCATIONID</th>
                        <th>ITEMSERIALNO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((data, index) => (
                        <tr key={"rmaCl" + index}
                        >

                          <td>{data?.ITEMID}</td>
                          <td>{data?.NAME}</td>
                          <td>{data?.EXPECTEDRETQTY}</td>
                          <td>{data?.SALESID}</td>
                          <td>{data?.RETURNITEMNUM}</td>
                          <td>{data?.INVENTSITEID}</td>
                          <td>{data?.INVENTLOCATIONID}</td>
                          <td>{data?.CONFIGID}</td>
                          <td>{data?.WMSLOCATIONID}</td>
                          <td>{data?.ITEMSERIALNO}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>

                </div>
              </div>


              <div className='flex justify-end items-center gap-2'>
                <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="totals"
                  className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[30%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Totals"
                  value={filteredData.length}
                />
              </div>

            </form>



            {/* <div className="mb-6">
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Location To:<span className='text-[#FF0404]'>*</span></label>
              <input
                id="enterscan"
                value={locationInputValue}
                onChange={e => setLocationInputValue(e.target.value)}
                className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter/Scan Location"
              />
            </div > */}

            {/* <div className='mb-6 flex justify-center items-center'>
              <button
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[35%]'>
                <span className='flex justify-center items-center'   
                >
                  <p>Assign to User</p>
                </span>
              </button>
            </div> */}
          </div>
        </div >
      </div >
    </>
  )
}

export default ReturnRMALast