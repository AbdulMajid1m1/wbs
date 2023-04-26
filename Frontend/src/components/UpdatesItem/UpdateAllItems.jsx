import "../AddNew/AddNew.css";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { assetCategoryInput, updateAllItemsInput } from "../../utils/formSource";
import userRequest from "../../utils/userRequest";
// import Sidebar from "../../sidebar/Sidebar";
// import Navbar from "../../navbar/Navbar";
// import newRequest from "../../../utils/newRequest";
// import CustomSnakebar from "../../../utils/CustomSnakebar";


const UpdateAllItems = ({ inputs, title,
}) => {
    const params = useParams();
    // get id from url
    const { id } = params;
    const [rowData, setstateRowData] = useState([]);
    // useEffect(() => {
    //     console.log(id)
    //     newRequest.post("/GetMAINSUBSeriesNoById", { TblMAINSUBSeriesNoID: id })
    //         .then((response) => {
    //             console.log(response.data);
    //             setstateRowData(response?.data?.recordset[0] ?? []);
    //             console.log("rowData");
    //             console.log(response?.data?.recordset[0] ?? []);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);

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


    const [rowdata, setRowData] = useState(() => {
        const storedData = sessionStorage.getItem('edit');
        const parsedData = JSON.parse(storedData);
        // console.log(parsedData)
        return parsedData
    })
    console.log(rowdata)

    // Handle Submit
    const handleSubmit = async event => {
        event.preventDefault();
        setIsLoading(true);

        // Convert the data object to a query string and append it to the URL
        // Convert the data object to a query string and append it to the URL
        // Convert the data object to a query string and append it to the URL
        const data = {
            SHIPMENTSTATUS: "3.0",
            SHIPMENTID: "ABC123",
            ENTITY: "Company A",
            CONTAINERID: "CONT001",
            ARRIVALWAREHOUSE: "Warehouse A",
            ITEMNAME: "Product A",
            QTY: "10.0",
            ITEMID: "ITEM001",
            PURCHID: "PURCH00",
            CLASSIFICATION: "2.0",
        };

        const queryString = new URLSearchParams(data).toString();
        const url = `/updateShipmentRecievingDataCL?${queryString}`;

        // Make the request with the updated URL
        userRequest
            .put(url)
            .then((response) => {
                setIsLoading(false);
                console.log(response.data);
                setMessage("Successfully Updated");
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
                setError("Failed to Update");
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
                                <form onSubmit={handleSubmit} id="myForm" >
                                    {updateAllItemsInput.map((input) => (

                                        <div className="formInput" key={input.id}>
                                            <label htmlFor={input.name}>{input.label}</label>
                                            <input type={input.type} placeholder={input.placeholder} name={input.name} id={input.id} required
                                                defaultValue={rowdata && rowdata[input.name]}
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

export default UpdateAllItems;
