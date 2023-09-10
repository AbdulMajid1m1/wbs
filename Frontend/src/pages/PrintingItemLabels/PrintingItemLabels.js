import "./PrintingItemLabels.css";
import { useNavigate } from "react-router-dom";
import logo from "../../images/alessalogo2.png"
import Barcode from "react-barcode";
import { useEffect, useState } from "react";
import CustomSnakebar from "../../utils/CustomSnakebar";
import { QRCodeSVG } from "qrcode.react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";


const PrintingItemLabels = () => {
   const navigate = useNavigate();
   const [message, setMessage] = useState(null);
   const [error, setError] = useState(null);
   const [userGtinData, setUserGtinData] = useState('');
   const [serialNumber, setSerialNumber] = useState('');
   const [itemCode, setItemCode] = useState('');
   const [dataList, setDataList] = useState([{
    "ITEMID": "100000000,",
   }]);
   const [open, setOpen] = useState(false);

 
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
 
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     userRequest.get("/getAllTblStockMaster")
//       .then((res) => {
//         setData(res.data ?? []);
//         console.log(res?.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);


const [autocompleteLoading, setAutocompleteLoading] = useState(false);

    const handleAutoCompleteInputChnage = async (event, newInputValue) => {
    
    }
    
    const handleAutoComplete = async (event, value) => {
        console.log('Selected value:');
        console.log(value);
       
      };

    return (
        <>
            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

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


          <div className="flex justify-center items-center w-full">
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
                                    <div className="mb-6">
                                        <label htmlFor="searchInput" className="text-[#00006A] text-center font-semibold"
                                            style={{ marginBottom: "10px" }}
                                           >Enter Select Item Code</label>

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
                                                label="Enter Select Item Code here"
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

                                        />

                                        </div>

                                        <label className="mt-5">Item Description<span className="text-red-500 font-semibold">*</span></label>
                                        <input className="mt-2" type="text" placeholder="Item Description"/>
                                    </div>
                                    <div className="buttonAdd">
                                        <button
                                            style={{background: '#1E3B8B'}}
                                            type="button"
                                        >Generate Serials</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                </div >

            </span >
            </div>

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
        </>
    );
};

export default PrintingItemLabels;