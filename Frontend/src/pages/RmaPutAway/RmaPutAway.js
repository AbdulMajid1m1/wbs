import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./RmaPutAway.css";
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const WmsCycleCounting = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [binlocation, setBinlocation] = useState('');
  const storedUser = localStorage.getItem('currentUser');
  const initialUser = storedUser ? JSON.parse(storedUser) : {};


  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  useEffect(() => {
    const getRmaReturn = async () => {
      try {
        const res = await userRequest.get("/getWmsReturnSalesOrderClByAssignedToUserId")
        console.log(res?.data);
        setData(res?.data ?? [])
        setIsLoading(false)
      }
      catch (error) {
        console.log(error);
        setError(error?.response?.data?.message ?? 'Something went wrong')
        setIsLoading(false)
      }
    };
    getRmaReturn();
  }, []);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!binlocation) {
      setError("Please enter bin location");
      return;
    }
    setIsLoading(true);

    const mappedData = data.map((item) => ({
      itemcode: item.ITEMID,
      itemdesc: item.NAME,
      classification: item.RETURNITEMNUM,
      mainlocation: item.INVENTSITEID,
      binlocation: binlocation,
      intcode: item.CONFIGID,
      itemserialno: item.ITEMSERIALNO,
      mapdate: item.TRXDATETIME ?? "",
      user: item.ASSIGNEDTOUSERID ?? "",
      gtin: "", // Add any default or empty values for the new fields in the API
      remarks: "",
      palletcode: "",
      reference: "",
      sid: "",
      cid: "",
      po: "",
  
    }));

    try {
      const res = await userRequest.post("/insertManyIntoMappedBarcode", { records: mappedData });
      console.log(res?.data);
      setIsLoading(false);
      setMessage("Data Inserted Successfully.");
      // Clear form fields and data state
      setBinlocation("");
      setData([]);
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message ?? "Something went wrong");
      setIsLoading(false);
    }
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
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">
             
            <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-[white] text-center font-semibold'>Current Logged in User ID:<span className='text-[white]' style={{ "marginLeft": "5px" }}>{initialUser?.UserID}</span></h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>

            </div>




            <div className='mb-6'>
              <label className='text-[#00006A] font-semibold'>List of RMA PutAway<span className='text-[#FF0404]'>*</span></label>
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
                      <th>ASSIGNEDTOUSERID</th>
                      <th>TRXDATETIME</th>
                      <th>TRXUSERID</th>
                      <th>ITEMSERIALNO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ITEMID}</td>
                        <td>{item.NAME}</td>
                        <td>{item.EXPECTEDRETQTY}</td>
                        <td>{item.SALESID}</td>
                        <td>{item.RETURNITEMNUM}</td>
                        <td>{item.INVENTSITEID}</td>
                        <td>{item.INVENTLOCATIONID}</td>
                        <td>{item.CONFIGID}</td>
                        <td>{item.WMSLOCATIONID}</td>
                        <td>{item.ASSIGNEDTOUSERID}</td>
                        <td>{item.TRXDATETIME}</td>
                        <td>{item.TRXUSERID}</td>
                        <td>{item.ITEMSERIALNO}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>


              </div>
            </div>

            <div className='mb-6'>
              <label htmlFor='bin' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Bin location<span className='text-[#FF0404]'>*</span></label>
              <div className='w-full flex'>
                <input
                  id="bin"
                  className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                  placeholder="Binlocation"
                  onChange={(e) => setBinlocation(e.target.value)}
                />
              </div>
            </div>




            <form onSubmit={handleFormSubmit}>
              <div className='mt-6'>
                <div className='w-full flex justify-between place-items-end'>
                  <div className='w-full'>
                    <button
                      type='submit'
                      className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-[35%]'>
                      <span className='flex justify-center items-center'
                      >
                        <p>Save</p>
                      </span>
                    </button>
                  </div>


                  <div>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                    <input
                      id="totals"
                      className="bg-gray-50 font-semibold text-center placeholder:text-[#00006A] border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Totals"
                      value={data.length}
                    />
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default WmsCycleCounting


