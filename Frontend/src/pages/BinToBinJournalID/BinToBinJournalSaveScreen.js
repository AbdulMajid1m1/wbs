import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./BinToBinJournalSaveScreen.css";
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import CustomSnakebar from '../../utils/CustomSnakebar';

const BinToBinJournalSaveScreen = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([])
  const [scanInputValue, setScanInputValue] = useState('');
  const [selectionType, setSelectionType] = useState('Pallet');
  const [locationInputValue, setLocationInputValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  // retrieve data from session storage
//   const storedData = sessionStorage.getItem('transferData');
//   const parsedData = JSON.parse(storedData);
//   console.log(parsedData)

//   useEffect(() => {
//     const getLocationData = async () => {
//       try {
//         const res = await userRequest.post("/getmapBarcodeDataByItemCode", {},
//           {
//             headers: {
//               itemcode: parsedData.ITEMID,
//               // itemcode: "IC1233",
//             }
//           })
//         console.log(res?.data)
//         setLocation(res?.data[0]?.BinLocation ?? "")
//       }
//       catch (error) {
//         console.log(error)
//         setError(error?.response?.data?.message ?? 'Cannot fetch location data');

//       }
//     }

//     getLocationData();

//   }, [parsedData.ITEMID])


//   const handleScan = (e) => {
//     e.preventDefault();
//     if (selectionType === 'Pallet') {
//       //  check if the scanned value is already in the table
//       const isAlreadyInTable = tableData.some(item => item.PALLETCODE === scanInputValue);
//       if (isAlreadyInTable) {
//         setError('This pallet is already in the table');
//         return;
//       }




//       userRequest.post(`/getShipmentRecievedCLDataByPalletCode?PalletCode=${scanInputValue}`
//       )
//         .then(response => {
//           console.log(response?.data)
//           // Append the new data to the existing data
//           setTableData(prevData => [...prevData, ...response?.data])

//         })
//         .catch(error => {
//           console.log(error)
//           setError(error?.response?.data?.message ?? 'Cannot fetch location data');

//         })
//     }
//     else if (selectionType === 'Serial') {
//       //  check if the scanned value is already in the table
//       const isAlreadyInTable = tableData.some(item => item.SERIALNUM === scanInputValue);

//       if (isAlreadyInTable) {
//         setError('This serial is already in the table');
//         return;
//       }
//       userRequest.get(`/getShipmentRecievedCLDataCBySerialNumber?SERIALNUM=${scanInputValue}`)
//         .then(response => {
//           console.log(response?.data)
//           // Append the new data to the existing data
//           setTableData(prevData => [...prevData, ...response?.data])

//         })
//         .catch(error => {
//           console.log(error)
//           setError(error?.response?.data?.message ?? 'Cannot fetch location data');

//         })
//     }

//     else {
//       return;
//     }

//   }





//   const handleSaveBtnClick = () => {
//     // Create a new array

//     const dataForAPI = tableData.map(row => {
//       // Return a new object for each row of the table
//       return {
//         ...row, // Spread the fields from the current row of the table
//         BIN: locationInputValue, // Replace the Bin value with the value from locationInputValue state
//         ...parsedData, // Spread the fields from parsedData
//         SELECTTYPE: selectionType // Add the SELECTTYPE field
//       };
//     });
//     console.log(dataForAPI);

//     // Now, you can send dataForAPI to the API endpoint
//     userRequest.post("/insertTblTransferBinToBinCL", dataForAPI)
//       .then(response => {
//         console.log(response);
//         setMessage("Data inserted successfully");
//         // clear the table

//         // call the update api to 
//         userRequest.put("/updateQtyReceivedInTblItemMaster", {
//           itemid: parsedData.ITEMID,
//           qty: dataForAPI.length
//         })
//           .then(response => {
//             console.log(response);
//             setMessage("Data updated successfully");
//             // clear the table
//             setTableData([]);
//             // clear the location input
//             setLocationInputValue('');
//             // clear the scan input
//             setScanInputValue('');
//             // clear the selection type


//           })
//           .catch(error => {
//             console.log(error);
//             setError(error?.response?.data?.message ?? 'Cannot insert data');
//           });


//       })
//       .catch(error => {
//         console.log(error);
//         setError(error?.response?.data?.message ?? 'Cannot insert data');
//       });
//   }







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
                <span className='text-white -mt-7'>Journal ID#:</span>
                <input
                //   value={parsedData.TRANSFERID}
                  className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Transfer ID Number"
                  disabled
                />

                <div className='flex gap-2 justify-center items-center'>
                  <span className='text-white'>FROM:</span>
                  <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                    block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Location Reference"
                    value={location}
                    disabled
                  />
                </div>
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                  <span>Item Code:</span>
                  {/* <span>{parsedData.ITEMID}</span> */}
                </div>

                <div className='text-[#FFFFFF]'>
                  {/* <span>CLASS {parsedData.INVENTLOCATIONIDFROM}</span> */}
                </div>
              </div>

              <div>
                <div className='flex gap-6 justify-center items-center text-xs mt-2 sm:mt-0 sm:text-lg'>
                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Quantity<span className='text-[#FF0404]'>*</span></span>
                    {/* <span>{parsedData.QTYTRANSFER}</span> */}
                  </div>

                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2 text-[#FFFFFF]'>
                    <span>Picked<span className='text-[#FF0404]'>*</span></span>
                    <span>0</span>
                  </div>
                </div>
              </div>


              <div class="text-center">
                <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                  flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
                >
                  <label className="inline-flex items-center mt-1">
                    <input
                      type="radio"
                      name="selectionType"
                      value="pallet"
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

            </div>

            <form
            //   onSubmit={handleFormSubmit}
            >
              <div className="mb-6">
                <label htmlFor='scan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan {selectionType}#<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="scan"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={`Enter Scan/${selectionType} Number`}

                  // submit when focus removed
                  onChange={e => setScanInputValue(e.target.value)}
                //   onBlur={handleScan}
                />
              </div>

              <div className='mb-6'>
                {/* // creae excel like Tables  */}
                <div className="table-location-generate1">
                  <table>
                    <thead>
                      <tr>
                        <th>Shipment ID</th>
                        <th>Container ID</th>
                        <th>Arrival Warehouse</th>
                        <th>Item Name</th>
                        <th>Item ID</th>
                        <th>Purch ID</th>
                        <th>Classification</th>
                        <th>Serial Num</th>
                        <th>RCVD Config ID</th>
                        <th>RCVD Date</th>
                        <th>GTIN</th>
                        <th>RZONE</th>
                        <th>Pallet Date</th>
                        <th>Pallet Code</th>
                        <th>Bin</th>
                        <th>Remarks</th>
                        <th>PO Qty</th>
                        <th>RCVD Qty</th>
                        <th>Remaining Qty</th>
                        <th>User ID</th>
                        <th>TRX Date Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
                        <tr key={"tranidRow" + index}>
                          <td>{data.SHIPMENTID}</td>
                          <td>{data.CONTAINERID}</td>
                          <td>{data.ARRIVALWAREHOUSE}</td>
                          <td>{data.ITEMNAME}</td>
                          <td>{data.ITEMID}</td>
                          <td>{data.PURCHID}</td>
                          <td>{data.CLASSIFICATION}</td>
                          <td>{data.SERIALNUM}</td>
                          <td>{data.RCVDCONFIGID}</td>
                          <td>{data.RCVD_DATE}</td>
                          <td>{data.GTIN}</td>
                          <td>{data.RZONE}</td>
                          <td>{data.PALLET_DATE}</td>
                          <td>{data.PALLETCODE}</td>
                          <td>{data.BIN}</td>
                          <td>{data.REMARKS}</td>
                          <td>{data.POQTY}</td>
                          <td>{data.RCVQTY}</td>
                          <td>{data.REMAININGQTY}</td>
                          <td>{data.USERID.trim()}</td>
                          <td>{data.TRXDATETIME}</td>
                        </tr>
                      ))}


                    </tbody>
                  </table>
                </div>


              </div >

            </form>

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
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[25%]'>
                <span className='flex justify-center items-center'
                //   onClick={handleSaveBtnClick}
                >
                  <p>Save</p>
                </span>
              </button>
            </div>
          </div>
        </div >
      </div >
    </>
  )
}

export default BinToBinJournalSaveScreen