import "./AddNew.css";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { TblDispatchingInsertColumn } from "../../utils/formSource";
import userRequest from "../../utils/userRequest";
import CustomSnakebar from "../../utils/CustomSnakebar";

const AddDispatchingCl = ({ inputs, title,
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
    //             PACKINGSLIPID: event.target.PACKINGSLIPID.value,
    //             VEHICLESHIPPLATENUMBER: event.target.VEHICLESHIPPLATENUMBER.value,
    //             INVENTLOCATIONID: event.target.INVENTLOCATIONID.value,
    //             ITEMID: event.target.ITEMID.value,
    //             ORDERED: event.target.ORDERED.value,
    //             NAME: event.target.NAME.value,
    //             CONFIGID: event.target.CONFIGID.value,
    //             SALESID: event.target.SALESID.value,
    //             // NAME: event.target.NAME.value,
    //             // CONFIGID: event.target.CONFIGID.value,
    //             // PICKINGROUTEID: event.target.PICKINGROUTEID.value,
    //         };
            
    //         console.log(data);

    //         const queryParameters = new URLSearchParams(data).toString();

    //         userRequest.post(
    //             `/insertTblDispatchingDataCL?${queryParameters}`)
    //             .then((response) => {
    //                 setIsLoading(false);
    //                 console.log(response.data);
    //                 setMessage("Successfully Added");
    //                 setTimeout(() => {
    //                     navigate(-1)
    //                 }, 1000)
    //             })
    //             .catch((error) => {
    //                 setIsLoading(false);
    //                 console.log(error);
    //                 setError(error?.response?.data?.message ?? "Failed to Add")
    //             });
    //     } catch (error) {
    //         setIsLoading(false);
    //         console.log(error);
    //         setError("Failed to Add");
    //     }
    // };

    const handleSubmit = async (event) => {
        // if form is not valid, do not submit
        if (!event.target.checkValidity()) {
          return;
        }
        event.preventDefault();
        try {
          setIsLoading(true);
      
          const data = {
            PACKINGSLIPID: event.target.PACKINGSLIPID.value,
            VEHICLESHIPPLATENUMBER: event.target.VEHICLESHIPPLATENUMBER.value,
            INVENTLOCATIONID: event.target.INVENTLOCATIONID.value,
            ITEMID: event.target.ITEMID.value,
            ORDERED: event.target.ORDERED.value,
            NAME: event.target.NAME.value,
            CONFIGID: event.target.CONFIGID.value,
            SALESID: event.target.SALESID.value,
            // other parameters
          };
      
          console.log(data);
      
          userRequest
            .post(`/insertTblDispatchingDataCL`, [data]) // Pass the data object as the request body
            .then((response) => {
              setIsLoading(false);
              console.log(response.data);
              setMessage("Successfully Added");
              setTimeout(() => {
                navigate(-1);
              }, 1000);
            })
            .catch((error) => {
              setIsLoading(false);
              console.log(error);
              setError(error?.response?.data?.message ?? "Failed to Add");
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
                                    {TblDispatchingInsertColumn.map((input) => (

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

export default AddDispatchingCl;
