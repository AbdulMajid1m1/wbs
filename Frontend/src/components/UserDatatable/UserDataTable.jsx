// import "./UserDataTable.scss";
import "./UserDataTable.css"
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



const UserDataTable = ({
  columnsName = [],
  data,
  title,
  actionColumnVisibility,
  backButton,
  UniqueId,
  handleApiCall,
  deleteBtnEndPoint,
}) => {
  const navigate = useNavigate();
  const [record, setRecord] = useState([]);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };
  useEffect(() => {
    data.map((item, index) => {
      item.id = index + 1;
    });
    setRecord(
      data.map((item, index) => ({ ...item, id: index + 1 }))
    );
  }, [data]);


  // Retrieve the value with the key "myKey" from localStorage getvalue
  const myValue = localStorage.getItem("userId");
  console.log(myValue)

  const CustomCell = (params) => {
    const style = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'auto',
      minWidth: 0, // add this property
      maxWidth: '100%', // add this property
    };
    return (
      <div style={{ ...style, overflowX: 'auto' }}>
        {params.value}
      </div>
    );
  };
  const columnsWithCustomCell = columnsName.map((column) => {
    if (column.width) {
      return {
        ...column,
        renderCell: CustomCell,
      };
    }
    return column;
  });

  const idColumn = [
    {
      field: "id",
      headerName: "ID",
      width: 30,
    },
  ];

  return (
    <>
      {/* {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />} */}
      {/* {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />} */}

      <div className="datatable">
        <div className="datatableTitle">
          {title}
          <div className="stackauto">
            {/* <Stack spacing={2} width='200px'>
              <Autocomplete
                options={skills}
                renderInput={(params) => <TextField {...params} label='SHIPMENT ID' />}
              />
            </Stack> */}
            <input type="text" placeholder="SEARCH BY SHIPMENT ID"
             className="searchInput"
            />
          </div>

          <span className="leftDatatableTitle">
            {backButton && <button onClick={() => { navigate(-1) }}>Go Back</button>}
            {/* <button onClick={handlePrint}>Print Asset</button> */}
            {/* {UniqueId === "GenerateTagsId" ? <button onClick={handleApiCall}>GenerateTags</button> : <button>Print Asset</button>} */}
          </span>
        </div>

        <DataGrid

          getRowHeight={({ }) => {
            let x;
            title === "USER ACCOUNTS" ? x = 100 : x = 60;
            return x;
          }
          }
          className="datagrid"
          rows={record}
          columns={
            // actionColumnVisibility !== false
            //   ? idColumn.concat(columnsWithCustomCell.concat(actionColumn))
            //   : 
            idColumn.concat(columnsWithCustomCell)
          }
          pageSize={30}

          rowsPerPageOptions={[30]}
          checkboxSelection
        />

        {/* Displaying myValue inside the table Value in center*/}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "-40px", marginLeft: "10px", }}>
          <h1 style={{ whiteSpace: "nowrap" }}>UserId: {myValue}</h1>
          <style>
            {`
            @media (max-width: 480px) {
              h1 {
                display: none;
              }
            }
            `}
          </style>
        </div>

      </div>
    </>

  );
};

export default UserDataTable;
