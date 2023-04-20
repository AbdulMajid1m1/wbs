// import "./UserDataTable.scss";
import "./UserDataTable.css"
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import userRequest from "../../utils/userRequest";
const UserDataTable = ({
  columnsName = [],
  data,
  title,
  actionColumnVisibility,
  backButton,
  uniqueId,
  handleApiCall,
  deleteBtnEndPoint,
  ShipmentIdSearchEnable,
  ContainerIdSearchEnable,

}) => {
  const navigate = useNavigate();
  const [record, setRecord] = useState([]);
  const [shipmentIdSearch, setShipmentIdSearch] = useState("");
  const [containerIdSearch, setContainerIdSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState(null);
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

  // const filteredData = shipmentIdSearch
  //   ? record.filter((item) =>
  //     item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase())
  //   )
  //   : record;

  const filteredData = shipmentIdSearch && containerIdSearch
    ? record.filter((item) =>
      item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase()) && item.CONTAINERID.toLowerCase().includes(containerIdSearch.toLowerCase())
    )
    : shipmentIdSearch && !containerIdSearch
      ? record.filter((item) =>
        item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase())
      )
      : !shipmentIdSearch && containerIdSearch
        ? record.filter((item) =>
          item.CONTAINERID.toLowerCase().includes(containerIdSearch.toLowerCase())
        )
        : record;



  const handleSearch = (e) => {
    // setShipmentIdSearch(e.target.value);
    e.target.name === "SHIPMENTID" ? setShipmentIdSearch(e.target.value) : setContainerIdSearch(e.target.value);
    console.log(e.target.name, e.target.value);
    console.log(shipmentIdSearch, containerIdSearch);
  };
  // Retrieve the value with the key "myKey" from localStorage getvalue
  const myValue = localStorage.getItem("userId");
  console.log(myValue)

  // Delete Action
  const handleDelete = async (id, rowdata) => {
    switch
    (uniqueId) {
      case "assetPrintingId":
        console.log(rowdata.TagNumber);
        data = { TagNumber: rowdata.TagNumber };
        userRequest.delete(deleteBtnEndPoint, { data }).then((response) => {
          console.log(response);
          setMessage(response?.data?.message ?? "User deleted successfully");
          setSeverity("success");
        }).catch((error) => {
          setMessage(error?.message ?? "Something went wrong");
          setSeverity("error");
        }
        )

        break;
      default:
        // do nothing
        break;
    }

    if (true) {
      setRecord(record.filter((item) => item.id !== id));
      // alert("User deleted successfully");
    }
  }

  //Edit
  const handleEdit = async (rowData) => {

    switch (uniqueId) {
      case "itemTableId":
        navigate("/admin/database-config/asset-categories/update-asset-category/" + rowData.TblMAINSUBSeriesNoID)
        break;
      default:
        // do nothing
        break;
    }
  };


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

  
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id, params.row)}
            >
              Delete
            </div>
            <span
              onClick={() => handleEdit(params.row)}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Update</div>
            </span>
          </div>
        );
      },
    },
  ];

  // const idColumn = [
  //   {
  //     field: "id",
  //     headerName: "ID",
  //     width: 30,
  //   },
  // ];

  return (
    <>
      {/* {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />} */}
      {/* {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />} */}

      <div className="datatable">
        <div className="datatableTitle">
          <div className="left-div">
            <span>{title}</span>
            {ShipmentIdSearchEnable &&
              ShipmentIdSearchEnable === true ? <span>
              <input
                type="text"
                placeholder="SEARCH BY SHIPMENT ID"
                name="SHIPMENTID"
                className="searchInput"
                onChange={handleSearch}
              />
            </span> : null
            }

            {ContainerIdSearchEnable &&
              ContainerIdSearchEnable === true ? <span>
              <input
                type="text"
                name="CONTAINERID"
                placeholder="SEARCH BY CONTAINER ID"
                className="searchInput"
                onChange={handleSearch}
              />
            </span> : null}

          </div>

          <span className="leftDatatableTitle">
            {backButton && <button onClick={() => { navigate(-1) }}>Go Back</button>}
            {/* <button onClick={handlePrint}>Print Asset</button> */}
            {/* {uniqueId === "GenerateTagsId" ? <button onClick={handleApiCall}>GenerateTags</button> : <button>Print Asset</button>} */}
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
          // rows={record}
          rows={filteredData}
          // columns={
          //   // actionColumnVisibility !== false
          //   //   ? idColumn.concat(columnsWithCustomCell.concat(actionColumn))
          //   //   : 
          //   idColumn.concat(columnsWithCustomCell)
          // }
          columns={
            actionColumnVisibility !== false
              ? idColumn.concat(columnsWithCustomCell.concat(actionColumn))
              : idColumn.concat(columnsWithCustomCell)
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
