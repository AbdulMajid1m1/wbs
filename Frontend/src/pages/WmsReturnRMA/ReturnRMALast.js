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
  const [username, setUserName] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);


  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  // retrieve data from session storage
  // const storedData = sessionStorage.getItem('PickingRowData');
  const storedData = sessionStorage.getItem('RmaRowData');
  const parsedData = JSON.parse(storedData);
  console.log("parsedData")
  console.log(parsedData)








  const handleSaveBtnClick = async (e) => {
    e.preventDefault()
    handleAddUserClose()
    if (locationInputValue === "") {
      setError("Please select a location")
      return;
    }

    if (newBarcode === "") {
      setError("Item Serial Number cannot be empty")
      return;
    }


    let apiData = parsedData;
    apiData.INVENTLOCATIONID = locationInputValue;
    apiData.ITEMSERIALNO = newBarcode;
    apiData.ASSIGNEDTOUSERID = username;

    try {
      const res = await userRequest.post(
        `/insertIntoWmsReturnSalesOrderCl`,
        [apiData],

      );
      console.log(res?.data)
      setMessage(res?.data?.message ?? 'Data saved successfully');

      // clear the filtered data and user input
      setFilteredData([]);
      setLocationInputValue("");
      setTimeout(() => {
        navigate(-1);
      }, 1000);

    }
    catch (error) {
      console.log(error)
      setError(error?.response?.data?.message ?? 'Cannot save data');

    }
  }

  const GenerateBarcode = async () => {

    if (modelNumber === "") {
      setError("Please enter a model number")
      return;
    }



    const response = await userRequest.post("/generateBarcodeForRma",
      {
        RETURNITEMNUM: parsedData?.RETURNITEMNUM,
        ITEMID: parsedData?.ITEMID,
        MODELNO: modelNumber,
      }
    )
    console.log(response?.data)
    setNewBarcode(response?.data?.RMASERIALNO)
    setMessage(response?.data?.message ?? 'Barcode generated successfully');
    // APPPEND THIS BARCODE TO THE SELECTED ROW

  }

  const handleAddUserClose = () => {
    setAddUser(false);
  };

  const handleAddUserPopup = async () => {
    setAddUser(true);
    try {
      const res = await userRequest.get('/getAllTblUsers');
      setUsersList(res.data);
      console.log(res.data);
      console.log("wokf")
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || 'Something went wrong')

    };
  };



  
  const handlePrint = () => {
    
    // Open a new window/tab with only the QR code
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
      '<div id="barcode"></div>' +
      '</div>' +
      '</body></html>';

    printWindow.document.write(html);
    const barcodeContainer = printWindow.document.getElementById('barcode');
    const barcode = document.getElementById('barcode').cloneNode(true);
    barcodeContainer.appendChild(barcode);


    // Add logo image to document
    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      printWindow.document.getElementById('imglogo').src = logoImg.src;

      printWindow.print();
      printWindow.close();
    };
  }



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


                  <div className='text-[#FFFFFF] w-full'>
                    <span>NAME: {parsedData.NAME}</span>
                  </div>
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
                // onBlur={handleInputUser}
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
                      <Barcode value="RMA0040408 GNGJ90JGWC RV900JPK" width={1} height={60} />
                    </div>
                  </div>
              </div>


              {/* Print Barcode */}
              <button
                type='button'
                onClick={handlePrint}
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[35%]'>
                <span className='flex justify-center items-center'
                >
                  <p>Print Barcode </p>
                </span>
                </button>
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

                      <tr
                      >
                        <td>{parsedData?.ITEMID}</td>
                        <td>{parsedData?.NAME}</td>
                        <td>{parsedData?.EXPECTEDRETQTY}</td>
                        <td>{parsedData?.SALESID}</td>
                        <td>{parsedData?.RETURNITEMNUM}</td>
                        <td>{parsedData?.INVENTSITEID}</td>
                        <td>{parsedData?.INVENTLOCATIONID}</td>
                        <td>{parsedData?.CONFIGID}</td>
                        <td>{parsedData?.WMSLOCATIONID}</td>
                        <td>{newBarcode}</td>
                      </tr>

                    </tbody>
                  </table>

                </div>
              </div>


              {/* <div className='flex justify-end items-center gap-2'>
                <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="totals"
                  className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[30%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Totals"
                  value={filteredData.length}
                />
              </div> */}

            </form>

            {/* AddUser Popup Screen */}
            {addUser && (
              <div className="popup-container fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                <div className="popup bg-white rounded-lg shadow-xl overflow-hidden max-w-md m-4">
                  <div className="header bg-blue-500 text-white font-bold py-4 px-6">
                    <h2>Add User</h2>
                  </div>
                  {/* onSubmit={handleFormSubmit} */}
                  <form className="p-6" onSubmit={handleSaveBtnClick}>
                    <label htmlFor="UserName" className="block mb-2 text-gray-700 text-sm">Name:</label>
                    <select
                      id="UserName"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">--Select User--</option>
                      {usersList.map((user) => (
                        <option key={user.UserID} value={user.UserID}>
                          {user.Fullname}
                        </option>
                      ))}
                    </select>

                    <div className="flex justify-end gap-3 mt-6">
                      <button className="close-btn text-white bg-red-500 hover:bg-red-600 rounded-lg px-6 py-2" type="button" onClick={handleAddUserClose}>CANCEL</button>
                      <button className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-6 py-2" type="submit">SUBMIT</button>
                    </div>
                  </form>
                </div>
              </div>
            )}




            <div className="mb-6">
              <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Location To:<span className='text-[#FF0404]'>*</span></label>
              <input
                id="enterscan"
                value={locationInputValue}
                onChange={e => setLocationInputValue(e.target.value)}
                className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter/Scan Location"
              />
            </div >

            <div className='mb-6 flex justify-center items-center'>
              <button
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[35%]'>
                <span className='flex justify-center items-center'
                  // onClick={handleSaveBtnClick}
                  onClick={handleAddUserPopup}
                >
                  <p>Assign to User</p>
                </span>
              </button>
            </div>
          </div>
        </div >
      </div >
    </>
  )
}

export default ReturnRMALast