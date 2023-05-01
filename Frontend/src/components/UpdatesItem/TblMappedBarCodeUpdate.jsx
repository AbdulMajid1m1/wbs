import "../AddNew/AddNew.css";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';

import userRequest from "../../utils/userRequest";
import CustomSnakebar from "../../utils/CustomSnakebar";
import { mappedBarcodesInput } from "../../utils/formSource";


const TblMappedBarCodeUpdate = ({ inputs, title,
}) => {
    const params = useParams();
    // get id from url
    const { id } = params;
    const [rowData, setstateRowData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({});

    // get state data from navigation 

    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    // to reset snakebar messages
    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };



    const [rowdata, setRowData] = useState(() => {
        const storedData = sessionStorage.getItem('edit');
        const parsedData = JSON.parse(storedData);
        // console.log(parsedData)
        return parsedData
    })
    console.log(rowdata)

    // Handle Submit
    // ...
    // Handle Submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const updatedData = {};

            for (const input of mappedBarcodesInput) {
                const inputName = input.name;
                if (
                    formData[inputName] !== undefined &&
                    formData[inputName] !== rowdata[inputName]
                ) {
                    updatedData[inputName] = formData[inputName];
                }
            }

            // Ensure that the id value is assigned to the itemcode
            updatedData["itemcode"] = id;

            if (Object.keys(updatedData).length <= 1) {
                setError("No changes detected.");
                setIsLoading(false);
                return;
            }

            // Pass the headers correctly while making the request
            const headers = { ...userRequest.defaults.headers };
            for (const key in updatedData) {
                headers[key] = updatedData[key];
            }

            userRequest
                .put(`/updateTblMappedBarcodeByItemCode`, {}, { headers })
                .then((response) => {
                    setIsLoading(false);
                    console.log(response.data);
                    setMessage("Successfully Updated");
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000);
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                    setError(
                        error?.response?.data?.message ?? "Failed to Update"
                    );
                });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            setError("Failed to Update");
        }
    };

    // ...


    return (
        <>

            {isLoading &&

                <div className='loading-spinner-background'
                    style={{
                        zIndex: 9999, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed'


                    }}
                >
                    <BeatLoader
                        size={18}
                        color={"#6439ff"}
                        // height={4}
                        loading={isLoading}
                    />
                </div>
            }

            <span
            >
                {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
                {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

                <div className="assetCategoryForm">
                    {/* <Sidebar /> */}
                    <div className="newContainer">
                        {/* <Navbar /> */}
                        <div className="top">
                            <span className="topSpan">

                                <h1>{title}</h1>
                                <button
                                    onClick={() => navigate(-1)}
                                >Go Back</button>
                            </span>
                        </div>
                        <div className="bottom">


                            <div className="right">
                                <form onSubmit={handleSubmit} id="myForm" >
                                    {mappedBarcodesInput.map((input) => (

                                        <div className="formInput" key={input.id}>
                                            <label htmlFor={input.name}>{input.label}</label>
                                            <input type={input.type} placeholder={input.placeholder} name={input.name} id={input.id} required
                                                defaultValue={
                                                    rowdata && input.type === "date"
                                                        ? new Date(rowdata[input.name]).toISOString().split("T")[0]
                                                        : rowdata && rowdata[input.name]
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        [input.name]: e.target.value,
                                                    })
                                                }
                                                disabled={input.name === "PICKINGROUTEID" ? true : false}
                                            />
                                        </div>

                                    ))}
                                    {mappedBarcodesInput.length % 2 !== 0 && <div className="formInput"></div>}


                                    <div className="buttonAdd" >
                                        <button
                                            style={{background: '#e69138'}}
                                            type="submit"
                                        >Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                </div >

            </span >
        </>
    );
};

export default TblMappedBarCodeUpdate;
