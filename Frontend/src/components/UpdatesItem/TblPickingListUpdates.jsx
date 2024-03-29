import "../AddNew/AddNew.css";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { TblPickingClInsertInput } from "../../utils/formSource";
import userRequest from "../../utils/userRequest";
import CustomSnakebar from "../../utils/CustomSnakebar";


const TblPickingListUpdates = ({ inputs, title,
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


    // Handle Submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const updatedData = {};

            for (const input of TblPickingClInsertInput) {
                const inputName = input.name;
                if (
                    formData[inputName] !== undefined &&
                    formData[inputName] !== rowdata[inputName]
                ) {
                    updatedData[inputName] = formData[inputName];
                }
            }

            updatedData["PICKINGROUTEID"] = id;
            updatedData["TRANSREFID"] = rowdata["TRANSREFID"];
            updatedData["ITEMID"] = rowdata["ITEMID"];

            if (Object.keys(updatedData).length <= 1) {
                setError("No changes detected.");
                setIsLoading(false);
                return;
            }

            const queryParameters = new URLSearchParams(updatedData).toString();

            userRequest
                .put(`/updateTblPickingDataCL?${queryParameters}`)
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
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toISOString().split('T')[0];
    }

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
                                    {TblPickingClInsertInput.map((input) => (

                                        <div className="formInput" key={input.id}>
                                            <label htmlFor={input.name}>{input.label}</label>
                                            <input type={input.type} placeholder={input.placeholder} name={input.name} id={input.id} required
                                                // defaultValue={rowdata && rowdata[input.name]}
                                                defaultValue={input.type === 'date' && rowdata ? formatDate(rowdata[input.name]) : rowdata[input.name]}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        [input.name]: e.target.value,
                                                    })
                                                }

                                                disabled={["PICKINGROUTEID", "ITEMID", "TRANSREFID"].includes(input.name)}
                                            />
                                        </div>

                                    ))}
                                    {TblPickingClInsertInput.length % 2 !== 0 && <div className="formInput"></div>}


                                    <div className="buttonAdd" >
                                        <button
                                            style={{ background: '#e69138' }}
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

export default TblPickingListUpdates;
