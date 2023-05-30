import React, { useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./PhysicalInventoryBinLocation.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField } from '@mui/material';

const PhysicalInventoryBinLocation = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [currentUser, setCurrentUser] = useState(initialUser);

  const [selectionType, setSelectionType] = useState('Serial');
  const [dataList, setDataList] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  // useEffect(() => {
  //   setIsLoading(true);
  //   userRequest.get('/getWmsJournalCountingOnlyCLByAssignedToUserId')
  //     .then(response => {
  //       console.log(response?.data);
  //       setDataList(response?.data ?? []);
  //       setIsLoading(false);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       setIsLoading(false);
  //     });

  // }, []);


      const [options, setOptions] = useState([]);

      useEffect(() => {
        userRequest.get('/getBinLocationByUserIdFromJournalCountingOnlyCL')
          .then(response => {
            // Set the retrieved data as options
            setOptions(response.data);
          })
          .catch(error => {
            // Handle errors
            console.error('Error fetching options:', error);
          });
      }, []);
    
    
    const handleBySelection = (event, value) => {
      setIsLoading(true);
      console.log('Selected value:', value);
      
      // Make the API request to fetch the table data based on the selected value
      userRequest.get(`/getWmsJournalCountingOnlyCLByBinLocation?binloacation=${value.BINLOCATION}`)
        .then(response => {
          // Set the retrieved data as the table data
          setDataList(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          // Handle errors
          console.error('Error fetching table data:', error);
          setIsLoading(false);
        });
    };
    

  const handleInputUser = async (e) => {
    let itemSerialNo = e.target.value;
    setUserInput(itemSerialNo);
    if (e.target.value === "") {
      setError("Serial Number is required");
      return;
    }

    try {
      const res = await userRequest.post("/validateItemSerialNumberForJournalCountingOnlyCLDets", { itemSerialNo })
      console.log(res?.data);
      console.log(res?.data?.data);
      let mappedData = res?.data?.data[0];

      // find the record in dataList bases on mappedData.ITEMID
      // let foundRecord = dataList.find(item => item.BINLOCATION === mappedData.BinLocation);
      // let foundRecord = dataList.find(item =>
      //   {
      //    item.BINLOCATION === mappedData.BinLocation
      //   console.log(item.BINLOCATION+" "+  " equal to  "+" "+ mappedData.BinLocation)
      //   });
    //   let foundRecord = dataList.find(item => {
    //     console.log(item.BINLOCATION + " equal to " + mappedData.BinLocation);
    //     return item.BINLOCATION === mappedData.BinLocation;
    // });

    let foundRecord = dataList.find(item => {
      console.log(item.BINLOCATION + " equal to " + mappedData.BinLocation);
  console.log(item.BINLOCATION === mappedData.BinLocation);
      return item.BINLOCATION === mappedData.BinLocation;
  });
      
      console.log(foundRecord);
      if (!foundRecord) {
        setError("Mapped BinLocation not found in the list");
        return;
      }

      // call the update api
      try {

        // const updateApiResponse = await userRequest.put("/incrementQTYSCANNEDInJournalCountingOnlyCL",
        const updateApiResponse = await userRequest.put("/incrementQTYSCANNEDInJournalCountingOnlyCLByBinLocation",
          {
            TRXUSERIDASSIGNED: foundRecord?.TRXUSERIDASSIGNED,
            ITEMID: mappedData?.ItemCode,
            // mappedData?.ItemCode,
            TRXDATETIME: foundRecord?.TRXDATETIME,
          }
        )

        console.log(updateApiResponse?.data);
        let updatedData = updateApiResponse?.data?.data;

        let apiData = {
          ...foundRecord,
          CONFIGID: mappedData?.Classification,
          BINLOCATION: mappedData?.BinLocation,
          QTYSCANNED: updatedData?.QTYSCANNED,
          ITEMSERIALNO: mappedData?.ItemSerialNo,
        }
        
        console.log(apiData);
        try {
          const insertApiResponse = await userRequest.post("/insertIntoWmsJournalCountingOnlyCLDets", [apiData])
          console.log(insertApiResponse?.data);
          setMessage("Item Scanned Successfully");
          setUserInput("");
          setFilteredData(prev => [...prev, apiData]);


        }
        catch (error) {

          console.log(error);
          setError(error?.response?.data?.message ?? "Something went wrong!");

        }




      }
      catch (error) {
        console.log(error);
        setError(error?.response?.data?.message ?? "Something went wrong!");
      }










    }
    catch (error) {
      console.log(error);
      setError(error?.response?.data?.message ?? "Something went wrong!");
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
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg" style={{ minHeight: '550px' }}>
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-center text-[#fff]'>Physical Inventory By BinLocation</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>

            <div className='mb-6'>
              <h2 className='text-[#00006A] text-center font-semibold'>Current Logged in User ID:<span className='text-[#FF0404]' style={{ "marginLeft": "5px" }}>{currentUser?.UserID}</span></h2>
            </div>

            <div className='mb-6'>
              <label className='text-[#00006A] text-center font-semibold'>FROM:</label>

              <Autocomplete
                id="by"
                options={options}
                getOptionLabel={(option) => option.BINLOCATION ?? ''}
                onChange={handleBySelection}

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

                    className="bg-gray-50 border border-gray-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                    placeholder="Binlocation"
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
           
            <div className='mb-6'>
              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ITEMID</th>
                      <th>ITEMNAME</th>
                      <th>ITEMGROUPID</th>
                      <th>GROUPNAME</th>
                      <th>INVENTORYBY</th>
                      <th>TRXDATETIME</th>
                      <th>TRXUSERIDASSIGNED</th>
                      <th>TRXUSERIDASSIGNEDBY</th>
                      <th>QTYSCANNED</th>
                      <th>QTYDIFFERENCE</th>
                      <th>QTYONHAND</th>
                      <th>JOURNALID</th>
                      <th>BINLOCATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataList.map((data, index) => (
                      <tr key={"tranidRow" + index}>
                        <td>{data.ITEMID}</td>
                        <td>{data.ITEMNAME}</td>
                        <td>{data.ITEMGROUPID}</td>
                        <td>{data.GROUPNAME}</td>
                        <td>{data.INVENTORYBY}</td>
                        <td>{data.TRXDATETIME}</td>
                        <td>{data.TRXUSERIDASSIGNED}</td>
                        <td>{data.TRXUSERIDASSIGNEDBY}</td>
                        <td>{data.QTYSCANNED}</td>
                        <td>{data.QTYDIFFERENCE}</td>
                        <td>{data.QTYONHAND}</td>
                        <td>{data.JOURNALID}</td>
                        <td>{data.BINLOCATION}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            </div>


            <div className='mb-4 flex justify-end items-center gap-2'>
              <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
              <input
                id="totals"
                className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[30%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Totals"
                value={dataList.length}
              />
            </div>




            <div class="text-center mb-4">
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
                    disabled
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

            <form
            >


              <div className="mb-6">
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

              <div className='mb-6'>
                {/* // creae excel like Tables  */}
                <div className="table-location-generate1">
                  <table>
                    <thead>
                      <tr>
                        <th>ITEMID</th>
                        <th>ITEMNAME</th>
                        <th>ITEMGROUPID</th>
                        <th>GROUPNAME</th>
                        <th>JOURNALID</th>
                        <th>INVENTORYBY</th>
                        <th>TRXDATETIME</th>
                        <th>TRXUSERIDASSIGNED</th>
                        <th>TRXUSERIDASSIGNEDBY</th>
                        <th>CONFIGID</th>
                        <th>ITEMSERIALNO</th>
                       
                        <th>QTYSCANNED</th>
                        <th>BINLOCATION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.ITEMID}</td>
                          <td>{item.ITEMNAME}</td>
                          <td>{item.ITEMGROUPID}</td>
                          <td>{item.GROUPNAME}</td>
                          <td>{item.JOURNALID}</td>
                          <td>{item.INVENTORYBY}</td>
                          <td>{item.TRXDATETIME}</td>
                          <td>{item.TRXUSERIDASSIGNED}</td>
                          <td>{item.TRXUSERIDASSIGNEDBY}</td>
                          <td>{item.CONFIGID}</td>
                          <td>{item.ITEMSERIALNO}</td>
                         
                          <td>{item.QTYSCANNED}</td>
                          <td>{item.BINLOCATION}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>



              </div >

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



            {/* <div className='mb-6'>
              <button
                type='button'
                className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[25%]'>
                <span className='flex justify-center items-center'
                >
                  <p>Save</p>
                </span>
              </button>
            </div> */}

          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default PhysicalInventoryBinLocation


