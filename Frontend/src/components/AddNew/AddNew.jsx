import "./AddNew.css";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { assetCategoryInput } from "../../utils/formSource";
// import Sidebar from "../../sidebar/Sidebar";
// import Navbar from "../../navbar/Navbar";
// import newRequest from "../../../utils/newRequest";
// import CustomSnakebar from "../../../utils/CustomSnakebar";
const AddNew = ({ inputs, title,
    method, apiEndPoint
}) => {
    const [isLoading, setIsLoading] = useState(false);
    // get selectedRow from session storage
    const selectedRow = JSON.parse(sessionStorage.getItem("selectedRow"));
    console.log(selectedRow);
    const [formValues, setFormValues] = useState(selectedRow);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };
    // const handleSubmit = async event => {
    //     // if form is not valid, do not submit
    //     if (!event.target.checkValidity()) {

    //         return;
    //     }
    //     event.preventDefault();
    //     try {
    //         setIsLoading(true);

    //         const data = {
    //             MainSubSeriesNo: event.target.MainSubSeriesNo.value,
    //             SeriesNumber: event.target.SeriesNumber.value,
    //             SubCategoryCode: event.target.SubCategoryCode.value,
    //             MainDescription: event.target.MainDescription.value,
    //             SubDescription: event.target.SubDescription.value,
    //             MainCategoryCode: event.target.MainCategoryCode.value,
    //         };
    //         console.log([data]);
    //         newRequest.post(
    //             "/PostMAINSUBSeriesNo", {
    //             data: [data],
    //         })
    //             .then((response) => {
    //                 setIsLoading(false);
    //                 console.log(response.data);
    //                 setMessage("Successfully Added");
    //                 // reset form
    //                 // document.getElementById("myForm").reset();

    //             }
    //             )
    //             .catch((error) => {
    //                 setIsLoading(false);
    //                 console.log(error);
    //                 setError(error?.response?.data?.message ?? "Failed to Add")
    //             }
    //             );
    //     } catch (error) {
    //         setIsLoading(false);
    //         console.log(error);
    //         setError("Failed to Add");
    //     }

    // };
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
                                {/* onSubmit={handleSubmit} */}
                                <form  id="myForm" >
                                    {assetCategoryInput.map((input) => (

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

export default AddNew;
