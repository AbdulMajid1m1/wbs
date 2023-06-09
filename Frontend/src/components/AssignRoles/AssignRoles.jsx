import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


import './AssignRoles.css'
import CustomSnakebar from '../../utils/CustomSnakebar'
import userRequest from '../../utils/userRequest'
import { AllRoleColumns, AllRolesAssignedColumns } from '../../utils/datatablesource'
import UserDataTable from '../UserDatatable/UserDataTable'


const AssignRoles = () => {
    const [detectChange, setDetectChange] = useState(false);
    const params = useParams();
    const { id, name } = params;

    sessionStorage.setItem('assignRoleId', id);



    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    // to reset snakebar messages
    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };
    const [userRolesList, setUserRolesList] = useState([]);
    const [allRolesList, setAllRolesList] = useState([]);
    // const [Snakebar, setSnakebar] = useState(false);

    useEffect(() => {
        const getAllRoles = async () => {
            try {
                const response = await userRequest.get("/getAlltblUserRoles")
                console.log(response?.data);

                setAllRolesList(response.data ?? []);
            }
            catch (error) {
                console.log(error);
                // check if the error is 401
                setAllRolesList([]);
                setError(error?.response?.data?.message ?? "Woops something went wrong");
            }
        };
        const getUserRoles = async () => {
            try {

                const response = await userRequest.get("/getRolesAssignedToUser?userId=" + id)
                console.log(response?.data);

                setUserRolesList(response?.data ?? []);
            }
            catch (error) {
                console.log(error)
                setUserRolesList([]);
                setError(error?.response?.data?.message ?? "woops something went wrong");
            }
        };

        getAllRoles();
        getUserRoles();
    }, [detectChange]);
    const detectAddRole = () => {
        console.log("detectAddRole");
        console.log(detectChange);
        setDetectChange(!detectChange);
    }
    return (
        <>

            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}
            <div className="userRoleHeadingContainer">
                <span className='mainSpain'>

                    <div>
                        USER NAME: <span>{name}</span>
                    </div>
                    <div>
                        USER ID: <span>{id}</span>
                    </div>
                </span>
                <div className="backBtnDiv">
                    <div
                        className="backBtn"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </div>

                </div>

            </div>


            <div className='userRolesContainer'>


                <span >
                    <UserDataTable columnsName={AllRoleColumns} data={allRolesList} actionColumnVisibility={false} title={"ALL USER ROLES"} buttonVisibility={false}
                        uniqueId="userAccountRoleId"
                        checkboxSelectionOption={false}
                        detectAddRole={detectAddRole}
                        checkboxSelection="disabled"
                        height="small"
                    />

                </span>
                <span>

                    <UserDataTable columnsName={AllRolesAssignedColumns} data={userRolesList} actionColumnVisibility={false}
                        checkboxSelectionOption={false}
                        title={"USER ROLES ASSIGNED"} buttonVisibility={false}
                        detectAddRole={detectAddRole}
                        uniqueId={"userRolesAssignedId"}
                        checkboxSelection="disabled"
                        height="small"
                    />
                </span>

            </div>
        </>
    )
}

export default AssignRoles