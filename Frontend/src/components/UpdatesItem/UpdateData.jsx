import "../AddNew/AddNew.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { assetCategoryInput } from "../../utils/formSource";
import userRequest from "../../utils/userRequest";


const UpdateData = ({ inputs, title,
}) => {
    const params = useParams();
    // get id from url
    const { id } = params;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({});

    // get state data from navigation 

    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");


    const navigate = useNavigate();

    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };


    const [rowData, setstateRowData] = useState(() => {
        const storedData = sessionStorage.getItem('edit');
        const parsedData = JSON.parse(storedData);
        // console.log(parsedData)
        return parsedData
    })

    // Handle Submit
    // Handle Submit
    const handleSubmit = async event => {
        event.preventDefault();
        setIsLoading(true);
        try {
            // Use the PUT method and pass formData as query parameters
            userRequest.put("/updateShipmentRecievingDataCL", null, { params: formData })
                .then((response) => {
                    setIsLoading(false);
                    console.log(response.data);
                    setMessage("Successfully Updated");
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                    console.log("Error hai")
                    setError("Failed to Update");
                });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            setError("Failed to Update");
        }
    };

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
                {/* {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />} */}
                {/* {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />} */}

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
                                    {assetCategoryInput.map((input) => (

                                        <div className="formInput" key={input.id}>
                                            <label htmlFor={input.name}>{input.label}</label>
                                            <input type={input.type} placeholder={input.placeholder} name={input.name} id={input.id} required
                                                defaultValue={rowData && rowData[input.name]}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        [input.name]: e.target.value,
                                                    })
                                                }
                                            // disabled={input.name === "MainCategoryCode" || input.name === "SubCategoryCode" ? true : false}
                                            />
                                        </div>
                                    ))}

                                    <div className="buttonAdd" >
                                        <button
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

export default UpdateData;
