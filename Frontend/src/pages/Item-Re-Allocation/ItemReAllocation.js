import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa"
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import "./ItemReAllocation.css";
// import CustomSnakebar from '../../utils/CustomSnakebar';
// import back from "../../images/back.png"
import undo from "../../images/undo.png"
import { SyncLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const ItemReAllocation = () => {
  const navigate = useNavigate();

  const [transferTag, setTransferTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [serialnum, setSerialNum] = useState('');
  const [selectionType, setSelectionType] = useState('allocation');
  // const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };


  // const handleOptionChange = (event) => {
  //   setSelectedOption(event.target.value);
  // }


  const handleChangeValue = (e) => {
    setTransferTag(e.target.value);
  }

  const handleForm = (e) => {
    e.preventDefault();
    setIsLoading(true)

    userRequest.post(`/getItemInfoByPalletCode`, {}, {
      headers: {
        'palletcode': transferTag,
      }
    })
      .then(response => {
        console.log(response?.data);

        setData(response?.data ?? []);
        setIsLoading(false)
        setMessage(response?.data?.message ?? 'Data Displayed');
      })

      .catch(error => {
        console.error(error);
        setIsLoading(false)
        setError(error?.response.data?.message ?? 'Wrong Bin Scan');

      });

  }



  const responseData = [
    {
      "selectionType": "allocation",
      "serialnum": "11",
      "stockQty": 50,
      "itemId": "ITEMID2",
      "ItemCode": "CODE1",
      "ItemDesc": "Item Description 1",
      "GTIN": "GTIN001",
      "Remarks": "Remark 1",
      "User": "User1",
      "Classification": "Class1",
      "MainLocation": "Location1",
      "BinLocation": "Bin1",
      "IntCode": "CODE1",
      "MapDate": "2023-06-01",
      "PalletCode": "PALLET001",
      "Reference": "REF1",
      "SID": "SID1",
      "CID": "CID1",
      "PO": "PO1",
      "Trans": 12
    },

    {
      "selectionType": "picking",
      "serialnum": "11",
      "stockQty": 2,
      "itemId": "item002"
    }

  ];

  const handleBinLocation = (e) => {
    e.preventDefault();
    const dataForAPI = data.map(row => {
      // Return a new object for each row of the table
      return {
        ...row, // Spread the fields from the current row of the table
        serialnum: serialnum,
        selectionType: selectionType,


      };



    });
    console.log(dataForAPI);
    userRequest.post('/manageItemsReallocation', dataForAPI)
      .then((response) => {
        console.log(response);

        setMessage(response?.data?.message);
        // alert('done')
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.message);
        //  alert(error)
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
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-400 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <div className='flex justify-between items-center gap-2 text-xs sm:text-xl'>
                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={undo} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>

                <h2 className='text-center text-[#fff]'>Items Re-Allocation</h2>

                <button onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                  <span>
                    <img src={icon} className='h-auto w-8 object-contain' alt='' />
                  </span>
                </button>
              </div>
            </div>

            <div className='flex justify-center items-center gap-5'>
              <label className="inline-flexitems-center mt-1">
                <input
                  type="radio"
                  name="selectionType"
                  value="allocation"
                  checked={selectionType === 'allocation'}
                  onChange={e => setSelectionType(e.target.value)}
                  className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                />
                <span className="ml-2 text-[#00006A]">Allocation</span>
              </label>
              <label className="inline-flex items-center mt-1">
                <input
                  type="radio"
                  name="selectionType"
                  value="picking"
                  checked={selectionType === 'picking'}
                  onChange={e => setSelectionType(e.target.value)}
                  className="form-radio h-4 w-4 text-[#00006A] border-gray-300 rounded-md"
                />
                <span className="ml-2 text-[#00006A]">Picking</span>
              </label>
            </div>

            <form onSubmit={handleForm}>
              <div className='mb-6'>
                <label htmlFor='transfer'
                  className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Enter/Scan PalletID<span className='text-[#FF0404]'>*</span></label>
                <div className='w-full flex'>
                  <input
                    id="transfer"
                    className="bg-gray-50 font-semibold border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5"
                    placeholder="Scan Bin From"
                    onChange={handleChangeValue}
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

            <div className='mb-6'>
              <label className='text-[#00006A] font-semibold'>List of Items on Pallets<span className='text-[#FF0404]'>*</span></label>
              {/* // creae excel like Tables  */}
              <div className="table-location-generate1">
                <table>
                  <thead>
                    <tr>
                      <th>ItemCode</th>
                      <th>ItemDesc</th>
                      <th>GTIN</th>
                      <th>Remarks</th>
                      <th>User</th>
                      <th>Classification</th>
                      <th>MainLocation</th>
                      <th>BinLocation</th>
                      <th>IntCode</th>
                      <th>ItemSerialNo</th>
                      <th>MapDate</th>
                      <th>PalletCode</th>
                      <th>Reference</th>
                      <th>SID</th>
                      <th>CID</th>
                      <th>PO</th>
                      <th>Trans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ItemCode}</td>
                        <td>{item.ItemDesc}</td>
                        <td>{item.GTIN}</td>
                        <td>{item.Remarks}</td>
                        <td>{item.User}</td>
                        <td>{item.Classification}</td>
                        <td>{item.MainLocation}</td>
                        <td>{item.BinLocation}</td>
                        <td>{item.IntCode}</td>
                        <td>{item.ItemSerialNo}</td>
                        <td>{item.MapDate}</td>
                        <td>{item.PalletCode}</td>
                        <td>{item.Reference}</td>
                        <td>{item.SID}</td>
                        <td>{item.CID}</td>
                        <td>{item.PO}</td>
                        <td>{item.Trans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


            <form onSubmit={handleBinLocation}>
              <div className="mb-6">
                <label htmlFor='enterscan' className="block mb-2 sm:text-lg text-xs font-medium text-[#00006A]">Scan Serial Item:<span className='text-[#FF0404]'>*</span></label>
                <input
                  id="enterscan"
                  className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter/Scan Serial"
                  onChange={(e) => setSerialNum(e.target.value)}
                />
              </div >

              <div className='mt-6'>
                <div className='w-full flex justify-between place-items-end'>
                  <div>
                    <button
                      type='submit'
                      className='bg-[#F98E1A] hover:bg-[#edc498] text-[#fff] font-medium py-2 px-6 rounded-sm w-full'>
                      <span className='flex justify-center items-center'>
                        <p>Save</p>
                      </span>
                    </button>
                  </div>

                  <div>
                    <label htmlFor='totals' className="block mb-2 sm:text-lg text-xs font-medium text-center text-[#00006A]">Totals<span className='text-[#FF0404]'>*</span></label>
                    <input
                      id="totals"
                      className="bg-gray-50 font-semibold text-center border border-[#00006A] text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

export default ItemReAllocation