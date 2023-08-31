import "./PrintingItemLabels.css";
import { useNavigate } from "react-router-dom";
import logo from "../../images/alessalogo2.png"
import Barcode from "react-barcode";
import { useState } from "react";
import CustomSnakebar from "../../utils/CustomSnakebar";
import { QRCodeSVG } from "qrcode.react";


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
    const html = '<html><head><title>Print Barcode</title>' +
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
    const html = '<html><head><title>Print Barcode</title>' +
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
    //   setTimeout(() => {
    //     setSelectedRow([]);
    //     setRowSelectionModel([]);

    //   }, 500);
    };
  }
 
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

                                <h1>GTIN Number</h1>
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
                                            <input type="text" onChange={(e) => setUserGtinData(e.target.value)} placeholder="Enter GTIN Number"/>
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


            <span
            >
                <div className="assetCategoryForm">
                    <div className="newContainer">
                        <div className="top">
                            <span className="topSpan">
                                <h1>Enter Serial Number</h1>
                            </span>
                        </div>
                        <div className="bottom">


                            <div className="right">      
                                <form id="myForm" >
                                    <div className="formInput">
                                        <label className="mt-5">Enter item ID/Code<span className="text-red-500 font-semibold">*</span></label>
                                        <input type="text" onChange={(e) => setItemCode(e.target.value)} placeholder="Enter item ID/Code"/>

                                        <label className="mt-5">Enter Serial Number<span className="text-red-500 font-semibold">*</span></label>
                                        <input type="text" onChange={(e) => setSerialNumber(e.target.value)} placeholder="Enter Serial Number"/>
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
