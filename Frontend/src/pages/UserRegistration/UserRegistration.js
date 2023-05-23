import React, { useState } from 'react'
import alessa from "../../images/alessalogo2.png"
import "../UserRegistration/UserRegistration.css"
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import baseUrl from '../../utils/config'
import axios from 'axios'
import userRequest from '../../utils/userRequest'
import { SyncLoader } from 'react-spinners'

const Registration = () => {

  const [UserID, setUserID] = useState('')
  const [UserPassword, setUserPassword] = useState('')
  const [UserName, setUserName] = useState('')
  const [UserLevel, setUserLevel] = useState('')
  const [UserLocation, setUserLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    userRequest
      .post("/insertTblUsersData", null, {
        params: {
          UserID: UserID,
          UserPassword: UserPassword,
          Fullname: UserName,
          UserLevel: UserLevel,
          Loc: UserLocation,
        },
      })
      .then((response) => {
        Cookies.set("accessToken", response?.data?.token);
        localStorage.setItem("currentUser", JSON.stringify(response?.data?.user));
        navigate("/dashboard");
        setIsLoading(false)

      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message ?? 'Something went wrong!',
        })
      });
  }

  return (
    <div className='login_img_section'>


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


      <div className="h-screen flex">
        <div className="hidden lg:flex w-full lg:w-1/2 register_img_section
          justify-around items-center">
          <div
            className=" 
                  bg-black 
                  opacity-20 
                  inset-0 
                  z-0"
          >

          </div>
          <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
            <h1 className="text-white font-bold text-4xl font-sans">Alessa User Registration</h1>
            <p className="text-white mt-1">Warehouse Management System v.2.0</p>
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
          <div className="w-full px-8 md:px-32 lg:px-24">
            <form

              onSubmit={handleSubmit}
              className="bg-white rounded-md shadow-2xl p-5">
              <div className='flex justify-center '>
                <img src={alessa} className='h-24 w-auto' alt='' />
              </div>
              {/* <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1> */}
              <p className="text-sm font-normal text-gray-600 mb-8">Welcome Back WBS</p>

              <div className="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input id="userid"
                  onChange={(e) => setUserID(e.target.value)}
                  className=" pl-2 w-full outline-none border-none" type="text" name="email" placeholder="User Id"
                  required
                />
              </div>

              <div className="flex items-center border-2 mb-9 py-2 px-3 rounded-2xl ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input
                  required
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="pl-2 w-full outline-none border-none" type="password" name="password" id="password" placeholder="Password" />

              </div>

              <div className="flex items-center border-2 mb-9 -mt-3 py-2 px-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input id="username"
                  onChange={(e) => setUserName(e.target.value)}
                  className=" pl-2 w-full outline-none border-none" type="text" name="email" placeholder="User Name"
                  required
                />
              </div>

              <div className="flex items-center border-2 mb-9 -mt-3 py-2 px-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input id="userlevel"
                  onChange={(e) => setUserLevel(e.target.value)}
                  className=" pl-2 w-full outline-none border-none" type="text" placeholder="User Level"
                  required
                />
              </div>

              <div className="flex items-center border-2 mb-9 -mt-3 py-2 px-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input id="userlocation"
                  onChange={(e) => setUserLocation(e.target.value)}
                  className=" pl-2 w-full outline-none border-none" type="text" placeholder="User Location"
                  required
                />
              </div>

              <button
                type="submit"
                className="block w-full bg-[#FFA500] mt-5 py-2 rounded-2xl hover:bg-[#7b663e] hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
              >Register</button>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Registration