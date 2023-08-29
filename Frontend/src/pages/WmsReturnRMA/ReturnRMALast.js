import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./ReturnRMALast.css";
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';
import Barcode from "react-barcode";
import logo from "../../images/alessalogo2.png"
import { SyncLoader } from 'react-spinners';


const ReturnRMALast = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([])
  const [selectionType, setSelectionType] = useState('Serial');
  const [barcode, setBarcode] = useState('noBarcode');
  const [isLoading, setIsLoading] = useState(false);
  // const [newTableData, setNewTableData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [newBarcode, setNewBarcode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [scanLocationToList, setScanLocationToList] = useState([]);
  const [binlocation, setBinlocation] = useState('');

  // State to keep track of the selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllRows, setSelectAllRows] = useState(false);


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
        const res = await userRequest.get("/getAllTblRZones")
        console.log(res?.data)
        setLocation(res?.data ?? [])

      }
      catch (error) {
        console.log(error)
        setError(error?.response?.data?.message ?? 'Cannot fetch Receving Zones data');

      }
    }

    getLocationData();

  }, [parsedData?.ITEMID])

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

  const handleFromSelect = (event, value) => {
    setSelectedValue(value);
    // fetchData(value);
  };

  const GenerateBarcode = async () => {

    if (modelNumber === "") {
      setError("Please enter a model number")
      return;
    }
    if (selectedValue === null) {
      setError("Please select a location")
      return;
    }


    try {
      const response = await userRequest.post("/generateBarcodeForRma",
        {
          RETURNITEMNUM: parsedData?.RETURNITEMNUM,
          MODELNO: modelNumber,
        }
      )
      console.log(response?.data)
      setNewBarcode(response?.data?.RMASERIALNO)
      console.log("newBarcode", response?.data?.RMASERIALNO)
      setMessage(response?.data?.message ?? 'Barcode generated successfully');

      filterData(response?.data?.RMASERIALNO);

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
    setNewBarcode(e.target.value);
    console.log(e.target.value)
    if (e.target.value.length === 0) {
      setTimeout(() => {
        setError("Please scan a barcode");
      }, 100);
      return
    }

    console.log(userInput)


    filterData(e.target.value);

  }

  const filterData = async (newBarcodeValue) => {
    let apiData = { ...parsedData, ITEMSERIALNO: newBarcodeValue };
    if (selectedValue === null) {
      setTimeout(() => {

        setError("Please select a location");
      }, 200);

      return;
    }

    try {
      await userRequest.post(`/insertIntoWmsReturnSalesOrderCl`, [apiData]);


      // const insertData = {
      //   ItemDesc: parsedData?.NAME,
      //   ItemCode: parsedData?.ITEMID,
      //   ItemSerialNo: newBarcodeValue,
      //   MapDate: new Date().toLocaleDateString(),
      //   PalletCode: null,
      //   BinLocation: selectedValue
      // };

      // const lowerCaseInsertData = Object.fromEntries(
      //   Object.entries(insertData).map(([k, v]) => [k.toLowerCase(), v])
      // );


      // const response = await userRequest.post(
      //   "/insertManyIntoMappedBarcode",
      //   { records: [lowerCaseInsertData] }
      // );

      // setMessage(response?.data?.message ?? 'Data inserted successfully');

      setFilteredData(prev => [...prev, apiData]);
      setUserInput("");
    } catch (error) {
      setError(error?.response?.data?.message ?? 'Cannot save data');
    }
  };

  const handlescanLocationToSelect = (event, value) => {
    setBinlocation(value);
  };


  const handleSaveBtnClick = async () => {
    if (filteredData?.length === 0) {
      setError("Please scan a barcode");

      return;
    }
    if (selectedRows.length === 0) {
      setError("Please select at least one row");
      return;
    }
    if (binlocation === "") {
      setError("Please select a Scan location to");
      return;
    }

    try {
      setIsLoading(true)
      const selectedData = selectedRows.map((index) => filteredData[index]); // Filter the selected rows from the data array

      const mappedData = selectedData.map((item) => ({
        ...(item?.ITEMID && { itemcode: item?.ITEMID }),
        itemdesc: item?.NAME,
        classification: item?.RETURNITEMNUM,
        mainlocation: item?.INVENTSITEID,
        binlocation: binlocation,
        intcode: item?.CONFIGID,
        itemserialno: item?.ITEMSERIALNO,
        // mapdate: item?.TRXDATETIME ?? "",
        user: item?.ASSIGNEDTOUSERID ?? "",
        gtin: "",
        remarks: "",
        palletcode: "",
        reference: "",
        sid: "",
        cid: "",
        po: "",
      }));



      const res = await userRequest.post("/insertManyIntoMappedBarcode", { records: mappedData });
      console.log(res?.data);

      let insertedSerialNumbers = mappedData?.map((record) => {
        return record?.itemserialno;
      })

      console.log(insertedSerialNumbers)
      const deleteRes = await userRequest.delete("/deleteMultipleRecordsFromWmsReturnSalesOrderCl", { data: insertedSerialNumbers })
      console.log(deleteRes?.data);

      setMessage("Data Inserted Successfully.");
      // Clear form fields and data state

      setSelectedRows([]); // Clear selected rows after successful insertion
      // filter the data array to remove the selected rows
      setFilteredData(filteredData.filter((_, index) => !selectedRows.includes(index)));
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message ?? "Something went wrong");

    }
    finally {
      setIsLoading(false)
    }


  }

  const handleRowSelect = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
    setSelectAllRows(false); // If individual row is selected/deselected, deselect "Select All" heading checkbox
  };

  const handleSelectAllRows = () => {
    setSelectAllRows(!selectAllRows); // Toggle the selectAllRows state
    if (!selectAllRows) {
      // If currently not all rows are selected, select all rows
      setSelectedRows(filteredData?.map((_, index) => index));
    } else {
      // If currently all rows are selected, deselect all rows
      setSelectedRows([]);
    }
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


              </div>

              <div className='flex flex-col lg:flex-row justify-start items-start gap-2 mt-2 text-xs sm:text-base'>
                <div className='w-full lg:w-1/3 sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Item Code:</span>
                  <span>{parsedData?.ITEMID}</span>
                </div>
                <div className='w-full lg:w-1/3 sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Invent Location Id:</span>
                  <span>{parsedData?.INVENTLOCATIONID}</span>
                </div>
                <div className='w-full lg:w-1/3 sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Sales ID:</span>
                  <span>{parsedData?.SALESID}</span>
                </div>
              </div>

              <div className='flex flex-col lg:flex-row justify-start items-center gap-6 text-xs sm:text-lg sm:mt-0 mt-2'>
                <div className='w-full lg:w-1/2 sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Return Quantity: </span>
                  <span> {parsedData.EXPECTEDRETQTY}</span>
                </div>

                <div className='w-full lg:w-1/2 sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Picked: </span>
                  <span>1</span> {/* Replace with {filteredData.length} when ready */}
                </div>
              </div>


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


            <div className="mb-6">
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Receiving Zones<span className='text-[#FF0404]'>*</span></label>


              <div className='w-full'>
                <Autocomplete
                  ref={autocompleteRef}
                  key={autocompleteKey}
                  id="location"
                  // options={location.filter(item => item.BinLocation)}
                  // getOptionLabel={(option) => option.BinLocation}
                  options={Array.from(new Set(location.map(item => item?.RZONE))).filter(Boolean)}
                  getOptionLabel={(option) => option}
                  onChange={handleFromSelect}

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
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-full sm:w-1/2 md:w-[35%]'>
                <span className='flex justify-center items-center'>
                  <p>Generate Barcode</p>
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
                        <th className="flex items-center gap-1">

                          <input
                            type="checkbox"
                            checked={selectAllRows} // Use the selectAllRows state for the checked value
                            onChange={handleSelectAllRows} // Call a new function for the onChange event
                          />
                        </th>
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
                          className={selectedRows.includes(index) ? 'selected' : ''}
                          onClick={() => handleRowSelect(index)}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(index)}
                              onChange={() => handleRowSelect(index)}
                            />
                          </td>

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
                  value={filteredData?.length}
                />
              </div>

            </form>

            <div className="mb-6">
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Location To:<span className='text-[#FF0404]'>*</span></label>
              <div className='w-full'>
                <Autocomplete
                  ref={autocompleteRef}
                  key={`${autocompleteKey} ScanLocationTo`}
                  id="ScanLocationTo"
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


            <div className='mt-6'>
              <div className='w-full flex justify-between place-items-end'>
                <div className='w-full'>
                  <button onClick={handleSaveBtnClick}
                    type='submit'
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[35%]'>
                    <span className='flex justify-center items-center'
                    >
                      <p>Save</p>
                    </span>
                  </button>
                </div>
              </div>
            </div>




          </div>
        </div >
      </div >
    </>
  )
}

export default ReturnRMALast