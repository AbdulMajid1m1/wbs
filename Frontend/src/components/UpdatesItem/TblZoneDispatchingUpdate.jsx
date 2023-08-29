import "../AddNew/AddNew.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { TblZoneDispatchingUpdateColumn } from "../../utils/formSource";
import userRequest from "../../utils/userRequest";
import CustomSnakebar from "../../utils/CustomSnakebar";


const TblZoneDispatchingUpdate = ({ inputs, title,
}) => {

const params = useParams();
const { id } = params;
const [rowData, setRowData] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState({});
const [error, setError] = useState(false);
const [message, setMessage] = useState("");
const navigate = useNavigate();

useEffect(() => {
  const storedData = sessionStorage.getItem('edit');
  const parsedData = JSON.parse(storedData);
  setRowData(parsedData);
}, []);


    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };


const handleSubmit = async event => {
  event.preventDefault();
  setIsLoading(true);

  try {
    const updatedData = {
        tbl_DZONESID: id,
      ...formData
    };

    if (Object.keys(updatedData).length === 1) {
      setError("No changes detected.");
      setIsLoading(false);
      return;
    }

    userRequest
      .put("/updateDzoneData", updatedData)
      .then(response => {
        setIsLoading(false);
        console.log(response.data);
        setMessage("Successfully Updated");
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
        setError(error?.response?.data?.message ?? "Failed to Update");
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
                    {/* Spinners */}
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
                                    {TblZoneDispatchingUpdateColumn.map((input) => (

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
                                                disabled={input.name === "tbl_DZONESID"} // Add the disabled attribute conditionally
                                          
                                          />
                                        </div>
                                    ))}

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

export default TblZoneDispatchingUpdate;
