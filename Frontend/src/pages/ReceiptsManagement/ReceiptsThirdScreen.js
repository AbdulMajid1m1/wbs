import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./ReceiptsThirdScreen.css";
import { ReceiptsContext } from '../../contexts/ReceiptsContext';
import userRequest from '../../utils/userRequest';
import Swal from 'sweetalert2';

const ReceiptsThirdScreen = () => {
  const { serialNumLength, statedata, updateData, receivedQty, fetchItemCount } = useContext(ReceiptsContext);
  const [quantity, setQuantity] = useState(null);
  const [SERIALNUM, setSERIALNUM] = useState('');

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([

  ])

  useEffect(() => {

    updateData({ REMARKS: '' });
    fetchItemCount();
  }, [])



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (SERIALNUM === null || SERIALNUM === '') {
      return;
    }

    console.log(statedata);
    console.log(statedata?.POQTY)
    statedata.REMAININGQTY = statedata.POQTY - 1;

    const queryParameters = new URLSearchParams(statedata).toString();
    try {

      const response = await userRequest.post(
        `/insertShipmentRecievedDataCL?${queryParameters}`)

      console.log(response?.data);
      fetchItemCount();
      setTableData((prev) => [...prev, { SERIALNUM: SERIALNUM, RCVDCONFIGID: statedata.RCVDCONFIGID, REMARKS: statedata.REMARKS }]);
    }
    catch (error) {

      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message ?? 'Something went wrong!',
      })
    }
    finally {
      setSERIALNUM('');
      document.getElementById('SERIALNUM').value = '';
    }
    try {
      const updateDimensions = await userRequest.put("/updateStockMasterData", {
        ITEMID: statedata?.ITEMID,
        Length: statedata?.LENGTH,
        Width: statedata?.WIDTH,
        Height: statedata?.HEIGHT,
        Weight: statedata?.WEIGHT,

      })
      console.log(updateDimensions?.data);

    }
    catch (error) {
      console.error(error);

    }

  }


  return (
    <>
      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto px-3 sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#e69138] text-xl mb:2 md:mb-5">

              <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                <div className='w-full flex justify-end'>
                  <button onClick={() => navigate(-1)} className='w-[15%] rounded-sm bg-[#fff] text-[#e69138]'>
                    Back
                  </button>
                </div>
                <span className='text-white'>JOB ORDER NUMBER</span>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 " placeholder="Job Order Number"
                  value={statedata?.SHIPMENTID ?? ''}
                  disabled
                />
                <span className='text-white'>CONTAINER NUMBER</span>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500
                  block w-full p-1.5 md:p-2.5 " placeholder="Job Order Number"
                  value={statedata?.CONTAINERID ?? ''}
                  disabled
                />
              </div>

              <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                <div className='flex items-center sm:text-lg gap-2'>
                  <span>Item Code:</span>
                  <span>{statedata?.ITEMID ?? ''}</span>
                </div>

                <div className='flex gap-4'>
                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2'>
                    <span>POQty</span>
                    <span>{statedata?.POQTY ?? ""}</span>
                  </div>
                  <div className='flex flex-col justify-center items-center text-center sm:text-lg gap-2'>
                    <span>Received Qty</span>
                    <span>{receivedQty}</span>
                  </div>

                  <div className='flex flex-col justify-center items-center sm:text-lg gap-2'>
                    <span>CON</span>
                    <span>{statedata?.CLASSIFICATION ?? ""}</span>
                  </div>
                </div>
              </div>

            </div>
            <form
              onSubmit={handleFormSubmit}
            >

              <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-black">Item Name</label>
                <input id="scan" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Scan/GTIN Number"
                  value={statedata?.ITEMNAME ?? ''}
                  disabled
                />

              </div>

              <div className="mb-6">
                <label htmlFor="zone" className="block mb-2 text-xs font-medium text-black">Remarks</label>
                <input id="zone" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Remarks (USER INPUT)"
                  onChange={(e) => {
                    updateData({ ...statedata, REMARKS: e.target.value });
                  }
                  }
                />
              </div>

              <div className='mb-6'>
                <label htmlFor="selectConfig" className="block mb-2 text-xs font-medium text-black">List of Item Config</label>

                <select
                  name="selectConfig"
                  id="selectCongigId"
                  className="select-custom bg-gray-50 border-2 text-gray-900 text-xs rounded-lg focus:ring-bg-[#e69138]-500 focus:border-orange-500 block w-full p-2 md:p-3 dark:focus:ring-orange-500 dark:focus:border-orange-500"

                  onChange={(e) => {
                    updateData({ ...statedata, RCVDCONFIGID: e.target.value });
                  }}
                >
                  <option value="G">G</option>
                  <option value="D">D</option>
                  <option value="DC">DC</option>
                  <option value="MCI">MCI</option>
                  <option value="S">S</option>
                </select>


              </div>

              <div className="mb-6">
                <label htmlFor="SERIALNUM" className="block mb-2 text-xs font-medium text-black">Enter Serial Number</label>
                <input id="SERIALNUM" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Scan/GTIN Number"
                  onChange={(e) => {
                    updateData({ ...statedata, SERIALNUM: e.target.value });
                    setSERIALNUM(e.target.value);
                  }}
                  onBlur={handleFormSubmit}
                />
              </div>

              {/* <div className="mb-6">
                <button type='submit'
                  className="bg-[#e69138] text-white font-semibold py-2 px-10 rounded-sm">
                  Insert Serial Number
                </button>
              </div> */}

              <div className="mb-6">
                {/* // creae excel like Tables  */}
                <div className="table-location-generate1">
                  <table>
                    <thead>
                      <tr>
                        <th>Serial Number</th>
                        <th>Config</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>

                      {tableData.length > 0 && tableData.map((item, index) => {
                        return (
                          <tr key={"record" + index}>

                            <td key={index + "td1"}>{item.SERIALNUM}</td>
                            <td key={index + "td2"}>{item.RCVDCONFIGID}</td>
                            <td key={index + "td4"}>{item.REMARKS}</td>

                          </tr>
                        )
                      }


                      )}

                    </tbody>
                  </table>
                </div>
              </div >

            </form>
          </div>
        </div >
      </div >
    </>
  )
}

export default ReceiptsThirdScreen