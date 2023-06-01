import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import UserDataTable from '../../components/UserDatatable/UserDataTable';
import { AllItems } from '../../utils/datatablesource';

const WmsItemMapping = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [currentUser, setCurrentUser] = useState(initialUser);


  const [data, setData] = useState([]);
  const [userserial, setUserSerial] = useState("");
  const [usergtin, setUserGtin] = useState("");
  const [userconfig, setUserConfig] = useState("");
  const [userdate, setUserDate] = useState("");
  const [userqrcode, setUserQrCode] = useState("");
  const [userbinlocation, setUserBinlocation] = useState("");


  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  // to reset snakebar messages
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

//   useEffect(() => {
//     setIsLoading(true);
//     userRequest.get('/getAllTblStockMaster')
//       .then(response => {
//         console.log(response?.data);
//         setData(response?.data ?? []);
//         setIsLoading(false);
//       })
//       .catch(error => {
//         console.error(error);
//         setIsLoading(false);
//       });

//   }, []);


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

                <h2 className='text-center text-[#fff]'>Item Mapping</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>

            <div className=''>
              <h2 className='text-[#00006A] text-center font-semibold'>Current Logged in User ID:<span className='text-[#FF0404]' style={{ "marginLeft": "5px" }}>{currentUser?.UserID}</span></h2>
            </div>

            <div className='-mt-3'>
            <UserDataTable data={data} columnsName={AllItems} backButton={false}
                actionColumnVisibility={false}
                buttonVisibility={false}
              />
            </div>


              <div className="mb-6">
                <label htmlFor='scan' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Serial#<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="scan"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder='Scan Serial'
                  onChange={(e) => setUserSerial(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label htmlFor='gtin' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan GITN#<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="gtin"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder='Scan GTIN'
                  onChange={(e) => setUserGtin(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label htmlFor='config' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Select CONFIG#<span className='text-[#FF0404]'>*</span></label>
                <select
                  id="config"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder='Scan CONFIG'
                //   value={userconfig}
                  onChange={(e) => setUserConfig(e.target.value)}
                >
                    <option value="">Select CONFIG</option>
                    <option value="1">G/WG</option>
                    <option value="2">D/WG</option>
                    <option value="2">S/WG</option>
                    <option value="2">PRMDL (V)</option>
                </select>
              </div>


              <div className='mb-6 flex justify-between gap-3'>
                <div>
                    <label htmlFor='date' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Manufacturing Date<span className='text-[#FF0404]'>*</span></label>
                    <input
                        id="date"
                        className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder='Manufacturing Date'
                      onChange={(e) => setUserDate(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor='qrcode' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan QR Code<span className='text-[#FF0404]'>*</span></label>
                    <input
                    id="qrcode"
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder='Scan QR Code'
                      onChange={(e) => setUserQrCode(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor='binlocation' className="mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Binlocation<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="binlocation"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder='Scan Binlocation'
                  onChange={(e) => setUserBinlocation(e.target.value)}
                />
              </div>

              <div className='mb-6'>
                <button
                    type='button'
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[30%]'>
                    <span className='flex justify-center items-center'
                    >
                    <p>Save</p>
                    </span>
                </button>
              </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default WmsItemMapping


