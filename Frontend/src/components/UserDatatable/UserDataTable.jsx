// import "./UserDataTable.scss";
import "./UserDataTable.css"
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import userRequest from "../../utils/userRequest";
import CustomSnakebar from "../../utils/CustomSnakebar";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import * as XLSX from 'xlsx';
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
  buttonVisibility,
  addNewNavigation,
  detectAddRole

}) => {
  const navigate = useNavigate();
  const [record, setRecord] = useState([]);
  const [shipmentIdSearch, setShipmentIdSearch] = useState("");
  const [containerIdSearch, setContainerIdSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [muiFilteredData, setMuiFilteredData] = useState([]);
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


  const handleDelete = async (id, rowdata) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      let success = false;

      switch (uniqueId) {
        case "SERIALNUM":
          // call the api to delete the data from the shipment table
          try {
            const response = await userRequest.delete(
              "deleteShipmentRecievedDataCL?SERIALNUM=" + rowdata.SERIALNUM
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;

        case "SHIPMENTID":
          // call the api to delete the data from the shipment table
          try {
            const response = await userRequest.delete(
              "deleteShipmentRecievingDataCL?SHIPMENTID=" + rowdata.SHIPMENTID
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;

        case "locationTableId":
          try {
            const response = await userRequest.delete(
              "deleteTblLocationsDataCL?LOCATIONS_HFID=" + rowdata.LOCATIONS_HFID
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // call the api to delete the data from the itemsCL table
        case "itemTableId":
          try {
            const response = await userRequest.delete(
              "deleteTblItemsCLData?ITEMID=" + rowdata.ITEMID
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // call the api to delete the data from the itemsCL table
        case "PACKINGSLIPID":
          try {
            const response = await userRequest.delete(
              "deleteTblDispatchingDataCL?PACKINGSLIPID=" + rowdata.PACKINGSLIPID
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // call the api to delete the data from the PickingCL table
        case "PICKINGROUTEID":
          try {
            const response = await userRequest.delete(
              "deleteTblPickingDataCL?PICKINGROUTEID=" + rowdata.PICKINGROUTEID
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;



        // call the api to delete the data from the Mapped table
        case "ItemCode":
          try {
            const response = await userRequest.delete(
              "deleteTblMappedBarcodesDataByItemCode",
              {
                headers: {
                  ...userRequest.defaults.headers,
                  ItemCode: rowdata.ItemCode,
                },
              }
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // call the api to delete the data from the Palletizing table
        case "TRANSFERID":
          try {
            const response = await userRequest.delete(
              "deleteShipmentPalletizingDataCL?TRANSFERID=" + rowdata.TRANSFERID
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;


        default:
          // do nothing
          break;
      }

      if (success) {
        setRecord(record.filter((item) => item.id !== id));
      }
    }
  };



  //Edit
  const handleEdit = async (rowData) => {
    // sessionStorage.setItem("edit", JSON.stringify(rowData));

    sessionStorage.setItem('edit', JSON.stringify(rowData));
    console.log(rowData)
    switch (uniqueId) {
      case "SERIALNUM":
        navigate("/shipmentupdate/" + rowData.SHIPMENTID)
        break;
      case "SHIPMENTID":
        navigate("/update/" + rowData.SHIPMENTID)
        break;
      case "ITEMNAME":
        navigate("/allitems/" + rowData.ITEMNAME)
        break;
      case "itemTableId":
        navigate("/allitems/" + rowData.ITEMID)
        break;
      case "locationTableId":
        navigate("/tblLocationupdate/" + rowData.LOCATIONS_HFID)
        break;
      case "PACKINGSLIPID":
        navigate("/tbldispatchingupdates/" + rowData.PACKINGSLIPID)
        break;
      case "PICKINGROUTEID":
        navigate("/tblpickingupdates/" + rowData.PICKINGROUTEID)
        break;
      case "ItemCode":
        navigate("/tblmappedbarcodesupdates/" + rowData.ItemCode)
        break;
      case "TRANSFERID":
        navigate("/updatepalletizing/" + rowData.ALS_PACKINGSLIPREF)
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

  const handleExport = () => {
    // get only the data from the record array which matsch columnsName field
    const data = record.map((item) => {
      const row = {};
      columnsName.forEach((column) => {
        row[column.field] = item[column.field];
      });

      return row;
    });
    // Create a new array that excludes the 'id' field
    const dataWithoutId = data.map(({ id, ...rest }) => rest);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataWithoutId); // Pass the new array to the 'json_to_sheet' method
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title}.xlsx`); // Export the file
  };





  const handlePdfExport = () => {
    const doc = new jsPDF("landscape");

    // Calculate the font size based on the number of columns
    const maxColumns = 10; // Maximum number of columns before font size starts to decrease
    const minFontSize = 4; // Minimum font size
    const maxFontSize = 8; // Maximum font size
    const fontSize = columnsName.length <= maxColumns ? maxFontSize : Math.max(minFontSize, maxFontSize - (columnsName.length - maxColumns));

    const tableData = record.map((item) => {
      const row = {};
      columnsName.forEach((column) => {
        row[column.field] = item[column.field];
      });
      return Object.values(row);
    });

    const headers = columnsName.map((column) => column.headerName);

    // Use autoTable to generate the table in the PDF
    doc.autoTable({
      head: [headers],
      body: tableData,
      theme: "grid",
      styles: { fontSize: fontSize },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      startY: 20,
      tableWidth: "auto", // Automatically adjust table width based on content
    });

    doc.save(`${title}.pdf`);
  };


  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleOpenPopup = () => {
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    setIsOpen(false);
  };






  return (
    <>
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

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
            {buttonVisibility !== false && <span className="leftDatatableTitle"
              onClick={uniqueId === "SERIALNUM" ?
                // cleart sessionStorage for receiptsData
                () => { sessionStorage.removeItem("receiptsData") }
                : null}

            >
              <Link to={addNewNavigation} className="link">
                Add New
              </Link>
              <button onClick={handleOpenPopup}>Send to Email</button>
              <button onClick={handleExport}>Export to Excel</button>
              <button onClick={() => handlePdfExport(8)}
              >Export to Pdf</button>

            </span>
            }

            {backButton && <button onClick={() => { navigate(-1) }}>Go Back</button>}
          </span>
        </div>


        <DataGrid
          slots={{ toolbar: GridToolbar }}
          getRowHeight={({ }) => {
            let x;
            title === "USER ACCOUNTS" ? x = 100 : x = 60;
            return x;
          }
          }
          className="datagrid"
          // rows={record}
          rows={filteredData}

          columns={
            actionColumnVisibility !== false
              ? idColumn.concat(columnsWithCustomCell.concat(actionColumn))
              // ? idColumn.concat(columnsWithCustomCell.concat(RemoveBtn))
              : idColumn.concat(columnsWithCustomCell)
          }
          pageSize={30}
          rowsPerPageOptions={[30, 50, 100]}

          checkboxSelection
        />


        {/* Email Screen */}
        {isOpen && (
          <div className="popup-container">
            <div className="popup">
              <div className="header">
                <h2>Shipment Receiving Email</h2>
                {/* <button className="close-btn" onClick={handleClosePopup}>
                x
              </button> */}
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                />

                <label htmlFor="subject">Subject:</label>
                <input
                  type="subject"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Subject"
                />

                <label htmlFor="sendTo">Send To:</label>
                <input
                  type="sendTo"
                  id="sendTo"
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  required
                  placeholder="Send To"
                />

                <label htmlFor="remarks">Remarks:</label>
                <input
                  type="remarks"
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                  placeholder="Remarks"
                />

                <div className="flex gap-3">
                  <button className="close-btn" type="button" onClick={handleClosePopup}>CANCEL</button>
                  <button type="submit">SEND</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>

  );
};

export default UserDataTable;
