import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userRequest from "../../utils/userRequest"
import "./ReceiptsManagement.css";
import { ReceiptsContext } from '../../contexts/ReceiptsContext';
import { TblReceiptsManagementColumn } from '../../utils/datatablesource';
import DashboardTable from '../../components/AlessaDashboardTable/DashboardTable';
import { Autocomplete, TextField } from '@mui/material';


const ReceiptsManagement = () => {
  const navigate = useNavigate();
  const { statedata, updateData } = useContext(ReceiptsContext);
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem('receiptsData')) ?? []

  );

  const [filterData, setFilterData] = useState(data);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [shipmentTag, setShipmentTag] = useState('');

  const handleRowClick = (rowData, index) => {
    setSelectedRowIndex(index);

    setSelectedRow(rowData);
    updateData(rowData); // update context data
  };


  const handleChangeValue = (e) => {
    setShipmentTag(e.target.value);
  }

  const handleForm = (e) => {
    e.preventDefault();

    userRequest.post(`/getShipmentDataFromtShipmentReceiving?SHIPMENTID=${shipmentTag}`)
      .then(response => {
        console.log(response?.data);

        setData(response?.data ?? []);
        setFilterData(response?.data ?? []);
        setSelectedRow(response?.data[0] ?? []);
        // save data in session storage
        sessionStorage.setItem('receiptsData', JSON.stringify(response?.data ?? []));

      })

      .catch(error => {
        console.error(error);

      });
  }

  const handleAutoComplete = (event, value) => {

    let containerId = value?.CONTAINERID.trim();
    if (!containerId) {
      setFilterData(data);
      return;
    }
    console.log(value);
    const newData = data.filter(item => item.CONTAINERID.trim() === containerId);
    setFilterData(newData);
  };




  return (
    <>

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-300 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-6 rounded-lg">
            <div className="w-full flex justify-center text-black font-semibold text-xl mb:2 md:mb-5">
              RECEIVING
            </div>
            <button onClick={() => navigate(-1)} className='w-[15%] rounded-sm text-[#fff] bg-[#e69138]'>
              Back
            </button>
            <div>
              <form onSubmit={handleForm} className="mt-6 md:mt-10 flex justify-between items-center w-full text-sm md:text-xl py-2 rounded-md">
                <label htmlFor="total" className="block text-xs font-medium text-[#00006A]">SHIPMENT ID</label>
                <input
                  id="total"
                  onChange={handleChangeValue}
                  placeholder='Enter Shipment ID'
                  className="bg-white border border-gray-300 text-gray-900 text-xs font-bold tracking-wider rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[70%] p-1.5 md:p-2.5 "
                />

                <button
                  type='submit'
                  className="bg-[#e69138] hover:bg-[#efae68] text-white font-medium py-1 px-6 rounded-sm w-[15%]">
                  <span className='flex justify-center items-center'>
                    <p>Find</p>
                    {/* <img src={accept} className='h-6 w-9' alt='' /> */}
                  </span>
                </button>


              </form>

              {filterData.length > 0 && (



                <div className="mb-6 mt-6">
                  <label htmlFor="zone" className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Filter By CONTAINERID</label>
                  <Autocomplete
                    id="zone"
                    options={data}
                    getOptionLabel={(option) => option?.CONTAINERID || ""}
                    onChange={handleAutoComplete}
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


              <div className="mb-6 -mx-5">

                <DashboardTable data={filterData} title={"Receipts Management"} columnsName={TblReceiptsManagementColumn}
                  uniqueId="receiptsManagement"
                  
                  secondaryColor="secondary" // to get orange color in table

                />
              </div >


              <div className='flex justify-end items-center gap-3'>
                <label htmlFor="total" className="block ml-8 text-xs font-medium text-black">TOTALS</label>
                <input
                  id="total"
                  value={data.length}
                  className="bg-gray-50 border text-center border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[15%] p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div >
          </div >
        </div >
      </div >
    </>
  )
}

export default ReceiptsManagement