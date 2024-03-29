import React, { useState, useEffect } from 'react';
import "./PrintingItemLabels.css";
import { useNavigate } from "react-router-dom";
import logo from "../../images/alessalogo2.png"
import Barcode from "react-barcode";
import CustomSnakebar from "../../utils/CustomSnakebar";
import { QRCodeSVG } from "qrcode.react";
import userRequest from "../../utils/userRequest";
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { SyncLoader } from 'react-spinners';


const PrintingItemLabels = () => {
   const navigate = useNavigate();
   const [message, setMessage] = useState(null);
   const [error, setError] = useState(null);
   const [userGtinData, setUserGtinData] = useState('');
   const [serialNumber, setSerialNumber] = useState('');
   const [itemCode, setItemCode] = useState('');
 
   const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };
   

   const handlePrintGtin = () => {
    if (userGtinData.length === 0) {
      setError('Please Enter Gtin Number.');
      return;
    }
    const printWindow = window.open('', 'Print Window', 'height=400,width=800');
    const html = '<html><head><title>Gtin</title>' +
      '<style>' +
      '@page { size: 3in 2in; margin: 0; }' +
      'body { font-size: 13px; line-height: 0.1;}' +
      '#header { display: flex; justify-content: center;}' +
      '#imglogo {height: 40px; width: 100px;}' +
      '#itemcode { font-size: 13px; font-weight: 600; display: flex; justify-content: center;}' +
      '#inside-BRCode { display: flex; justify-content: center; align-items: center; padding: 1px;}' +
      '#gtinNo { font-size: 13px; display: flex; justify-content: center; font-weight: 600; margin-top: 3px;}' +
      '#main-print { height: 100%; width: 100%;}' +
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
      setTimeout(() => {
        setUserGtinData('');
      }
        , 500);
      
    };
  }


 
  const handlePrintItemBarcode = () => {
    if (itemCode.length === 0) {
      setError('Please Enter ItemCode.');
      return;
    }
    if (serialNumber.length === 0) {
        setError('Please Serial Number.');
        return;
      }
    const printWindow = window.open('', 'Print Window', 'height=400,width=800');
    const html = '<html><head><title>Serial Number</title>' +
      '<style>' +
      '@page { size: 3in 2in; margin: 0; }' +
      'body { font-size: 13px; line-height: 0.1;}' +
      '#header { display: flex; justify-content: center;}' +
      '#imglogo {height: 40px; width: 100px;}' +
      '#itemcode { font-size: 13px; font-weight: 600; display: flex; justify-content: center;}' +
      '#inside-BRCode { display: flex; justify-content: center; align-items: center; padding: 1px;}' +
      '#itemSerialNo { font-size: 13px; display: flex; justify-content: center; font-weight: 600; margin-top: 3px;}' +
      '#main-print { height: 100%; width: 100%;}' +
      '</style>' +
      '</head><body>' +
      '<div id="printBarcode"></div>' +
      '</body></html>';

    printWindow.document.write(html);
    const barcodeContainer = printWindow.document.getElementById('printBarcode');
    const barcode = document.getElementById('QrcodeGtin').cloneNode(true);
    barcodeContainer.appendChild(barcode);

    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      printWindow.document.getElementById('imglogo').src = logoImg.src;
      printWindow.print();
      printWindow.close();
        setTimeout(() => {
            setItemCode('');
            setSerialNumber('');
         }, 500);
        
    };
  }
 

  const handlePrintSerialsPage = () => {
    const printWindow = window.open('', 'Print Window', 'height=400,width=800');
    const html = '<html><head><title>Serial Number</title>' +
      '<style>' +
      '@page { size: 3in 2in; margin: 0; }' +
      'body { font-size: 13px; line-height: 0.1;}' +
      '#header { display: flex; justify-content: center;}' +
      '#imglogo {height: 40px; width: 100px;}' +
      '#itemcode { font-size: 13px; font-weight: 600; display: flex; justify-content: center;}' +
      '#inside-BRCode { display: flex; justify-content: center; align-items: center; padding: 1px;}' +
      '#itemSerialNo { font-size: 13px; display: flex; justify-content: center; font-weight: 600; margin-top: 3px;}' +
      '#Qrcodeserails { height: 100%; width: 100%;}' +
      '</style>' +
      '</head><body>' +
      '<div id="printBarcode"></div>' +
      '</body></html>';

    printWindow.document.write(html);
    const barcodeContainer = printWindow.document.getElementById('printBarcode');
    const barcode = document.getElementById('main-pages').cloneNode(true);
    barcodeContainer.appendChild(barcode);

    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      printWindow.document.getElementById('imglogo').src = logoImg.src;
      printWindow.print();
      printWindow.close();
        setTimeout(() => {
            setItemDescription('');
            setItemQuantity('');
         }, 500);
        
    };
  }


  const [dataList, setDataList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [serials, setSerials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 

 
  const handleAutoCompleteInputChnage = async (event, newInputValue) => {
    if (newInputValue) {
      setAutocompleteLoading(true);
  
      try {
        const response = await userRequest.get(`/getItemIdsbySearchText?searchText=${newInputValue}`);
        const fetchedData = response.data;
  
        // Assuming the API response is an array of items with ITEMID and ITEMNAME properties
        setDataList(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setAutocompleteLoading(false);
      }
    } else {
      setDataList([]); // Clear the data if there's no input
    }
  };

//   console.log(selectedOption);


  const handleGenerateSerial = async () => {
    setIsLoading(true);
    if (selectedOption == 0) {
      setError("Please Select Any Item")
      return;
    }
    if (itemQuantity == 0) {
        setError("Please Enter any Item Quantity")
        return;
      }

    try {
      const res = await userRequest.post('/generateSerialNumberforStockMasterAndInsertIntoMappedBarcode',
        // ITEMNAME, Width, Height, Length, Weight
        {
          ITEMID: selectedOption?.ITEMID,
          ITEMNAME: selectedOption?.ITEMNAME,
          Width: selectedOption?.Width,
          Height: selectedOption?.Height,
          Length: selectedOption?.Length,
          Weight: selectedOption?.Weight,  
          SerialQTY: itemQuantity,
        });
        console.log(res?.data);
        setIsLoading(false);

        if (res?.data?.generatedSerials && res?.data?.generatedSerials.length > 0) {
          setSerials(res?.data?.generatedSerials || []);
          setMessage(res?.data?.message || 'Serial Generated Successfully');
    
        //   handlePrintSerialsPage();

            // console.log('Serials:', serials);
            console.log('Serials:', res?.data?.generatedSerials);
   
        } else {
          setError(res?.data?.message || 'No serials were generated');
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setError(error?.response?.data?.message || 'Something went wrong');
      }
    
    
  }
    
// Use useEffect to perform actions after serials state is updated
useEffect(() => {
    if (serials.length > 0) {
      handlePrintSerialsPage();
    }
  }, [serials]);


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

            <span
            >
                <div className="assetCategoryForm">
                    <div className="newContainer">
                        <div className="top">
                            <span className="topSpan">

                                <h1>Printing Pallet label</h1>
                                <button
                                    onClick={() => navigate(-1)}
                                >Go Back</button>
                            </span>
                        </div>
                        <div className="bottom">


                            <div className="right">
                                
                                <form id="myForm" >
                                        <div className="formInput">
                                            <label>Enter GTIN To Print<span className="text-red-500 font-semibold">*</span></label>
                                            <input className="mt-2" type="text" value={userGtinData} onChange={(e) => setUserGtinData(e.target.value)} placeholder="Enter GTIN Number"/>
                                        </div>
                                    <div className="buttonAdd">
                                        <button
                                            style={{background: '#1E3B8B'}}
                                            type="button"
                                            onClick={handlePrintGtin}
                                        >Print</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                </div >

            </span >


          {/* <div className="flex justify-center items-center w-full"> */}
            <span
                className="w-full"
            >
                <div className="assetCategoryForm">
                    <div className="newContainer">
                        <div className="top">
                            <span className="topSpan">
                                <h1>Printing Serial Number</h1>
                            </span>
                        </div>
                        <div className="bottom">


                            <div className="right">      
                                <form id="myForm" >
                                    <div className="formInput">
                                        <label className="mt-5">Enter item ID/Code<span className="text-red-500 font-semibold">*</span></label>
                                        <input className="mt-2" type="text" value={itemCode} onChange={(e) => setItemCode(e.target.value)} placeholder="Enter item ID/Code"/>

                                        <label className="mt-5">Enter Serial Number<span className="text-red-500 font-semibold">*</span></label>
                                        <input className="mt-2" type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Enter Serial Number"/>
                                    </div>
                                    <div className="buttonAdd">
                                        <button
                                            style={{background: '#1E3B8B'}}
                                            type="button"
                                            onClick={handlePrintItemBarcode}
                                        >Print</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                </div >

            </span >


            <span
                className="w-full"
            >
                <div className="assetCategoryForm">
                    <div className="newContainer">
                        <div className="top">
                            <span className="topSpan">
                                <h1>Print / Generate Serial Number</h1>
                            </span>
                        </div>
                        <div className="bottom">


                            <div className="right">      
                                <form id="myForm" >
                                    <div className="formInput">
                                    <label className="mt-5"
                                    >Search ItemID / Code<span className="text-red-500 font-semibold">*</span></label>
                                        <Autocomplete
                                            id="searchInput"
                                            options={dataList}
                                            getOptionLabel={(option) => option?.ITEMID} // Only display ITEMID in the dropdown
                                            onChange={(event, newValue) => {
                                                setSelectedOption(newValue); // Store the selected value in state
                                                setIsOptionSelected(true);
                                            }}
                                            className="custom-autocomplete" 
                                            onInputChange={(event, newInputValue) => handleAutoCompleteInputChnage(event, newInputValue)}
                                            loading={autocompleteLoading}
                                            sx={{ marginTop: '10px' }}
                                            open={open}
                                            onOpen={() => {
                                                setOpen(true);
                                            }}
                                            onClose={() => {
                                                setOpen(false);
                                            }}
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                {option?.ITEMID}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                {...params}
                                                label="Search ItemID / Code"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                    <>
                                                        {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
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
                                            disableClearable={true}
                                            />


                                        <label className="mt-5">Item Description<span className="text-red-500 font-semibold">*</span></label>
                                        <input className="mt-2" 
                                            type="text" 
                                                value={selectedOption?.ITEMNAME} 
                                                    onChange={(e) => setItemDescription(e.target.value)} placeholder="Item Description"
                                        />

                                        
                                        <label className="mt-5">Enter Quantity<span className="text-red-500 font-semibold">*</span></label>
                                        <input className="mt-2" 
                                            type="number" 
                                             value={itemQuantity} 
                                            //   onChange={(e) => setItemQuantity(e.target.value)}
                                            onChange={(e) => {
                                                let newValue = parseInt(e.target.value, 10); // Parse the input value as an integer
                                                newValue = isNaN(newValue) ? 0 : Math.max(newValue, 0); // Ensure it's not NaN and not negative
                                                setItemQuantity(newValue);
                                              }}
                                              placeholder="Item Quantity"
                                        
                                        />

                                    </div>
                                    <div className="buttonAdd">
                                        <button
                                            style={{background: '#1E3B8B'}}
                                            type="button"
                                            onClick={handleGenerateSerial}
                                        >Generate Serials</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                </div >

            </span >
            

            <div id="main-print">
                <div id="barcode" className='hidden'>
                    <div id='header'>
                    <div>
                        <img src={logo} id='imglogo' alt='' />
                    </div>
                    </div>
                    {/* <div>
                    <p id="itemcode">{selectedRow.data.ItemCode}</p>
                    </div> */}
                    <div id='inside-BRCode'>
                        <Barcode value={userGtinData} width={1} height={50} fontSize={14}/>
                    </div>
                </div>
            </div>



               <div id="main-print">
                    <div id="QrcodeGtin" className='hidden'>
                        <div id='header'>
                            <div>
                                <img src={logo} id='imglogo' alt='' />
                            </div>
                        </div>
                        <div>
                            <p id="itemcode">{itemCode}</p>
                        </div>
                        <div id='inside-BRCode'>
                           <QRCodeSVG value={serialNumber} width={100} height={50} />
                        </div>
                        
                        <div id="itemSerialNo">
                            <p>{serialNumber}</p>
                        </div>
                    </div>
                    </div>


                     <div id="main-pages">
                        {serials.map((serial, index) => (
                            <div id="Qrcodeserails" className="hidden" key={index}>
                            <div id="header">
                                <div>
                                <img src={logo} id="imglogo" alt="" />
                                </div>
                            </div>
                            <div id="inside-BRCode">
                                <QRCodeSVG value={serial} width="170" height="70" />
                            </div>
                            <div id="itemSerialNo">
                                <p>{serial}</p>
                            </div>
                            </div>
                        ))}
                    </div>
        </>
    );
};

export default PrintingItemLabels;