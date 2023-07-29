import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import icon from "../../images/close.png"
import "./WmsPalletIDInquiry.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';
import userRequest from '../../utils/userRequest';

const WmsPalletIDInquiry = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [serial, setSerial] = useState('');

  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };


const handleForm = (e) => {
    setIsLoading(true)
    e.preventDefault();
    userRequest.post('/getItemInfoByItemSerialNo', {}, {
        headers: {
          itemserialno: serial
        }
      })
      //Show only one palletCode
    .then(response => {
      const { GTIN, PalletCode } = response.data[0];
      setData([{ GTIN, PalletCode }]);
    //   setMessage(response?.data?.message ?? 'Data Displayed');
      setIsLoading(false)
   
    })

    // Show Multiple PalletCode
    // .then(response => {
    //     const extractedData = response.data.map(item => ({
    //       GTIN: item.GTIN,
    //       PalletCode: item.PalletCode
    //     }));
    //     setData(extractedData);
    //     setIsLoading(false)
    //   })

    .catch(error => {
      console.log(error);
      setError(error?.response.data?.message);
      setIsLoading(false)
      setData([])
    });
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
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-center text-[#fff]'>PALLET ID INQUIRY</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>

            <form onSubmit={handleForm}>
              <div className='mb-6'>
                <label htmlFor='serial'
                  className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Serial Number<span className='text-[#FF0404]'>*</span></label>
                <div className='w-full flex'>
                  <input
                    id="serial"
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                    placeholder="Scan Serial Number"
                    onChange={(e) => setSerial(e.target.value)}
                  />
                  <button
                    type='submit'
                    className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm'
                  >
                    FIND
                  </button>

                </div>
              </div>
            </form>

         
               {/* Table to display GTIN and Pallet Code */}
                <div className="table-location-generate1">
                    <table>
                        <thead>
                            <tr>
                            <th>GTIN</th>
                            <th>Pallet Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.GTIN}</td>
                                <td>{item.PalletCode}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>  
            </div>         
        </div>
      </div>
    </>
  )
}

export default WmsPalletIDInquiry