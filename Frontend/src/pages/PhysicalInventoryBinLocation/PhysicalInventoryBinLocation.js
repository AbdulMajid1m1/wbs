import React, { useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./PhysicalInventoryBinLocation.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import { Autocomplete, TextField, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const iconMui = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const PhysicalInventoryBinLocation = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteRef = useRef(); // Ref to access the Autocomplete component
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [itemCodeFilterList, setItemCodeFilterList] = useState([]);
  const [selectionType, setSelectionType] = useState('Serial');
  const [dataList, setDataList] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [filterSelection, setFilterSelection] = useState('binLocation');

  const [dataGridbinLocationsList, setDataGridbinLocationsList] = useState([]);
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  useEffect(() => {
    userRequest.get('/getWmsJournalCountingOnlyCLByAssignedToUserId')
      .then(response => {
        // Set the retrieved data as options
        let data = response?.data;
        setDataList(data);
        setFilteredDataList(data);
        const dataGridbinLocationsList = Array.from(new Set(data?.map(item => item?.BINLOCATION))).filter(Boolean);
        setDataGridbinLocationsList(dataGridbinLocationsList);
      })
      .catch(error => {
        console.log(error);
        if (error?.response?.status === 404) {
          setError("No Data assigned to you");
          return
        }
        setError(error?.response?.data?.message ?? "Something went wrong!");

      });
  }, []);


  const handleBySelection = (event, value) => {
    console.log(value);
    if (value?.length > 0) {
      let filteredData = dataList.filter(item => value.includes(item.BINLOCATION));
      console.log(filteredData);
      setFilteredDataList(filteredData);
      return;
    }
    setFilteredDataList(dataList);

  };


  const handleInputUser = async (e) => {
    const itemSerialNo = e.target.value;
    setUserInput(itemSerialNo);
    if (!itemSerialNo) {
      setError("Serial Number is required");
      return;
    }

    try {
      const { data: validationData } = await userRequest.post("/validateItemSerialNumberForJournalCountingOnlyCLDets", { itemSerialNo });
      const mappedData = validationData?.data?.[0];

      const foundRecord = filteredDataList.find(item => item.BINLOCATION.trim() === mappedData.BinLocation.trim());

      if (!foundRecord) {
        setError("Mapped BinLocation not found in the list");
        return;
      }

      const updateParams = {
        TRXUSERIDASSIGNED: foundRecord?.TRXUSERIDASSIGNED,
        BINLOCATION: foundRecord?.BINLOCATION,
        TRXDATETIME: foundRecord?.TRXDATETIME,
      };
      const { data: updatedResponseData } = await userRequest.put("/incrementQTYSCANNEDInJournalCountingOnlyCLByBinLocation", updateParams);
      const updatedData = updatedResponseData?.data;

      const constructedData = {
        ...foundRecord,
        CONFIGID: mappedData?.Classification,
        BINLOCATION: mappedData?.BinLocation,
        QTYSCANNED: updatedData?.QTYSCANNED,
        ITEMSERIALNO: mappedData?.ItemSerialNo,
        ITEMID: mappedData?.ItemCode,
        ITEMNAME: mappedData?.ItemDesc,
        eventName: "physicalInventoryBinLocation",
      };

      await userRequest.post("/insertIntoWmsJournalCountingOnlyCLDets", [constructedData]);
      setMessage("Item Scanned Successfully");
      setUserInput("");

      const updateQtyScanned = (dataList, constructedData) => {
        return dataList.map(item => {
          if (item.BINLOCATION === constructedData.BINLOCATION) {
            const qtyScanned = Number(item.QTYSCANNED);
            const qtyOnHand = Number(item.QTYONHAND);

            const newQtyScanned = qtyScanned + 1;
            return {
              ...item,
              QTYSCANNED: newQtyScanned,
              QTYDIFFERENCE: qtyOnHand - newQtyScanned
            };
          }
          return item;
        });
      };

      setFilteredData(prev => [...prev, constructedData]);
      setFilteredDataList(prevList => updateQtyScanned(prevList, constructedData));
      setDataList(prevList => updateQtyScanned(prevList, constructedData));

    }
    catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleItemIdFilter = (event, value) => {
    setSelectedItemId(value);
  };
  useEffect(() => {

    filterData(selectedItemId);

  }, [selectedItemId]);

  const filterData = (itemId) => {
    let newFilteredData = [...dataList];
    if (itemId) {
      newFilteredData = newFilteredData.filter(item => item?.ITEMID === itemId);
    }
    setFilteredDataList(newFilteredData);
  };

  useEffect(() => {
    const itemIdOptions = Array.from(new Set(filteredDataList?.map(item => item?.ITEMID))).filter(Boolean);
    setItemCodeFilterList(itemIdOptions);


  }, [filteredDataList]);
  const handleRadioChange = (e) => {
    setFilterSelection(e.target.value);
   
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

                {/* <h2 className='text-center text-[#fff]'>Physical Inventory By BinLocation</h2> */}
                <h2 className='text-center text-[#fff]'>Wms Inventory</h2>

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


            <div className="mb-6 mt-4">
              <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                    flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
              >
                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="filterSelection"
                    value="itemCode"
                    checked={filterSelection === 'itemCode'}
                    onChange={e => handleRadioChange(e)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-[#00006A]">Filter by Item Id</span>
                </label>
                <label className="inline-flex items-center mt-1">
                  <input
                    type="radio"
                    name="filterSelection"
                    value="binLocation"
                    checked={filterSelection === 'binLocation'}
                    onChange={e => handleRadioChange(e)}
                    className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-[#00006A]">Filter by Bin Locations</span>
                </label>

              </div>
            </div>
          
          
            {dataList?.length > 0 && filterSelection === "binLocation" && (
              <div className="mt-6">
                <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Bin Locations</label>

                <div className='w-full'>
                  <Autocomplete
                    ref={autocompleteRef}
                    key={`itemCodebinLocaton ${autocompleteKey}`}
                    multiple

                    disableCloseOnSelect
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={iconMui}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option}
                      </li>
                    )}
                    id="location"
                    options={Array.from(new Set(dataGridbinLocationsList)).filter(Boolean)}
                    getOptionLabel={(option) => option}
                    onChange={handleBySelection}


                    onInputChange={(event, value) => {
                      if (!value) {
                        // perform operation when input is cleared
                        console.log("Input cleared");

                      }
                    }}

                    renderInput={(params) => (
                      <TextField {...params} label="Bin Locaions" placeholder="select locations" />
                    )


                    }
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


            {dataList?.length > 0 && filterSelection === "itemCode" && (
              <div className="mb-6 mt-6">
                <label htmlFor="itemIdFilter" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By Item Id</label>
                <Autocomplete
                  id="itemIdFilter"
                  ref={autocompleteRef}
                  key={`itemId ${autocompleteKey}`}
                  options={itemCodeFilterList}
                  getOptionLabel={(option) => option || ""}
                  onChange={handleItemIdFilter}
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
                      placeholder="Select Item ID to filter"

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
              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ITEMID</th>
                      <th>ITEMNAME</th>
                      {/* <th>ITEMGROUPID</th> */}
                      {/* <th>GROUPNAME</th> */}
                      <th>INVENTORYBY</th>
                      <th>TRXDATETIME</th>
                      <th>TRXUSERIDASSIGNED</th>
                      <th>TRXUSERIDASSIGNEDBY</th>
                      <th>QTYONHAND</th>
                      <th>QTYSCANNED</th>
                      <th>QTYDIFFERENCE</th>
                      {/* <th>JOURNALID</th> */}
                      <th>BINLOCATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDataList?.map((data, index) => (
                      <tr key={"tranidRow" + index}>
                        <td>{data.ITEMID}</td>
                        <td>{data.ITEMNAME}</td>
                        {/* <td>{data.ITEMGROUPID}</td> */}
                        {/* <td>{data.GROUPNAME}</td> */}
                        <td>{data.INVENTORYBY}</td>
                        <td>{data.TRXDATETIME}</td>
                        <td>{data.TRXUSERIDASSIGNED}</td>
                        <td>{data.TRXUSERIDASSIGNEDBY}</td>
                        <td>{data.QTYONHAND}</td>
                        <td>{data.QTYSCANNED}</td>
                        <td>{data.QTYDIFFERENCE}</td>
                        {/* <td>{data.JOURNALID}</td> */}
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
                value={filteredDataList?.length}
              />
            </div>




            <div class="text-center mb-4">
              <div className="bg-gray-50 border border-gray-300 text-[#00006A] text-xs rounded-lg focus:ring-blue-500
                  flex justify-center items-center gap-3 h-12 w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]"
              >
                {/* <label className="inline-flex items-center mt-1">
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
                </label> */}
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
                        {/* <th>ITEMGROUPID</th> */}
                        {/* <th>GROUPNAME</th> */}
                        {/* <th>JOURNALID</th> */}
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
                          {/* <td>{item.ITEMGROUPID}</td> */}
                          {/* <td>{item.GROUPNAME}</td> */}
                          {/* <td>{item.JOURNALID}</td> */}
                          <td>{item.INVENTORYBY}</td>
                          <td>{item.TRXDATETIME}</td>
                          <td>{item.TRXUSERIDASSIGNED}</td>
                          <td>{item.TRXUSERIDASSIGNEDBY}</td>
                          <td>{item.CLASSFICATION}</td>
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


