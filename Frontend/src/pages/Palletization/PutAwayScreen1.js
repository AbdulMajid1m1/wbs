import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { PalletizingByTransferIdColumn } from '../../utils/datatablesource';
import PutAwayTable from '../../components/Put-AwayTable/PutAwayTable';
import { FaSearch } from "react-icons/fa"
import userRequest from '../../utils/userRequest';
import icon from "../../images/close.png"
import Swal from 'sweetalert2';
import { BeatLoader } from 'react-spinners';
import CustomSnakebar from '../../utils/CustomSnakebar';

const PutAway = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [shipmentTag, setShipmentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isValidation, setIsValidation] = useState(false)
  const [shipmentValidate, setShipmentValidate] = useState('');
  const [isValidationNeeded, setIsValidationNeeded] = useState(false)
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };



  const handleForm = (e) => {
    e.preventDefault();
    setIsLoading(true)

    // userRequest.get(`/getShipmentPalletizingByTransferId?TRANSFERID=${shipmentTag}`)
    userRequest.get(`/getTransferDistributionByTransferId?TRANSFERID=${shipmentTag}`)
      .then(response => {
        // console.log(response?.data);
        setData(response?.data ?? []);

        // Set the shipmentValidate state from the response

        let shipmentId = response?.data?.[0]?.SHIPMENTID;
        console.log(shipmentId);
        setShipmentValidate(shipmentId);
        // if shipmentid is null or undefined or "" then set isValidationNeeded to true
        if (!shipmentId || shipmentId === "") {
          setIsValidationNeeded(true);
        }
        else {
          sessionStorage.setItem('putawaydatashipmentId', shipmentId);
          setIsValidationNeeded(false);
        }
        // save data in session storage
        sessionStorage.setItem('putawaydata', JSON.stringify(response?.data ?? []));
        setIsLoading(false);
      })

      .catch(error => {
        console.error(error);
        setIsLoading(false);
        setShipmentValidate('')
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message ?? 'Something went wrong!',
        })
      });
  }


  const handleChangeValue = (e) => {
    setShipmentTag(e.target.value);
  }




  const handleChangevalidate = (e) => {
    // setShipmentValidate(e.target.value)
    const inputValue = e.target.value;
    setShipmentValidate(inputValue);


  }

  const handleShipmentIdValidation = async () => {
    if (data?.length === 0) {
      setError("Please Scan Transfer Id First")
      return;
    }
    if (shipmentValidate.trim() === '') {
      setIsValidation(false);
      setError("Please Enter Shipment Id")
      return;
    }
    try {

      const response = await userRequest.get(`/validateShipmentIdFromShipmentReceivedCl?SHIPMENTID=${shipmentValidate}`)

      // alert(response?.data?.message)
      setMessage(response?.data?.message ?? "Shipment Id is valid")
      sessionStorage.setItem('putawaydatashipmentId', shipmentValidate);
      setIsValidation(true)
    }
    catch (error) {
      console.log(error)
      setError(error?.response?.data?.message)
      setIsValidation(false)
    }
  }

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
          <BeatLoader
            size={18}
            color={"#F98E1A"}
            // height={4}
            loading={isLoading}
          />
        </div>
      }

      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute ">
        <div className="w-full h-auto sm:px-5 flex items-center justify-center absolute">
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-300 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4  rounded-lg">
            <div className="w-full font-semibold p-6 shadow-xl rounded-md text-black bg-[#F98E1A] text-xl mb:2 md:mb-5">

              <form onSubmit={handleForm}>
                <div className='flex flex-col gap-2 text-xs sm:text-xl'>
                  <div className='w-full flex justify-between'>
                    <div className='w-[85%]'>
                      <div className='relative'>
                        <div
                          className='w-full text-lg font-thin -mt-1 placeholder:text-[#fff] text-[#fff] bg-[#e69138] border-gray-300 focus:outline-none focus:border-blue-500 pl-8'
                        // placeholder=''
                        >
                          Shipment Palletizing
                        </div>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
                          <FaSearch size={18} className='text-[#FFF]' />
                        </div>
                      </div>
                    </div>

                    <button type='button' onClick={() => navigate(-1)} className='hover:bg-[#edc498] font-medium -mt-2 rounded-sm w-[15%] p-2 py-1 flex justify-center items-center '>
                      <span>
                        <img src={icon} className='h-auto w-8 object-contain' alt='' />
                      </span>
                    </button>
                  </div>

                  <span className='text-white'>Enter/scan Transfer Order ID</span>

                  <div className='flex justify-center gap-1'>
                    <input
                      onChange={handleChangeValue}
                      name=''
                      className="bg-gray-50 border border-gray-300 text-xs text-[#00006A] rounded-lg focus:ring-blue-500
                      block w-full p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Enter/scan Transfer ID"

                    />

                    <button
                      type='submit'
                      className="bg-[#fff] hover:bg-[#edc498] text-[#e69138] font-medium py-1 px-6 rounded-sm w-[15%]">
                      <span className='flex justify-center items-center'>
                        <p>Find</p>
                      </span>
                    </button>

                  </div>

                  <div className='flex justify-left gap-1'>

                    <input
                      onChange={handleChangevalidate}
                      value={shipmentValidate}
                      readOnly={!isValidationNeeded}
                      className="bg-gray-50 border border-gray-300 text-xs text-[#00006A] rounded-lg focus:ring-blue-500
                      block sm:w-[50%] p-1.5 md:p-2.5 placeholder:text-[#00006A]" placeholder="Enter/scan Shipment ID"

                    />

                    <button disabled={!isValidationNeeded}
                      style={{ cursor: !isValidationNeeded ? 'not-allowed' : '' }}
                      type='button'
                      onClick={handleShipmentIdValidation}
                      className="bg-[#fff] hover:bg-[#edc498] text-[#e69138] font-medium py-1 px-6 rounded-sm w-[15%]">
                      <span className='flex justify-center items-center'>
                        <p>Validate</p>
                      </span>
                    </button>
                  </div>

                </div>

                <div className='flex justify-between gap-2 mt-2 text-xs sm:text-xl'>
                  <div className='flex items-center sm:text-lg gap-2 text-white'>
                    <span>Results:</span>
                    <span>{data?.length}</span>
                  </div>
                </div>
              </form>
            </div>

            <div className="mb-6" style={{ marginLeft: '-20px', marginRight: '-20px' }}>

              <PutAwayTable
                secondaryColor="secondary"
                uniqueId={"pustawayScreen1"}
                data={data} columnsName={PalletizingByTransferIdColumn}
                isValidation={isValidation}
                isValidationNeeded={isValidationNeeded}
              // setIsValidation={setIsValidation}
              />
            </div >

          </div>
        </div>
      </div>
    </>
  )
}

export default PutAway