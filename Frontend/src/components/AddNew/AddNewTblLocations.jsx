import "./AddNew.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { TblAllLocationsInput, assetCategoryInput } from "../../utils/formSource";
import userRequest from "../../utils/userRequest";
import CustomSnakebar from "../../utils/CustomSnakebar";
const AddNewTblLocations = ({ inputs, title,
    method, apiEndPoint
}) => {
    const [isLoading, setIsLoading] = useState(false);
    // get selectedRow from session storage
    const selectedRow = JSON.parse(sessionStorage.getItem("selectedRow"));
    console.log(selectedRow);
    const [formValues, setFormValues] = useState(selectedRow);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };
    const handleSubmit = async event => {
        // if form is not valid, do not submit
        if (!event.target.checkValidity()) {
            return;
        }
        event.preventDefault();
        try {
            setIsLoading(true);

            const data = {
                MAIN: event.target.MAIN.value,
                WAREHOUSE: event.target.WAREHOUSE.value,
                ZONE: event.target.ZONE.value,
                BIN: event.target.BIN.value,
                ZONE_CODE: event.target.ZONE_CODE.value,
                ZONE_NAME: event.target.ZONE_NAME.value,
            };
            console.log(data);

            const queryParameters = new URLSearchParams(data).toString();

            userRequest.post(
                `/insertTblLocationsDataCL?${queryParameters}`)
                .then((response) => {
                    setIsLoading(false);
                    console.log(response.data);
                    setMessage("Successfully Added");
                    setTimeout(() => {
                        navigate(-1)
                    }, 1000)
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                    setError(error?.response?.data?.message ?? "Failed to Add")
                });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            setError("Failed to Add");
        }
    };

    const handleInputChange = (event, inputName) => {
        const value = event.target.value;
        setFormValues({
            ...formValues,
            [inputName]: value,
        });
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
                                    {TblAllLocationsInput.map((input) => (

                                        <div className="formInput" key={input.id}>
                                            <label htmlFor={input.name}>{input.label}</label>
                                            <input type={input.type} placeholder={input.placeholder} name={input.name} id={input.id} required
                                                // defaultValue={selectedRow && selectedRow[input.name]}
                                                value={formValues ? formValues[input.name] : ''}
                                                onChange={(event) => handleInputChange(event, input.name)}

                                            />
                                        </div>
                                    ))}

                                    <div className="buttonAdd" >
                                        <button
                                            style={{background: '#e69138'}}
                                            type="submit"
                                        >Save</button>
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

export default AddNewTblLocations;
